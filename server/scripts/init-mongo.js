// MongoDB initialization script
// Bu script container başlangıcında çalışır

print('🚀 MongoDB initialization started...');

// Database'e geç
db = db.getSiblingDB('student_management');

// Admin kullanıcı oluştur (eğer yoksa)
try {
  db.users.insertOne({
    firstName: "Admin",
    lastName: "User", 
    email: "admin@admin.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreZhzrsBHO9EYK", // password: admin123
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('✅ Admin user created successfully');
} catch (error) {
  if (error.code === 11000) {
    print('ℹ️  Admin user already exists');
  } else {
    print('❌ Error creating admin user:', error);
  }
}

// Demo öğrenci oluştur (eğer yoksa)
try {
  db.users.insertOne({
    firstName: "Öğrenci",
    lastName: "Demo",
    email: "ogrenci@demo.com", 
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreZhzrsBHO9EYK", // password: admin123
    role: "student",
    dateOfBirth: new Date("2000-01-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('✅ Demo student created successfully');
} catch (error) {
  if (error.code === 11000) {
    print('ℹ️  Demo student already exists');
  } else {
    print('❌ Error creating demo student:', error);
  }
}

// Demo ders oluştur
try {
  db.lessons.insertOne({
    name: "Matematik 101",
    code: "MAT101",
    credits: 3,
    instructor: "Prof. Dr. Ahmet Yılmaz",
    description: "Temel matematik dersi",
    maxCapacity: 30,
    enrolledStudentsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('✅ Demo lesson created successfully');
} catch (error) {
  print('❌ Error creating demo lesson:', error);
}

// Index'leri oluştur
try {
  // Users için unique email index
  db.users.createIndex({ "email": 1 }, { unique: true });
  
  // Lessons için unique code index
  db.lessons.createIndex({ "code": 1 }, { unique: true });
  
  // Enrollments için composite index
  db.enrollments.createIndex({ "student": 1, "lesson": 1 }, { unique: true });
  
  print('✅ Database indexes created successfully');
} catch (error) {
  print('❌ Error creating indexes:', error);
}

print('🎉 MongoDB initialization completed!');
print('📧 Admin Login: admin@admin.com / admin123');
print('📧 Student Login: ogrenci@demo.com / admin123');