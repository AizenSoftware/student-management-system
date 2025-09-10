# EN BASİT Backend Dockerfile - app.js için
FROM node:18-alpine

# Çalışma dizini
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Dependencies yükle (tümü)
RUN npm install

# TÜM dosyaları kopyala
COPY . .

# Port expose et
EXPOSE 5000

# Debug: Dosyaları listele
RUN echo "=== Copied files ===" && ls -la

# app.js dosyasını direkt çalıştır
CMD ["node", "app.js"]