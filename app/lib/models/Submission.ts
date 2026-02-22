import mongoose from 'mongoose'

const SubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  code: { type: String, required: true },
  stdout: { type: String, default: '' },
  stderr: { type: String, default: '' },
  status: { type: String, default: 'Unknown' },
  passed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema)
