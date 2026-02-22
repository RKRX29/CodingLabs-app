import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  codeExample: { type: String },
  exercise: { type: String },
  expectedOutput: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema)
