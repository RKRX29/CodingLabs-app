'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<{ userId: string; name: string; email: string } | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [totalLessons, setTotalLessons] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [meRes, lessonsRes, progressRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/lessons?courseId=python'),
          fetch('/api/progress?courseId=python')
        ])

        const meData = await meRes.json()
        const lessonsData = await lessonsRes.json()
        const progressData = await progressRes.json()

        if (!meRes.ok) {
          router.push('/login')
          return
        }

        if (!lessonsRes.ok || !progressRes.ok) {
          return
        }

        setUser(meData.user)

        const lessons = lessonsData.lessons || []
        const progress = progressData.progress || []

        const completedIds = new Set(
          progress.filter((item: any) => item.completed).map((item: any) => item.lessonId)
        )

        const total = lessons.length
        const completed = lessons.filter((lesson: any) => completedIds.has(lesson._id)).length
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0

        setTotalLessons(total)
        setCompletedLessons(completed)
        setProgressPercent(percent)
      } catch {
        // Keep defaults when progress fetch fails.
      }
    }

    fetchProgress()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading...</div>

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-violet-50 to-orange-50 text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-fuchsia-300/45 blur-3xl" />
      <div className="pointer-events-none absolute right-[-90px] top-24 h-80 w-80 rounded-full bg-orange-300/45 blur-3xl" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <h1 className="text-3xl font-black tracking-tight text-blue-700">CodingLabs</h1>
        <button 
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-5 py-2 text-base font-bold text-white hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-10">
        <section className="mb-8 rounded-3xl border border-violet-200 bg-gradient-to-br from-white/90 via-rose-50/80 to-violet-100/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
            Welcome Back
          </p>
          <h2 className="mb-3 text-4xl font-black text-slate-900 md:text-5xl">
            Keep Building Momentum{user?.name ? `, ${user.name}` : ''}.
          </h2>
          <p className="max-w-3xl text-xl font-medium text-slate-700">
            Continue your learning journey, complete lessons, and unlock your next chapter.
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-100/85 to-white/90 p-6 shadow-sm">
            <p className="text-sm font-bold text-blue-800">Progress Score</p>
            <p className="mt-2 text-5xl font-black text-slate-900">{progressPercent}%</p>
            <p className="mt-2 text-base font-medium text-slate-700">
              {completedLessons}/{totalLessons} lessons completed
            </p>
          </div>
          <article className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100/85 to-white/90 p-6 shadow-sm">
            <p className="text-sm font-bold text-violet-700">Continue</p>
            <h3 className="mt-2 mb-2 text-3xl font-black text-slate-900">Python Course</h3>
            <p className="mb-4 text-base font-medium text-slate-700">
              Learn Python through lessons, coding challenges, and quizzes.
            </p>
            <button
              onClick={() => router.push('/courses/python')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-base font-bold text-white hover:bg-blue-700"
            >
              Continue Learning
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-600">Next Track</p>
            <h3 className="mt-2 mb-2 text-3xl font-black text-slate-900">Web Development</h3>
            <p className="mb-4 text-base font-medium text-slate-700">
              HTML, CSS, JavaScript and project-based frontend/backend roadmaps.
            </p>
            <button className="rounded-lg bg-slate-700 px-4 py-2 text-base font-bold text-white hover:bg-slate-800">
              Coming Soon
            </button>
          </article>
        </section>
      </main>
    </div>
  )
}
