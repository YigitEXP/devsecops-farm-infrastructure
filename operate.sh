#!/bin/bash

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
    echo "📦 Veritabanı yedeği alınıyor..."
    docker exec sec-mongodb mongodump --archive --gzip > db_backup_$(date +%Y%m%d_%H%M).gz

elif [ "$COMMAND" == "scan" ]; then
    echo "🔍 Güvenlik taraması yapılıyor..."

    if ! command -v trivy >/dev/null 2>&1; then
        echo "❌ Trivy bulunamadı. Kurulum: https://trivy.dev/latest/getting-started/installation/"
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