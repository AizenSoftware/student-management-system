// MongoDB initialization script
print('🚀 MongoDB initialization started...');

// Database'e geç
db = db.getSiblingDB('student_management_system');


// Sadece email index'i oluştur
try {
  db.users.createIndex({ "email": 1 }, { unique: true });
  print('✅ Indexes created');
} catch (error) {
  print('⚠️ Index creation warning:', error);
}

print('🎉 MongoDB initialization completed!');
