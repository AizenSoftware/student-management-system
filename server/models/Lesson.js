import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lesson name is required'],
    unique: true, // Bu zaten index yaratır
    trim: true,
    minlength: [3, 'Lesson name must be at least 3 characters'],
    maxlength: [100, 'Lesson name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  code: {
    type: String,
    required: [true, 'Lesson code is required'],
    unique: true, // Bu da zaten index yaratır
    uppercase: true,
    trim: true,
    minlength: [3, 'Lesson code must be at least 3 characters'],
    maxlength: [10, 'Lesson code cannot exceed 10 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [8, 'Credits cannot exceed 8']
  },
  instructor: {
    type: String,
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  maxCapacity: {
    type: Number,
    min: [1, 'Maximum capacity must be at least 1'],
    max: [500, 'Maximum capacity cannot exceed 500'],
    default: 50
  },
  enrolledStudentsCount: {
    type: Number,
    default: 0,
    min: [0, 'Enrolled students count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true // Sadece isActive için index
  }
}, {
  timestamps: true
});

// Kapasite kontrolü için method
lessonSchema.methods.hasCapacity = function() {
  return this.enrolledStudentsCount < this.maxCapacity;
};

// Kalan kontenjan hesaplama
lessonSchema.methods.getAvailableSpots = function() {
  return Math.max(0, this.maxCapacity - this.enrolledStudentsCount);
};

export default mongoose.model('Lesson', lessonSchema);