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

    // Keep Python starter content in sync by upserting official lesson data.
    if (courseId === 'python') {
      await Lesson.bulkWrite(
        pythonLessons.map((item) => ({
          updateOne: {
            filter: { courseId: item.courseId, lessonNumber: item.lessonNumber },
            update: {
              $set: {
                title: item.title,
                description: item.description,
                content: item.content,
                codeExample: item.codeExample || '',
                exercise: item.exercise || '',
                expectedOutput: item.expectedOutput || ''
              },
              $setOnInsert: {
                courseId: item.courseId,
                lessonNumber: item.lessonNumber
              }
            },
            upsert: true
          }
        }))
      )
      lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 })
    }

    return NextResponse.json({ lessons })
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Something went wrong', details }, { status: 500 })
  }
}
