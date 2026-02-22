'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Lesson = {
  _id: string
  lessonNumber: number
  title: string
  description: string
  content: string
  codeExample?: string
  exercise?: string
  expectedOutput?: string
}

type ProgressItem = {
  lessonId: string
  completed: boolean
}

type SubmissionItem = {
  lessonId: string
}

export default function PythonCoursePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const [lessonsRes, progressRes, submissionsRes] = await Promise.all([
          fetch('/api/lessons?courseId=python'),
          fetch('/api/progress?courseId=python'),
          fetch('/api/submissions?courseId=python&limit=200')
        ])
        const lessonsData = await lessonsRes.json()
        const progressData = await progressRes.json()
        const submissionsData = await submissionsRes.json()

        if (!lessonsRes.ok || !progressRes.ok || !submissionsRes.ok) {
          setError(lessonsData.error || progressData.error || submissionsData.error || 'Failed to load lessons')
          return
        }

        setLessons(lessonsData.lessons || [])

        const completed = new Set<string>(
          (progressData.progress || [])
            .filter((item: ProgressItem) => item.completed)
            .map((item: ProgressItem) => item.lessonId)
        )
        setCompletedIds(completed)

        const attempted = new Set<string>(
          (submissionsData.submissions || []).map((item: SubmissionItem) => item.lessonId)
        )
        setAttemptedIds(attempted)
      } catch {
        setError('Network error while loading lessons')
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Python Course</h1>
          <Link href="/dashboard" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
            Back to Dashboard
          </Link>
        </div>

        {!loading && !error && lessons.length > 0 && completedIds.size === lessons.length && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800">Course Completed</h2>
            <p className="text-green-700 mb-3">You have completed all Python lessons.</p>
            <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
              Download Certificate (Coming Soon)
            </button>
          </div>
        )}

        {loading && <p>Loading lessons...</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && lessons.length === 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">No lessons yet</h2>
            <p className="text-gray-600">Add lesson documents in MongoDB with `courseId: "python"` to see them here.</p>
          </div>
        )}

        {!loading && !error && lessons.length > 0 && (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => {
              const isLocked =
                index > 0 && !completedIds.has(lessons[index - 1]?._id)

              return (
              <article key={lesson._id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-blue-700 font-semibold">Lesson {lesson.lessonNumber}</p>
                  {completedIds.has(lesson._id) ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Completed</span>
                  ) : attemptedIds.has(lesson._id) ? (
                    <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">Attempted</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Not started</span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                <p className="text-gray-700 mb-4">{lesson.description}</p>
                {isLocked ? (
                  <button
                    disabled
                    className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                  >
                    Locked
                  </button>
                ) : (
                  <Link
                    href={`/learn/${lesson._id}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Open Lesson
                  </Link>
                )}
              </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
