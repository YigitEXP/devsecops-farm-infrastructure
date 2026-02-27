#!/bin/bash

export PATH=$PATH:/c/DEVELOPER/tools
COMMAND=$1

show_help() {
    echo "--------------------------------------------------"
    echo "❌ Hatalı kullanım!"
    echo "Kullanım: bash operate.sh [start|stop|logs|backup|trivy-scan|hard-start]"
    echo "--------------------------------------------------"
}

if [ -z "$COMMAND" ]; then
    show_help
    exit 1
fi

case "$COMMAND" in
    "start")
        echo "🚀 Sistem ayağa kaldırılıyor.."
        docker-compose up -d --build
        echo "✅ http://localhost adresinden erişebilirsiniz."
        ;;
    "stop")
        echo "🛑 Sistem durduruluyor..."
        docker-compose down
        ;;
    "logs")
        echo "📋 Backend logları getiriliyor..."
        docker-compose logs -f backend-api
        ;;
    "hard-start")
        echo "🔄 Tam temizlik ve Hard Start..."
        docker-compose down
        docker-compose build --no-cache frontend
        docker-compose up -d
        ;;
    *)
        show_help
        exit 1
        ;;
esac