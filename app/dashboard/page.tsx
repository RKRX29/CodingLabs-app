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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CodingLabs</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Welcome to CodingLabs{user?.name ? `, ${user.name}` : ''}!
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Python Course</h3>
            <p className="text-gray-600 mb-4">Learn Python from scratch with 20 interactive lessons</p>
            <button
              onClick={() => router.push('/courses/python')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Learning
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Web Development</h3>
            <p className="text-gray-600 mb-4">Master HTML, CSS, and JavaScript</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Coming Soon
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Your Progress</h3>
            <p className="text-gray-600 mb-4">Track your learning journey</p>
            <div className="text-2xl font-bold text-blue-600">{progressPercent}%</div>
            <p className="text-sm text-gray-600 mt-1">
              {completedLessons}/{totalLessons} lessons completed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
