import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson is required']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'dropped'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Önemli: Aynı öğrenci aynı derse sadece 1 kez kayıt olabilir
enrollmentSchema.index({ student: 1, lesson: 1 }, { unique: true });

// Performance için index'ler
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ lesson: 1, status: 1 });

// Öğrencinin derse kayıtlı olup olmadığını kontrol etme
enrollmentSchema.statics.isStudentEnrolled = async function(studentId, lessonId) {
  const enrollment = await this.findOne({
    student: studentId,
    lesson: lessonId,
    status: 'active'
  });
  return !!enrollment;
};

// Öğrencinin aldığı dersleri getirme
enrollmentSchema.statics.getStudentLessons = function(studentId) {
  return this.find({ student: studentId, status: 'active' })
    .populate('lesson', 'name code credits instructor');
};

// Derse kayıtlı öğrencileri getirme
enrollmentSchema.statics.getLessonStudents = function(lessonId) {
  return this.find({ lesson: lessonId, status: 'active' })
    .populate('student', 'firstName lastName email');
};

export default mongoose.model('Enrollment', enrollmentSchema);