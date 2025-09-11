

# 📚 Student Management System

Modern, tam donanımlı öğrenci yönetim sistemi. React, Node.js ve MongoDB teknolojileri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 👑 Admin Paneli
- **Öğrenci Yönetimi**: Öğrenci ekleme, düzenleme, silme ve listeleme
- **Ders Yönetimi**: Ders oluşturma, düzenleme ve kapasite yönetimi
- **Kayıt İşlemleri**: Öğrenci-ders eşleştirmeleri
- 
### 👨‍🎓 Öğrenci Paneli
- **Ders Kayıtları**: Mevcut derslere kayıt olma
- **Derslerim**: Kayıtlı dersleri görüntüleme ve bırakma
- **Profil Yönetimi**: Kişisel bilgileri güncelleme

### 🔐 Güvenlik
- **JWT Authentication**: Güvenli kimlik doğrulama
- **Role-based Access Control**: Rol tabanlı yetkilendirme
- **Password Hashing**: bcrypt ile şifre güvenliği
- **Protected Routes**: Korumalı sayfalar

### 🎨 Modern UI/UX
- **Responsive Design**: Mobil uyumlu tasarım
- **Tailwind CSS**: Modern ve hızlı styling
- **Interactive Components**: Dinamik kullanıcı arayüzü

## 🛠️ Teknolojiler

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cookie-parser** - Cookie yönetimi
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form yönetimi
- **Tailwind CSS** - CSS framework
- **Lucide React** - Icon library
- **RTK Query** - Data fetching

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **Nodemon** - Development server
- **Vite** - Frontend build tool

## 📋 Gereksinimler

- **Node.js**: v18.0.0 veya üzeri
- **MongoDB**: v6.0 veya üzeri (veya MongoDB Atlas)
- **npm**: v8.0.0 veya üzeri
- **Docker**: v20.0.0 veya üzeri (opsiyonel)

## ⚡ Hızlı Başlangıç

### 1. Projeyi İndirin
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system


### 2. Backend Kurulumu
cd server
npm install

# .env dosyasını oluşturun
cp .env.example .env

## .env dosyasını düzenleyin
-server dosyası içinde
NODE_ENV=development
PORT=5000
MONGO_INITDB_ROOT_USERNAME=your_username
MONGO_INITDB_ROOT_PASSWORD=your_password
MONGO_INITDB_DATABASE=student_management_system
JWT_SECRET=your_jwt_secret_key_123
FRONTEND_URL=http://localhost:3000

**STUDENT MANAGEMENT SYSTEM - DOCKERs
# Database Configuration
MONGO_ROOT_USERNAME=(mongo_username)
MONGO_ROOT_PASSWORD=(mongo_password)
MONGO_DATABASE=student_management_system

# Backend Configuration  
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this-immediately
JWT_EXPIRE=30d

# Port Configuration
BACKEND_PORT=5000
FRONTEND_PORT=5173
MONGODB_PORT=27017

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000


### 3. Frontend Kurulumu
cd ../client
npm install


# Docker ile MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest


### 5. Uygulamayı Başlatın

**Backend:**

cd server
npm run dev


**Frontend:**

cd client
npm run dev


Tarayıcınızda `http://localhost:5173` adresini açın.

## 🐳 Docker ile Kurulum

### 1. Tüm Servisleri Başlatın
docker-compose up -d


### 2. Uygulamaya Erişin
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

### 3. Servisleri Durdurun
docker-compose down

### 4. Veritabanını Sıfırlamak İçin
docker-compose down -v
docker-compose up -d


## 👤 Demo Hesapları

Uygulama ilk başlatıldığında otomatik olarak demo hesaplar oluşturulur:

### 👑 Admin Hesabı
- **Email**: admin@example.com
- **Şifre**: 123456


## 📡 API Endpoints

### Authentication

-POST   /api/auth/register    # Kullanıcı kaydı
-POST   /api/auth/login       # Giriş
-GET    /api/auth/profile     # Profil görüntüleme
-PUT    /api/auth/profile     # Profil güncelleme
-POST   /api/auth/logout      # Çıkış


### Admin - Öğrenci Yönetimi

-GET    /api/admin/students           # Öğrenci listesi
-GET    /api/admin/students/:id       # Öğrenci detayı
-POST   /api/admin/students           # Öğrenci oluştur
-PUT    /api/admin/students/:id       # Öğrenci güncelle
-DELETE /api/admin/students/:id       # Öğrenci sil

### Admin - Ders Yönetimi

-GET    /api/admin/lessons            # Ders listesi
-GET    /api/admin/lessons/:id        # Ders detayı
-POST   /api/admin/lessons            # Ders oluştur
-PUT    /api/admin/lessons/:id        # Ders güncelle
-DELETE /api/admin/lessons/:id        # Ders sil
-GET    /api/admin/lessons/stats      # Ders istatistikleri


### Admin - Kayıt İşlemleri

-GET    /api/admin/enrollments                    # Tüm kayıtlar
-POST   /api/admin/enrollments                    # Kayıt oluştur
-DELETE /api/admin/enrollments/:id               # Kayıt sil
-GET    /api/admin/enrollments/student/:id       # Öğrencinin dersleri
-GET    /api/admin/enrollments/lesson/:id        # Dersin öğrencileri


### Öğrenci
-GET    /api/student/profile              # Profil
-PUT    /api/student/profile              # Profil güncelle
-GET    /api/student/lessons/my           # Kayıtlı dersler
-GET    /api/student/lessons/available    # Kayıt olunabilir dersler
-POST   /api/student/enroll               # Derse kayıt ol
-DELETE /api/student/drop/:lessonId       # Dersi bırak


## 🧪 Testler

### Backend Testleri Çalıştırma
cd server
npm test

### Test Kapsamı
- **Authentication Tests**: Giriş, çıkış, token doğrulama
- **Student CRUD Tests**: Öğrenci işlemleri
- **Middleware Tests**: Yetkilendirme ve güvenlik
- **API Integration Tests**: Endpoint testleri

### Test Sonucu Örneği
```
🧪 BACKEND API TESTLERİ BAŞLADI
=====================================

📝 TEST 1: Kullanıcı Kaydı
✅ BAŞARILI: Kullanıcı başarıyla kaydedildi

🔐 TEST 2: Kullanıcı Girişi  
✅ BAŞARILI: Kullanıcı başarıyla giriş yaptı

🛡️ TEST 3: Korumalı Route Erişimi
✅ BAŞARILI: Token ile korumalı route'a erişildi

📊 TEST SONUÇLARI:
✅ Başarılı: 3/3
🎉 TÜM TESTLER BAŞARILI!
```

## 📁 Proje Yapısı

```
student-management-system/
├── client/                     # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js)
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── tests/                # Test files
│   ├── app.js                # Express app
│   └── package.json
│
├── docker-compose.yml         # Docker orchestration
├── .gitignore
└── README.md


## 📚 Kaynaklar

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)


⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✨ İlk release
- 🔐 JWT authentication sistemi
- 👑 Admin panel
- 👨‍🎓 Öğrenci paneli
- 📚 Ders yönetimi
- 🐳 Docker desteği
- 🧪 Test altyapısı


