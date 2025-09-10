# 🐳 Student Management System - Docker Rehberi

Bu rehber Student Management System'i Docker kullanarak nasıl çalıştıracağınızı açıklar.

## 📋 Gereksinimler

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- En az 4GB RAM
- En az 2GB disk alanı

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Klonlayın
```bash
git clone <repository-url>
cd student-management-system
```

### 2. Environment Dosyasını Oluşturun
```bash
cp .env.example .env
# .env dosyasını düzenleyin (özellikle JWT_SECRET'ı değiştirin)
```

### 3. Docker Compose ile Başlatın
```bash
# Tüm servisleri build et ve başlat
docker-compose up --build

# Arka planda çalıştırmak için
docker-compose up --build -d
```

### 4. Uygulamaya Erişin
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 👤 Demo Hesaplar

### Admin Hesabı
- **Email**: admin@admin.com
- **Şifre**: admin123

### Öğrenci Hesabı
- **Email**: ogrenci@demo.com
- **Şifre**: admin123

## 📊 Servis Durumları

### Servislerin Durumunu Kontrol Etme
```bash
# Tüm servislerin durumu
docker-compose ps

# Logları görüntüleme
docker-compose logs

# Belirli bir servisin logları
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb
```

### Health Check'ler
- **MongoDB**: Otomatik health check (30s interval)
- **Backend**: API endpoint health check
- **Frontend**: Nginx health check

## 🛠️ Geliştirme Komutları

## 🛠️ Geliştirme Komutları

### Production Mode Komutları
```bash
# Tüm servisleri durdur
docker-compose down

# Volumes ile birlikte durdur (VERİ SİLİNİR!)
docker-compose down -v

# Tüm servisleri yeniden build et
docker-compose build

# Sadece belirli bir servisi build et
docker-compose build backend
docker-compose build frontend
```

### Development Mode Komutları
```bash
# Development servisleri durdur
docker-compose -f docker-compose.dev.yml down

# Development servisleri yeniden build et
docker-compose -f docker-compose.dev.yml build

# Development logları takip et
docker-compose -f docker-compose.dev.yml logs -f
```

### Logları Takip Etme
```bash
# Canlı log takibi
docker-compose logs -f

# Son 100 satır
docker-compose logs --tail=100
```

## 🗄️ Veritabanı Yönetimi

### MongoDB'ye Bağlanma
```bash
# MongoDB container'ına bağlan
docker-compose exec mongodb mongosh -u admin -p password123

# Veritabanını seç
use student_management

# Koleksiyonları listele
show collections

# Kullanıcıları görüntüle
db.users.find().pretty()
```

### Backup Alma
```bash
# Database backup
docker-compose exec mongodb mongodump -u admin -p password123 --authenticationDatabase admin -d student_management -o /backup

# Backup dosyasını host'a kopyala
docker cp student_management_mongodb:/backup ./mongodb-backup
```

## 🔧 Troubleshooting

### Yaygın Problemler

#### Port Çakışması
```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :27017

# Başka portlar kullanmak için docker-compose.yml'yi düzenle
```

#### Memory Problemi
```bash
# Docker memory kullanımını kontrol et
docker stats

# Kullanılmayan container'ları temizle
docker container prune
docker image prune
```

#### Build Hataları
```bash
# Cache'i temizleyerek build et
docker-compose build --no-cache

# Docker daemon'ı restart et
sudo systemctl restart docker
```

### Logları İnceleme
```bash
# Backend logları
docker-compose logs backend | grep ERROR

# Frontend build logları
docker-compose logs frontend

# MongoDB logları
docker-compose logs mongodb
```

## 📁 Dosya Yapısı

```
student-management-system/
├── client/
│   ├── Dockerfile                 # Frontend container
│   ├── nginx.conf                 # Nginx configuration
│   └── .dockerignore             # Frontend ignore files
├── server/
│   ├── Dockerfile                 # Backend container
│   ├── .dockerignore             # Backend ignore files
│   └── scripts/
│       └── init-mongo.js         # MongoDB initialization
├── docker-compose.yml            # Main orchestration file
├── .env.example                  # Environment template
└── DOCKER-README.md              # Bu dosya
```

## 🔒 Güvenlik Notları

### Production İçin Önemli
1. `.env` dosyasındaki `JWT_SECRET`'ı güçlü bir değerle değiştirin
2. MongoDB şifrelerini değiştirin
3. Firewall kurallarını ayarlayın
4. HTTPS kullanın
5. Regular backup alın

### Environment Variables
```bash
# Production için örnek
JWT_SECRET=super-complex-secret-key-min-32-characters
MONGO_ROOT_PASSWORD=very-strong-password-123
NODE_ENV=production
```

## 📈 Monitoring

### Resource Usage
```bash
# Container resource kullanımı
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Disk kullanımı
docker system df
```

### Container Health
```bash
# Health status
docker-compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
```

## 🎯 Next Steps

1. **SSL/HTTPS**: Production'da SSL sertifikası ekleyin
2. **Reverse Proxy**: Nginx veya Traefik ekleyin
3. **Monitoring**: Prometheus + Grafana entegrasyonu
4. **CI/CD**: GitHub Actions veya Jenkins pipeline'ı
5. **Backup Strategy**: Otomatik backup sistemi

## 🆘 Destek

Problem yaşıyorsanız:
1. Bu README'yi tekrar okuyun
2. Logları kontrol edin (`docker-compose logs`)
3. GitHub Issues'da sorun bildirin
4. Stack Overflow'da araştırın

---

**Happy Coding! 🚀**