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

  const filteredLessons = lessons.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(q) || String(item.lessonNumber).includes(q)
  })

  const completionPct = lessons.length ? ((completedIds.size / lessons.length) * 100).toFixed(1) : '0.0'

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-fuchsia-50 to-orange-50 p-8 text-gray-900">
      <div className="pointer-events-none absolute -left-36 -top-24 h-96 w-96 rounded-full bg-fuchsia-300/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-16 h-[28rem] w-[28rem] rounded-full bg-orange-300/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-[30rem] w-[30rem] rounded-full bg-pink-300/45 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-gradient-to-r from-purple-200/25 via-pink-200/25 to-orange-200/25 blur-2xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-violet-200 bg-gradient-to-b from-blue-100/85 via-violet-100/85 to-fuchsia-100/85 p-4 text-slate-900 shadow-md backdrop-blur-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="mb-4 rounded-xl border border-violet-200 bg-white/80 p-3 shadow-sm">
            <p className="text-sm font-bold text-slate-900">Course Overview</p>
            <p className="mt-1 text-xs text-slate-700">
              {completedIds.size}/{lessons.length} lessons completed
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-violet-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-700">Completed: {completionPct}%</p>
          </div>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full rounded-lg border border-fuchsia-200 bg-white/90 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500"
            placeholder="Search lessons..."
          />

          <div className="space-y-2">
            {filteredLessons.map((item) => {
              const isExpanded = expandedLessonIds.has(item._id)
              const moduleDone = completedIds.has(item._id)
              const subPct = moduleDone ? 100 : 0

              return (
                <div key={item._id} className="rounded-lg border border-violet-200 bg-white/80 p-2 shadow-sm">
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
                      className="text-xs text-slate-600"
                    >
                      {isExpanded ? '▾' : '▸'}
                    </button>
                    <Link href={`/learn/${item._id}?view=menu`} className="flex-1">
                      <p className="text-sm font-bold text-slate-900">Lesson {item.lessonNumber}</p>
                      <p className="text-xs text-slate-700">{item.title}</p>
                    </Link>
                    {moduleDone && <span className="text-emerald-500 text-sm">✓</span>}
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-violet-100">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${subPct}%` }} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2 space-y-1 text-xs">
                      <Link href={`/learn/${item._id}?view=lesson`} className="flex items-center justify-between rounded border border-cyan-200 bg-cyan-50 px-2 py-1 hover:bg-cyan-100">
                        <span>📘 Lesson {item.lessonNumber}.1</span>
                        {moduleDone && <span className="text-emerald-500">✓</span>}
                      </Link>
                      <Link href={`/learn/${item._id}?view=exercise`} className="flex items-center justify-between rounded border border-pink-200 bg-pink-50 px-2 py-1 hover:bg-pink-100">
                        <span>🧩 Exercise {item.lessonNumber}.1</span>
                        {moduleDone && <span className="text-emerald-500">✓</span>}
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        <section className="max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-pink-700 bg-clip-text text-4xl font-black text-transparent">
              Python Course
            </h1>
            <Link
              href="/dashboard"
              className="inline-flex min-w-52 items-center justify-center rounded-lg border border-blue-200 bg-white/95 px-5 py-2.5 text-base font-bold !text-slate-900 shadow-sm transition hover:bg-blue-50"
            >
              Back to Dashboard
            </Link>
          </div>

          {!loading && !error && lessons.length > 0 && completedIds.size === lessons.length && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <h2 className="text-lg font-semibold text-green-800">Course Completed</h2>
              <p className="mb-3 text-green-700">You have completed all Python lessons.</p>
              <button className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800">
                Download Certificate (Coming Soon)
              </button>
            </div>
          )}

          {loading && <p>Loading lessons...</p>}
          {!loading && error && <p className="text-red-600">{error}</p>}

          {!loading && !error && lessons.length === 0 && (
            <div className="rounded-lg border bg-white/90 p-6 backdrop-blur-sm">
              <h2 className="mb-2 text-xl font-semibold">No lessons yet</h2>
              <p className="text-gray-600">Add lesson documents in MongoDB with `courseId: &quot;python&quot;` to see them here.</p>
            </div>
          )}

          {!loading && !error && lessons.length > 0 && (
            <div className="grid gap-4">
              {lessons.map((item) => (
                <article key={item._id} className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-white/95 via-violet-50/80 to-rose-50/85 p-6 shadow-md backdrop-blur-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-violet-700">Lesson {item.lessonNumber}</p>
                    {completedIds.has(item._id) ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Completed</span>
                    ) : (
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">Incomplete</span>
                    )}
                  </div>
                  <h2 className="mb-2 text-3xl font-black text-slate-900">{item.title}</h2>
                  <p className="mb-4 text-xl font-medium text-slate-700">{item.description}</p>
                  <Link
                    href={`/learn/${item._id}`}
                    className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-base font-bold text-white hover:from-blue-700 hover:to-violet-700"
                  >
                    Open Lesson
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
