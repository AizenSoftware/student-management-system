# Node.js resmi image'ını kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Dependencies'leri yükle
RUN npm ci --only=production

# Uygulama kodunu kopyala
COPY . .

# Port'u expose et
EXPOSE 5000

# Health check ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/auth/profile || exit 1

# Uygulamayı başlat
CMD ["npm", "start"]