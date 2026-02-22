import { connectDB } from '@/app/lib/mongodb'
import Lesson from '@/app/lib/models/Lesson'
import { pythonLessons } from '@/app/lib/data/pythonLessons'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    let lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 })

    // Seed starter Python lessons once when the course is empty.
    if (courseId === 'python' && lessons.length === 0) {
      await Lesson.insertMany(pythonLessons)
      lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 })
    }

    return NextResponse.json({ lessons })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
