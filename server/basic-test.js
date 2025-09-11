import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Routes'ları import et
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

let mongoServer;

// Test için mini app oluştur
function createTestApp() {
  const testApp = express();

  // Middleware'ler
  testApp.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  testApp.use(express.json());
  testApp.use(cookieParser());

  // Routes
  testApp.use("/api/auth", authRoutes);

  return testApp;
}

// Test setup
async function setupTest() {
  console.log("Test ortamı hazırlanıyor...");

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  console.log(" Test veritabanı bağlandı\n");
}

// Test cleanup
async function cleanupTest() {
  console.log("\nTest ortamı temizleniyor...");

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }

  console.log("Test tamamlandı");
  process.exit(0);
}

// TEST 1: API Sağlık Kontrolü
async function test1_ApiHealth() {
  console.log("TEST 1: API Sağlık Kontrolü");

  const app = createTestApp();

  try {
    // Basit bir GET request
    const response = await request(app).get("/api/auth/profile");

    // 401 (Unauthorized) bekliyoruz çünkü token yok
    if (response.status === 401) {
      console.log("BAŞARILI: API çalışıyor");
      console.log(`Status: ${response.status} (Unauthorized - Beklenen)`);
      return true;
    } else {
      console.log("BAŞARISIZ: Beklenmeyen response");
      console.log(`Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("HATA:", error.message);
    return false;
  }
}

// TEST 2: Kullanıcı Kaydı
async function test2_UserRegister() {
  console.log("\n TEST 2: Kullanıcı Kaydı");

  const app = createTestApp();

  const userData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
    dateOfBirth: "1995-01-01",
    role: "student",
  };

  try {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    if (response.status === 201 && response.body.success === true) {
      console.log("BAŞARILI: Kullanıcı başarıyla kaydedildi");
      console.log(`Email: ${response.body.user.email}`);
      console.log(`Role: ${response.body.user.role}`);
      return { success: true, app: app };
    } else {
      console.log("BAŞARISIZ: Kullanıcı kaydedilemedi");
      console.log(`Status: ${response.status}`);
      console.log(`Hata: ${response.body.message || "Bilinmeyen hata"}`);
      return { success: false };
    }
  } catch (error) {
    console.log("HATA:", error.message);
    return { success: false };
  }
}

// TEST 3: Kullanıcı Girişi
async function test3_UserLogin(app) {
  console.log("\nTEST 3: Kullanıcı Girişi");

  try {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    if (response.status === 200 && response.body.success === true) {
      console.log("BAŞARILI: Kullanıcı başarıyla giriş yaptı");
      console.log(`Email: ${response.body.user.email}`);
      console.log(`Role: ${response.body.user.role}`);

      // Token kontrolü
      const cookies = response.headers["set-cookie"];
      const hasToken =
        cookies && cookies.some((cookie) => cookie.startsWith("token="));

      if (hasToken) {
        console.log("Auth token oluşturuldu");
        return true;
      } else {
        console.log("Auth token oluşturulamadı");
        return false;
      }
    } else {
      console.log("BAŞARISIZ: Giriş yapılamadı");
      console.log(`Status: ${response.status}`);
      console.log(`Hata: ${response.body.message || "Bilinmeyen hata"}`);
      return false;
    }
  } catch (error) {
    console.log("HATA:", error.message);
    return false;
  }
}

// Ana test fonksiyonu
async function runTests() {
  console.log("BACKEND API TESTLERİ BAŞLADI");
  console.log("=====================================\n");

  try {
    await setupTest();

    let passedTests = 0;
    const totalTests = 3;

    // Test 1: API Health
    if (await test1_ApiHealth()) {
      passedTests++;
    }

    // Test 2: Register
    const registerResult = await test2_UserRegister();
    if (registerResult.success) {
      passedTests++;

      // Test 3: Login (sadece register başarılıysa)
      if (await test3_UserLogin(registerResult.app)) {
        passedTests++;
      }
    }

    // Sonuçlar
    console.log("\n=====================================");
    console.log("TEST SONUÇLARI:");
    console.log(`Başarılı: ${passedTests}/${totalTests}`);
    console.log(`Başarısız: ${totalTests - passedTests}/${totalTests}`);

    if (passedTests === totalTests) {
      console.log("\n TÜM TESTLER BAŞARILI!");
      console.log("   Backend API'niz doğru çalışıyor.");
    } else {
      console.log("\n BAZI TESTLER BAŞARISIZ!");
      console.log("   Lütfen backend kodunuzu kontrol edin.");
    }
  } catch (error) {
    console.error("\n💥 TEST HATASI:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await cleanupTest();
  }
}

// Testleri başlat
runTests();
