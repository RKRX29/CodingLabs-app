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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-fuchsia-50 to-orange-50 p-8 text-gray-900">
      <div className="pointer-events-none absolute -left-36 -top-24 h-96 w-96 rounded-full bg-fuchsia-300/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-16 h-[28rem] w-[28rem] rounded-full bg-orange-300/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-[30rem] w-[30rem] rounded-full bg-pink-300/45 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-gradient-to-r from-purple-200/25 via-pink-200/25 to-orange-200/25 blur-2xl" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Python Course</h1>
          <Link
            href="/dashboard"
            className="inline-flex min-w-52 items-center justify-center rounded-lg border border-blue-200 bg-white/95 px-5 py-2.5 text-base font-bold !text-slate-900 shadow-sm transition hover:bg-blue-50"
          >
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
          <div className="bg-white/90 border rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">No lessons yet</h2>
            <p className="text-gray-600">Add lesson documents in MongoDB with `courseId: &quot;python&quot;` to see them here.</p>
          </div>
        )}

        {!loading && !error && lessons.length > 0 && (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => {
              const isLocked =
                index > 0 && !completedIds.has(lessons[index - 1]?._id)

              return (
              <article key={lesson._id} className="bg-white/90 border rounded-lg p-6 shadow-sm backdrop-blur-sm">
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
