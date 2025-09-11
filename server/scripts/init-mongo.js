// MongoDB initialization script
print('🚀 MongoDB initialization started...');

// Database'e geç
db = db.getSiblingDB('student_management_system');

// Collections otomatik oluşacak, ama index'leri şimdiden tanımlayalım
print('📋 Setting up database indexes...');

// Users collection için unique email index
try {
  db.users.createIndex({ "email": 1 }, { unique: true });
  print('✅ Users email index created');
} catch (error) {
  print('⚠️ Users index warning:', error);
}

// Lessons collection için index'ler
try {
  db.lessons.createIndex({ "lessonCode": 1 }, { unique: true });
  db.lessons.createIndex({ "status": 1 });
  print('✅ Lessons indexes created');
} catch (error) {
  print('⚠️ Lessons index warning:', error);
}

// Enrollments collection için compound index
try {
  db.enrollments.createIndex({ "student": 1, "lesson": 1 }, { unique: true });
  db.enrollments.createIndex({ "student": 1 });
  db.enrollments.createIndex({ "lesson": 1 });
  print('✅ Enrollments indexes created');
} catch (error) {
  print('⚠️ Enrollments index warning:', error);
}

// Test admin user oluştur (password: admin123)
try {
  const adminExists = db.users.findOne({ email: "admin@example.com" });
  
  if (!adminExists) {
    db.users.insertOne({
      email: "admin@example.com",
      password: "$2y$10$2MDT6bQ0j82ZpnCQJXjIKuNZxgMNBSmxnlORJYgh1UQ.URa6uqgF2", // bcrypt ile hashlenmiş "123456"
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    print('✅ Test admin user created: admin@example.com / admin123');
  } else {
    print('ℹ️ Admin user already exists');
  }
} catch (error) {
  print('⚠️ Admin user creation warning:', error);
}

print('🎉 MongoDB initialization completed!');
print('📊 Database ready for collections: users, lessons, enrollments');