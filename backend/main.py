from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from auth import get_password_hash, create_access_token, verify_password, decode_access_token  # auth.py'den gelen fonksiyonlar
from db import users_collection  # db.py'den gelen hazır bağlantı
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:5173", # React'in varsayılan portu
    "http://127.0.0.1:5173" # Alternatif localhost adresi,
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], # Sadece gerekenler
    allow_headers=["Authorization", "Content-Type"], # Sadece gereken başlıklar
)

security = HTTPBearer()
@app.get('/')
def Hello():
    return {"message": "Backend is working!", "status": "active"}

@app.get("/db-test")
async def db_test():
    try:
        # users_collection üzerinden basit bir sayım testi yapalım
        count = await users_collection.count_documents({})
        return {"message": "Database connection successful!", "count": count}
    except Exception as e:
        return {"message": "Database connection failed!", "error": str(e)}

@app.get("/me")
async def get_my_info(auth: HTTPAuthorizationCredentials = Depends(security)):
    token = auth.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(status_code=401, detail="Gecersiz veya suresi dolmus token!")
    
    return {"username": payload.get("sub"), "message": "Token gecerli, kullanici bilgisi alindi!", "details": payload}

# 1. Önce şemayı tanımla (Dosyanın üst kısımlarında olsun)
class UserAuthSchema(BaseModel):
    username: str
    password: str

# 2. Register Fonksiyonu (Sadece bir tane olsun)
@app.post("/register")
async def register(user: UserAuthSchema): # Body'den okuması için 'user' parametresi şart
    username = user.username.lower()
    existing_user = await users_collection.find_one({"username": username})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu kullanici adi zaten alinmis!")

    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": username,
        "password": hashed_password
    }
    await users_collection.insert_one(new_user)
    return {"message": f"Kullanici {user.username} basariyla kaydedildi!"}

# 3. Login Fonksiyonu 
@app.post("/login")
async def login(user: UserAuthSchema):
    db_user = await users_collection.find_one({"username": user.username.lower()})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Kullanici adi veya sifre hatali!")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}