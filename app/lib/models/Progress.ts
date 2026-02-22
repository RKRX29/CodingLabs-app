import mongoose from 'mongoose'

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  codePassed: { type: Boolean, default: false },
  quizPassed: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
})

ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema)
