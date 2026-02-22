import { connectDB } from '@/app/lib/mongodb'
import { getUserIdFromRequest } from '@/app/lib/auth'
import Submission from '@/app/lib/models/Submission'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await connectDB()
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')
    const courseId = searchParams.get('courseId')
    const limit = Number(searchParams.get('limit') || '5')

    if (!lessonId && !courseId) {
      return NextResponse.json({ error: 'lessonId or courseId is required' }, { status: 400 })
    }

    const query: Record<string, string> = { userId }
    if (lessonId) query.lessonId = lessonId
    if (courseId) query.courseId = courseId

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.isFinite(limit) ? limit : 5)

    return NextResponse.json({ submissions })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
