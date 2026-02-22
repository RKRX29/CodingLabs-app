import { connectDB } from '@/app/lib/mongodb'
import { getUserIdFromRequest } from '@/app/lib/auth'
import Submission from '@/app/lib/models/Submission'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await connectDB()
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { courseId, lessonId, code, stdout, stderr, status, passed } = await req.json()

    if (!courseId || !lessonId || !code) {
      return NextResponse.json(
        { error: 'courseId, lessonId, and code are required' },
        { status: 400 }
      )
    }

    const submission = await Submission.create({
      userId,
      courseId,
      lessonId,
      code,
      stdout: stdout || '',
      stderr: stderr || '',
      status: status || 'Unknown',
      passed: Boolean(passed)
    })

    return NextResponse.json({ message: 'Submission saved', submissionId: submission._id })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
