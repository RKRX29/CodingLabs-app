'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { pythonQuizzes } from '@/app/lib/data/pythonQuizzes'

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
  codePassed?: boolean
  quizPassed?: boolean
}

type RunResult = {
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  message?: string | null
  status?: { id: number; description: string }
  time?: string
  memory?: number
}

type SubView = 'menu' | 'lesson' | 'exercise'

export default function LessonDetailPage() {
  const params = useParams<{ lessonId: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [subView, setSubView] = useState<SubView>('menu')
  const [lessonDone, setLessonDone] = useState(false)
  const [exerciseDone, setExerciseDone] = useState(false)
  const [moduleDone, setModuleDone] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const [code, setCode] = useState('')
  const [stdin, setStdin] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [runError, setRunError] = useState('')

  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null)
  const [quizMessage, setQuizMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch('/api/lessons?courseId=python'),
          fetch('/api/progress?courseId=python')
        ])
        const lessonsData = await lessonsRes.json()
        const progressData = await progressRes.json()

        if (!lessonsRes.ok || !progressRes.ok) {
          setError(lessonsData.error || progressData.error || 'Failed to load lesson')
          return
        }

        const ordered = (lessonsData.lessons || []).slice().sort((a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber)
        setAllLessons(ordered)
        const selected = ordered.find((item: Lesson) => item._id === params.lessonId)
        if (!selected) {
          setError('Lesson not found')
          return
        }

        const progress = (progressData.progress || []).find((item: ProgressItem) => item.lessonId === params.lessonId)

        setLesson(selected)
        setCode(selected.codeExample || '')
        setSubView('menu')
        setSelectedQuizOption(null)
        setQuizMessage('')
        setLessonDone(Boolean(progress?.codePassed))
        setExerciseDone(Boolean(progress?.quizPassed))
        setModuleDone(Boolean(progress?.completed))
      } catch {
        setError('Network error while loading lesson')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.lessonId])

  const currentIndex = useMemo(
    () => allLessons.findIndex((item) => item._id === lesson?._id),
    [allLessons, lesson?._id]
  )
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const lessonQuiz = lesson ? pythonQuizzes[lesson.lessonNumber] : undefined
  const currentSubCompleted = subView === 'menu' ? moduleDone : subView === 'lesson' ? lessonDone : exerciseDone

  const normalizeOutput = (value?: string | null) => (value || '').replace(/\r\n/g, '\n').trim()

  const evaluatePass = (
    output: string | null | undefined,
    statusDescription: string | undefined,
    expectedOutput: string | undefined
  ) => {
    if (expectedOutput && normalizeOutput(expectedOutput).length > 0) {
      return normalizeOutput(output) === normalizeOutput(expectedOutput)
    }
    return statusDescription === 'Accepted'
  }

  const saveProgress = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'python',
        lessonId: lesson?._id,
        ...payload
      })
    })
    return res
  }

  const handleToggleComplete = async () => {
    if (!lesson) return
    setIsSaving(true)
    setSaveMessage('')
    try {
      if (subView === 'menu') {
        const next = !moduleDone
        const res = await saveProgress({ completed: next, codePassed: next, quizPassed: next })
        if (!res.ok) {
          const data = await res.json()
          setSaveMessage(data.error || 'Failed to save progress')
          return
        }
        setModuleDone(next)
        setLessonDone(next)
        setExerciseDone(next)
        setSelectedQuizOption(null)
        setQuizMessage('')
        setSaveMessage(next ? 'Module marked complete.' : 'Module marked incomplete.')
        return
      }

      if (subView === 'lesson') {
        const nextLessonDone = !lessonDone
        const nextModuleDone = nextLessonDone && exerciseDone
        const res = await saveProgress({ codePassed: nextLessonDone, completed: nextModuleDone })
        if (!res.ok) {
          const data = await res.json()
          setSaveMessage(data.error || 'Failed to save progress')
          return
        }
        setLessonDone(nextLessonDone)
        setModuleDone(nextModuleDone)
        setSaveMessage(nextLessonDone ? 'Lesson submodule marked complete.' : 'Lesson submodule marked incomplete.')
        return
      }

      const nextExerciseDone = !exerciseDone
      const nextModuleDone = lessonDone && nextExerciseDone
      const res = await saveProgress({ quizPassed: nextExerciseDone, completed: nextModuleDone })
      if (!res.ok) {
        const data = await res.json()
        setSaveMessage(data.error || 'Failed to save progress')
        return
      }
      setExerciseDone(nextExerciseDone)
      setModuleDone(nextModuleDone)
      setSelectedQuizOption(null)
      setQuizMessage('')
      setSaveMessage(nextExerciseDone ? 'Exercise submodule marked complete.' : 'Exercise submodule marked incomplete.')
    } catch {
      setSaveMessage('Network error while saving progress')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunCode = async () => {
    if (!lesson) return
    if (!code.trim()) {
      setRunError('Please write some code before running.')
      setRunResult(null)
      return
    }

    setIsRunning(true)
    setRunError('')
    setRunResult(null)
    try {
      const res = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          code,
          stdin
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setRunError(data.error || 'Code execution failed')
        return
      }

      setRunResult(data)
      const didPass = evaluatePass(data.stdout, data.status?.description, lesson.expectedOutput)

      await fetch('/api/submissions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'python',
          lessonId: lesson._id,
          code,
          stdout: data.stdout || '',
          stderr: data.stderr || data.compile_output || data.message || '',
          status: data.status?.description || 'Unknown',
          passed: didPass
        })
      })
    } catch {
      setRunError('Network error while running code')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!lesson || !lessonQuiz || selectedQuizOption === null) return
    const isCorrect = selectedQuizOption === lessonQuiz.correctIndex
    if (!isCorrect) {
      setQuizMessage('Incorrect. Try again.')
      return
    }

    setExerciseDone(true)
    const nextModuleDone = lessonDone && true
    setModuleDone(nextModuleDone)
    setQuizMessage(`Correct. ${lessonQuiz.explanation}`)

    await saveProgress({
      quizPassed: true,
      completed: nextModuleDone
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading lesson...</div>
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/courses/python" className="text-blue-700 hover:underline">
            Back to Python Course
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        {allLessons.length > 0 && (
          <nav className="mb-4 p-3 bg-white border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Course Navigator</p>
            <div className="flex flex-wrap gap-2">
              {allLessons.map((item) => {
                const isCurrent = item._id === lesson?._id
                return (
                  <Link
                    key={item._id}
                    href={`/learn/${item._id}`}
                    className={
                      isCurrent
                        ? 'px-3 py-1 rounded text-sm bg-blue-700 text-white'
                        : 'px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }
                  >
                    {item.lessonNumber}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Lesson {lesson?.lessonNumber}</h1>
          <Link href="/courses/python" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
            Back to Course
          </Link>
        </div>

        <article className="border border-fuchsia-200 bg-gradient-to-br from-white/95 via-rose-50/90 to-fuchsia-100/85 rounded-2xl p-6 shadow-md space-y-5">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">{lesson?.title}</h2>
            <p className="text-gray-700">{lesson?.description}</p>
          </div>

          {subView === 'menu' && (
            <section className="space-y-3">
              <button
                type="button"
                onClick={() => setSubView('lesson')}
                className="relative w-full rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-left hover:bg-cyan-100"
              >
                {lessonDone && (
                  <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    ✓
                  </span>
                )}
                <p className="text-xs font-bold text-cyan-700">Lesson Item</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg leading-none" aria-hidden>
                    📘
                  </span>
                  <p className="text-lg font-bold text-slate-900">Lesson {lesson?.lessonNumber}.1</p>
                </div>
                <p className="text-sm text-slate-600 mt-1">Click to open lesson theory.</p>
              </button>

              <button
                type="button"
                onClick={() => setSubView('exercise')}
                className="relative w-full rounded-xl border border-pink-200 bg-pink-50 px-4 py-4 text-left hover:bg-pink-100"
              >
                {exerciseDone && (
                  <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    ✓
                  </span>
                )}
                <p className="text-xs font-bold text-pink-700">Exercise Item</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg leading-none" aria-hidden>
                    🧩
                  </span>
                  <p className="text-lg font-bold text-slate-900">Exercise {lesson?.lessonNumber}.1</p>
                </div>
                <p className="text-sm text-slate-600 mt-1">Click to open exercise.</p>
              </button>
            </section>
          )}

          {subView === 'lesson' && (
            <section className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lesson {lesson?.lessonNumber}.1</h3>
              <p className="whitespace-pre-line text-gray-800">{lesson?.content}</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubView('menu')}
                  className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLessonDone(true)
                    setSubView('exercise')
                  }}
                  className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {subView === 'exercise' && (
            <>
              {lesson?.codeExample && (
                <section className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Code Example</h3>
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">Read + Try</span>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm border border-indigo-300">
                    <code>{lesson.codeExample}</code>
                  </pre>
                </section>
              )}

              {(lesson?.exercise || lesson?.expectedOutput) && (
                <section className="space-y-3">
                  {lesson?.exercise && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-slate-900">Exercise {exerciseDone ? '(Passed)' : ''}</h3>
                      <p className="text-gray-800">{lesson.exercise}</p>
                    </div>
                  )}
                  {lesson?.expectedOutput && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-slate-900">Expected Output</h3>
                      <p className="text-gray-800">{lesson.expectedOutput}</p>
                    </div>
                  )}
                </section>
              )}

              {lessonQuiz && (
                <section>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">
                    Exercise {lesson?.lessonNumber}.1 Check {exerciseDone ? '✓' : ''}
                  </h3>
                  <p className="text-gray-800 mb-3">{lessonQuiz.question}</p>
                  <div className="space-y-2">
                    {lessonQuiz.options.map((option, index) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-800">
                        <input
                          type="radio"
                          name="lesson-quiz"
                          checked={selectedQuizOption === index}
                          onChange={() => setSelectedQuizOption(index)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={exerciseDone || selectedQuizOption === null}
                    className="mt-3 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {exerciseDone ? 'Quiz Passed' : 'Submit Quiz'}
                  </button>
                  {quizMessage && <p className="mt-2 text-sm text-gray-700">{quizMessage}</p>}
                </section>
              )}

              <section className="rounded-xl border border-blue-200 bg-white/80 p-4">
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Try It Yourself (Python)</h3>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-56 p-3 rounded border bg-gray-950 text-gray-100 font-mono text-sm"
                  placeholder="Write your Python code here..."
                />
                <input
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="w-full mt-3 p-2 rounded border text-gray-900"
                  placeholder="Optional input (stdin)"
                />
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>

                {runError && <p className="mt-3 text-sm text-red-600">{runError}</p>}

                {runResult && (
                  <div className="mt-4 bg-gray-100 rounded border p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      Status: <span className="font-semibold">{runResult.status?.description || 'Unknown'}</span>
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      Time: {runResult.time || '-'}s | Memory: {runResult.memory || '-'} KB
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Output</p>
                        <pre className="bg-white border rounded p-2 text-sm overflow-x-auto whitespace-pre-wrap">
                          {runResult.stdout || '(no output)'}
                        </pre>
                      </div>
                      {(runResult.stderr || runResult.compile_output || runResult.message) && (
                        <div>
                          <p className="text-sm font-semibold text-red-700">Errors</p>
                          <pre className="bg-white border rounded p-2 text-sm overflow-x-auto whitespace-pre-wrap text-red-700">
                            {runResult.stderr || runResult.compile_output || runResult.message}
                          </pre>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-800">
                      Result Check:{' '}
                      {evaluatePass(runResult.stdout, runResult.status?.description, lesson?.expectedOutput)
                        ? 'Passed'
                        : 'Not matched yet'}
                    </p>
                  </div>
                )}
              </section>
            </>
          )}

          <section className="pt-2">
            <button
              onClick={handleToggleComplete}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : currentSubCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
            {saveMessage && <p className="mt-2 text-sm text-gray-700">{saveMessage}</p>}
          </section>

          <section className="pt-2 flex items-center justify-between">
            {previousLesson ? (
              <Link
                href={`/learn/${previousLesson._id}`}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Previous Lesson
              </Link>
            ) : (
              <span className="text-sm text-gray-500">No previous lesson</span>
            )}

            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next Lesson
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Course completed</span>
            )}
          </section>
        </article>
      </div>
    </main>
  )
}
