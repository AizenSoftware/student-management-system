# Backend Dockerfile
FROM node:18-alpine

# Çalışma dizini
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Port expose et
EXPOSE 5000

# app.js'i çalıştır
CMD ["node", "app.js"]