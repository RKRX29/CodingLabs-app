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

    // Keep Python starter content in sync by inserting any missing lesson numbers.
    if (courseId === 'python') {
      const existingLessonNumbers = new Set(lessons.map((lesson: any) => lesson.lessonNumber))
      const missingLessons = pythonLessons.filter(
        lesson => !existingLessonNumbers.has(lesson.lessonNumber)
      )

      if (missingLessons.length > 0) {
        await Lesson.insertMany(missingLessons)
        lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 })
      }
    }

    return NextResponse.json({ lessons })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
