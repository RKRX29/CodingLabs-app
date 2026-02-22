import { connectDB } from '@/app/lib/mongodb'
import { getUserIdFromRequest } from '@/app/lib/auth'
import Progress from '@/app/lib/models/Progress'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await connectDB()
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const progress = await Progress.find({ userId, courseId }).sort({ updatedAt: -1 })
    return NextResponse.json({ progress })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
