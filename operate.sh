#!/bin/bash

# Trivy'nin yolunu Bash ortamına kalıcı olarak ekliyoruz
export PATH=$PATH:/c/DEVELOPER/tools
COMMAND=$1

# Eğer argüman 'baslat' ise...
if [ "$COMMAND" == "start" ]; then
    echo "🚀 Sistem ayağa kaldırılıyor..."
    # TODO: Sistemi arka planda (detached) ayağa kaldıran ve imajları derleyen o uzun docker-compose komutunu buraya yaz.
    docker-compose up -d --build

# Eğer argüman 'durdur' ise...
elif [ "$COMMAND" == "stop" ]; then
    echo "🛑 Sistem durduruluyor ve ağ temizleniyor..."
    # TODO: Çalışan docker-compose sistemini tamamen durduran ve konteynerleri silen komutu yaz. (İpucu: 'up' kelimesinin zıttı)
    docker-compose down

# Eğer argüman 'loglar' ise...
elif [ "$COMMAND" == "logs" ]; then
    echo "📋 Backend logları getiriliyor..."
    # TODO: Sadece 'sec-backend' isimli konteynerin loglarını ekrana yazdıran komutu yaz.
    docker-compose logs backend-api

elif [ "$COMMAND" == "backup" ]; then
    echo "--- Şifreli Yedekleme Başlatılıyor ---"
    mkdir -p ./.secret_backups
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # 1. Önce veriyi al, sonra OpenSSL ile şifrele
    # 'openssl enc -aes-256-cbc' komutu bir şifre isteyecek
    docker exec sec-mongodb mongodump --archive --gzip --db bulletproof_db | \

    MASTER_KEY=$(grep MASTER_KEY .env | cut -d '=' -f2)
    docker exec sec-mongodb mongodump --archive --gzip --db bulletproof_db | \
    openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
    -out ./.secret_backups/backup_$TIMESTAMP.gz.enc \
    -pass pass:"$MASTER_KEY"

    chmod 600 ./.secret_backups/*.enc
    echo "✅ Şifreli yedek oluşturuldu: .secret_backups/backup_$TIMESTAMP.gz.enc"

    find ./.secret_backups/ -name "*.gz" -type f -mtime +7 -delete

elif [ "$COMMAND" == "scan" ]; then
    echo "🔍 Güvenlik taraması yapılıyor..."

# Windows/Git Bash uyumluluğu için daha esnek bir kontrol
    if ! trivy --version >/dev/null 2>&1; then
        echo \"❌ Trivy komutu bulunamadi!\"
        exit 1
    fi

    mkdir -p trivy-reports

    # 1) Dosya sistemi taraması (repo içi secret + vuln + config)
    trivy fs . \
      --scanners vuln,secret,config \
      --severity HIGH,CRITICAL \
      --format table \
      --output trivy-reports/fs-report.txt

    # 2) Docker image taraması (compose içindeki image'ları otomatik alır)
    for img in $(docker-compose config --images); do
        safe_name=$(echo "$img" | tr '/:' '__')
        echo "Image taranıyor: $img"
        trivy image "$img" \
          --severity HIGH,CRITICAL \
          --format table \
          --output "trivy-reports/image-${safe_name}.txt"
    done

    echo "✅ Tarama tamamlandı. Raporlar: trivy-reports/"

else
    # Eğer kullanıcı yanlış bir şey yazarsa veya hiçbir şey yazmazsa yardım menüsü gösterelim
    echo "--------------------------------------------------"
    echo "❌ Hatalı kullanım veya eksik komut!"
    echo "Kullanım Şekli: ./operate.sh [KOMUT]"
    echo "Geçerli Komutlar:"
    echo "  start  -> Sistemi derler ve ayağa kaldırır."
    echo "  stop   -> Sistemi durdurur ve konteynerleri siler."
    echo "  logs   -> Backend servisinin loglarını gösterir."
    echo "  backup -> Veritabanının yedeğini alır."
    echo "  scan   -> Dosya sistemi ve Docker image'larını güvenlik taramasından geçirir."
    echo "--------------------------------------------------"
fi