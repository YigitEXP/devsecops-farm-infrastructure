from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from auth import get_password_hash, create_access_token, verify_password, decode_access_token  # auth.py'den gelen fonksiyonlar
from db import users_collection  # db.py'den gelen hazır bağlantı
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis.asyncio as redis
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_conn = redis.from_url("redis://redis-cache:6379")
    yield
    await redis_conn.close()

# SlowAPI Limiter - Redis storage ile
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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

# 2. Register Fonksiyonu - Saatte 3 deneme limiti
@app.post("/register")
@limiter.limit("3/hour")
async def register(request: Request, user: UserAuthSchema): # Body'den okuması için 'user' parametresi şart
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

# 3. Login Fonksiyonu - Dakikada 5 deneme limiti
@app.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, user: UserAuthSchema):
    db_user = await users_collection.find_one({"username": user.username.lower()})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Kullanici adi veya sifre hatali!")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}