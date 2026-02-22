import { connectDB } from '@/app/lib/mongodb'
import { getUserIdFromRequest } from '@/app/lib/auth'
import Progress from '@/app/lib/models/Progress'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await connectDB()
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { courseId, lessonId, completed, codePassed, quizPassed } = await req.json()

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: 'courseId and lessonId are required' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = {
      userId,
      courseId,
      lessonId,
      updatedAt: new Date()
    }
    if (typeof completed === 'boolean') updatePayload.completed = completed
    if (typeof codePassed === 'boolean') updatePayload.codePassed = codePassed
    if (typeof quizPassed === 'boolean') updatePayload.quizPassed = quizPassed

    const progress = await Progress.findOneAndUpdate(
      { userId, lessonId },
      updatePayload,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )

    return NextResponse.json({ message: 'Progress saved', progress })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
