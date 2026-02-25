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

export default function PythonCoursePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLessonIds, setExpandedLessonIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch('/api/lessons?courseId=python'),
          fetch('/api/progress?courseId=python')
        ])
        const lessonsData = await lessonsRes.json()
        const progressData = await progressRes.json()

        if (!lessonsRes.ok || !progressRes.ok) {
          setError(lessonsData.error || progressData.error || 'Failed to load lessons')
          return
        }

        setLessons(lessonsData.lessons || [])

        const completed = new Set<string>(
          (progressData.progress || [])
            .filter((item: ProgressItem) => item.completed)
            .map((item: ProgressItem) => item.lessonId)
        )
        setCompletedIds(completed)
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

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border bg-slate-900 p-4 text-slate-100 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800 p-3">
            <p className="text-sm font-semibold">Course Overview</p>
            <p className="mt-1 text-xs text-slate-300">
              {completedIds.size}/{lessons.length} lessons completed
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-violet-400"
                style={{ width: `${lessons.length ? ((completedIds.size / lessons.length) * 100).toFixed(1) : 0}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Completed: {lessons.length ? ((completedIds.size / lessons.length) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            placeholder="Search lessons..."
          />

          <div className="space-y-2">
            {lessons
              .filter((item) => {
                if (!searchQuery.trim()) return true
                const q = searchQuery.toLowerCase()
                return item.title.toLowerCase().includes(q) || String(item.lessonNumber).includes(q)
              })
              .map((item) => {
                const isExpanded = expandedLessonIds.has(item._id)
                const moduleDone = completedIds.has(item._id)
                const subPct = moduleDone ? 100 : 0
                return (
                  <div key={item._id} className="rounded-lg border border-slate-700 bg-slate-800/70 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedLessonIds((prev) => {
                            const next = new Set(prev)
                            if (next.has(item._id)) next.delete(item._id)
                            else next.add(item._id)
                            return next
                          })
                        }
                        className="text-xs text-slate-300"
                      >
                        {isExpanded ? '▾' : '▸'}
                      </button>
                      <Link href={`/learn/${item._id}?view=menu`} className="flex-1">
                        <p className="text-sm font-semibold text-white">Lesson {item.lessonNumber}</p>
                        <p className="text-xs text-slate-300">{item.title}</p>
                      </Link>
                      {moduleDone && <span className="text-emerald-400 text-sm">✓</span>}
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700">
                      <div className="h-1.5 rounded-full bg-cyan-400" style={{ width: `${subPct}%` }} />
                    </div>
                    {isExpanded && (
                      <div className="mt-2 space-y-1 text-xs">
                        <Link href={`/learn/${item._id}?view=lesson`} className="flex items-center justify-between rounded bg-slate-700 px-2 py-1 hover:bg-slate-600">
                          <span>📘 Lesson {item.lessonNumber}.1</span>
                          {moduleDone && <span className="text-emerald-300">✓</span>}
                        </Link>
                        <Link href={`/learn/${item._id}?view=exercise`} className="flex items-center justify-between rounded bg-slate-700 px-2 py-1 hover:bg-slate-600">
                          <span>🧩 Exercise {item.lessonNumber}.1</span>
                          {moduleDone && <span className="text-emerald-300">✓</span>}
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </aside>

        <section className="max-w-4xl">
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
            {lessons.map((lesson) => {
              return (
              <article key={lesson._id} className="bg-white/90 border rounded-lg p-6 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-blue-700 font-semibold">Lesson {lesson.lessonNumber}</p>
                  {completedIds.has(lesson._id) ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Completed</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Incomplete</span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                <p className="text-gray-700 mb-4">{lesson.description}</p>
                <Link
                  href={`/learn/${lesson._id}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Open Lesson
                </Link>
              </article>
              )
            })}
          </div>
        )}
        </section>
      </div>
    </main>
  )
}
