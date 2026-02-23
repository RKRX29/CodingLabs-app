'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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

type Attempt = {
  _id: string
  status: string
  stdout: string
  stderr: string
  passed: boolean
  createdAt: string
}

export default function LessonDetailPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [code, setCode] = useState('')
  const [stdin, setStdin] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<{
    stdout?: string | null
    stderr?: string | null
    compile_output?: string | null
    message?: string | null
    status?: { id: number; description: string }
    time?: string
    memory?: number
  } | null>(null)
  const [runError, setRunError] = useState('')
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [attemptsLoading, setAttemptsLoading] = useState(false)
  const [hasPassedAttempt, setHasPassedAttempt] = useState(false)
  const [hasQuizPassed, setHasQuizPassed] = useState(false)
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null)
  const [quizMessage, setQuizMessage] = useState('')
  const params = useParams<{ lessonId: string }>()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch('/api/lessons?courseId=python'),
          fetch('/api/progress?courseId=python')
        ])

        const lessonsData = await lessonsRes.json()
        const progressData = await progressRes.json()

        if (!lessonsRes.ok) {
          setError(lessonsData.error || 'Failed to load lesson')
          return
        }
        if (!progressRes.ok) {
          setError(progressData.error || 'Failed to load progress')
          return
        }

        const orderedLessons = (lessonsData.lessons || []).slice().sort((a: Lesson, b: Lesson) => a.lessonNumber - b.lessonNumber)
        setAllLessons(orderedLessons)

        const completedIds = new Set<string>(
          (progressData.progress || [])
            .filter((item: ProgressItem) => item.completed)
            .map((item: ProgressItem) => item.lessonId)
        )
        setCompletedLessonIds(completedIds)

        const selectedLesson = orderedLessons.find((item: Lesson) => item._id === params.lessonId)
        if (!selectedLesson) {
          setError('Lesson not found')
          return
        }

        const currentIndex = orderedLessons.findIndex((item: Lesson) => item._id === params.lessonId)
        const previousLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null
        const locked = !!previousLesson && !completedIds.has(previousLesson._id)
        setIsLocked(locked)

        setLesson(selectedLesson)
        setCode(selectedLesson.codeExample || '')
        const currentProgress = (progressData.progress || []).find(
          (item: ProgressItem) => item.lessonId === params.lessonId
        )
        setIsCompleted(Boolean(currentProgress?.completed))
        setHasQuizPassed(Boolean(currentProgress?.quizPassed))
        setHasPassedAttempt(Boolean(currentProgress?.codePassed))

        setAttemptsLoading(true)
        const attemptsRes = await fetch(`/api/submissions?lessonId=${params.lessonId}&limit=5`)
        const attemptsData = await attemptsRes.json()
        if (attemptsRes.ok) {
          const fetchedAttempts = attemptsData.submissions || []
          setAttempts(fetchedAttempts)
          if (fetchedAttempts.some((item: Attempt) => item.passed)) {
            setHasPassedAttempt(true)
          }
        }
      } catch {
        setError('Network error while loading lesson')
      } finally {
        setAttemptsLoading(false)
        setLoading(false)
      }
    }

    fetchLesson()
  }, [params.lessonId])

  const handleToggleComplete = async () => {
    if (!lesson) return
    if (!isCompleted && (!hasPassedAttempt || !hasQuizPassed)) return

    setIsSaving(true)
    setSaveMessage('')
    try {
      const nextCompleted = !isCompleted
      const res = await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'python',
          lessonId: lesson._id,
          completed: nextCompleted
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setSaveMessage(data.error || 'Failed to save progress')
        return
      }

      setIsCompleted(nextCompleted)
      setCompletedLessonIds((prev) => {
        const next = new Set(prev)
        if (nextCompleted) next.add(lesson._id)
        else next.delete(lesson._id)
        return next
      })
      setSaveMessage(nextCompleted ? 'Lesson marked as complete.' : 'Lesson marked as incomplete.')
    } catch {
      setSaveMessage('Network error while saving progress')
    } finally {
      setIsSaving(false)
    }
  }

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
      setHasPassedAttempt((prev) => prev || didPass)

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

      const attemptsRes = await fetch(`/api/submissions?lessonId=${lesson._id}&limit=5`)
      const attemptsData = await attemptsRes.json()
      if (attemptsRes.ok) {
        const fetchedAttempts = attemptsData.submissions || []
        setAttempts(fetchedAttempts)
        if (fetchedAttempts.some((item: Attempt) => item.passed)) {
          setHasPassedAttempt(true)
        }
      }

      if (didPass) {
        await fetch('/api/progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: 'python',
            lessonId: lesson._id,
            codePassed: true
          })
        })
      }

      // Auto-complete only if both code and quiz are passed.
      if (didPass && hasQuizPassed && !isCompleted) {
        const completeRes = await fetch('/api/progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: 'python',
            lessonId: lesson._id,
            codePassed: true,
            quizPassed: true,
            completed: true
          })
        })
        if (completeRes.ok) {
          setIsCompleted(true)
          setCompletedLessonIds((prev) => {
            const next = new Set(prev)
            next.add(lesson._id)
            return next
          })
          setSaveMessage('Code + quiz passed. Auto-marked as complete.')
        }
      }
    } catch {
      setRunError('Network error while running code')
    } finally {
      setIsRunning(false)
    }
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

  const currentIndex = allLessons.findIndex((item) => item._id === lesson?._id)
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const nextLocked = !!nextLesson && !isCompleted
  const canAccessLesson = (targetLesson: Lesson, targetIndex: number) => {
    if (targetIndex === 0) return true
    const prev = allLessons[targetIndex - 1]
    return completedLessonIds.has(prev._id) || targetLesson._id === lesson?._id
  }

  const lessonQuiz = lesson ? pythonQuizzes[lesson.lessonNumber] : undefined
  const isFirstLesson = lesson?.lessonNumber === 1

  const handleSubmitQuiz = async () => {
    if (!lesson || !lessonQuiz || selectedQuizOption === null) return

    const isCorrect = selectedQuizOption === lessonQuiz.correctIndex
    if (!isCorrect) {
      setQuizMessage('Incorrect. Try again.')
      return
    }

    setHasQuizPassed(true)
    setQuizMessage(`Correct. ${lessonQuiz.explanation}`)

    await fetch('/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'python',
        lessonId: lesson._id,
        quizPassed: true
      })
    })

    if (hasPassedAttempt && !isCompleted) {
      const completeRes = await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'python',
          lessonId: lesson._id,
          codePassed: true,
          quizPassed: true,
          completed: true
        })
      })
      if (completeRes.ok) {
        setIsCompleted(true)
        setCompletedLessonIds((prev) => {
          const next = new Set(prev)
          next.add(lesson._id)
          return next
        })
        setSaveMessage('Code + quiz passed. Auto-marked as complete.')
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        {allLessons.length > 0 && (
          <nav className="mb-4 p-3 bg-white border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Course Navigator</p>
            <div className="flex flex-wrap gap-2">
              {allLessons.map((item, index) => {
                const isCurrent = item._id === lesson?._id
                const available = canAccessLesson(item, index)
                if (!available) {
                  return (
                    <span key={item._id} className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-500">
                      {item.lessonNumber}
                    </span>
                  )
                }
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

        {isLocked ? (
          <article className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Lesson Locked</h2>
            <p className="text-gray-700 mb-4">Complete the previous lesson first to unlock this one.</p>
            {previousLesson && (
              <Link
                href={`/learn/${previousLesson._id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Previous Lesson
              </Link>
            )}
          </article>
        ) : (
        <article
          className={
            isFirstLesson
              ? 'border border-fuchsia-200 bg-gradient-to-br from-white/95 via-rose-50/90 to-fuchsia-100/85 rounded-2xl p-6 shadow-md space-y-5'
              : 'bg-white border rounded-lg p-6 shadow-sm space-y-5'
          }
        >
          {isFirstLesson && (
            <section className="rounded-2xl border border-violet-200 bg-white/80 p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="inline-flex rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white">
                  Lesson Experience
                </p>
                <p className="text-sm font-semibold text-slate-600">Interactive Intro</p>
              </div>
              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full w-1/5 rounded-full bg-emerald-500" />
              </div>
              <div className="grid gap-3 md:grid-cols-[120px_1fr] md:items-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-4xl">
                  <span role="img" aria-label="code">
                    {'</>'}
                  </span>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4">
                  <p className="text-lg font-semibold text-slate-800">
                    Start with core Python basics, then solve a quick exercise and run your first code.
                  </p>
                </div>
              </div>
            </section>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">{lesson?.title}</h2>
            <p className="text-gray-700">{lesson?.description}</p>
          </div>

          <section
            className={
              isFirstLesson
                ? 'rounded-xl border border-cyan-200 bg-cyan-50/80 p-4'
                : ''
            }
          >
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              {isFirstLesson ? 'Concept Snapshot' : 'Concept'}
            </h3>
            <p className="whitespace-pre-line text-gray-800">{lesson?.content}</p>
          </section>

          {lesson?.codeExample && (
            <section
              className={
                isFirstLesson
                  ? 'rounded-xl border border-indigo-200 bg-indigo-50/70 p-4'
                  : ''
              }
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Code Example</h3>
                {isFirstLesson && (
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                    Read + Try
                  </span>
                )}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm border border-indigo-300">
                <code>{lesson.codeExample}</code>
              </pre>
            </section>
          )}

          {(lesson?.exercise || lesson?.expectedOutput) && (
            <section
              className={
                isFirstLesson
                  ? 'grid gap-3 md:grid-cols-2'
                  : 'space-y-3'
              }
            >
              {lesson?.exercise && (
                <div className={isFirstLesson ? 'rounded-xl border border-pink-200 bg-pink-50/80 p-4' : ''}>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">Exercise</h3>
                  <p className="text-gray-800">{lesson.exercise}</p>
                </div>
              )}

              {lesson?.expectedOutput && (
                <div className={isFirstLesson ? 'rounded-xl border border-emerald-200 bg-emerald-50/80 p-4' : ''}>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">Expected Output</h3>
                  <p className="text-gray-800">{lesson.expectedOutput}</p>
                </div>
              )}
            </section>
          )}

          {lessonQuiz && (
            <section>
              <h3 className="text-lg font-semibold mb-2">Quick Quiz</h3>
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
                disabled={hasQuizPassed || selectedQuizOption === null}
                className="mt-3 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {hasQuizPassed ? 'Quiz Passed' : 'Submit Quiz'}
              </button>
              {quizMessage && <p className="mt-2 text-sm text-gray-700">{quizMessage}</p>}
            </section>
          )}

          <section className={isFirstLesson ? 'rounded-xl border border-blue-200 bg-white/80 p-4' : ''}>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              {isFirstLesson ? 'Try It Yourself (Interactive Python Lab)' : 'Try It Yourself (Python)'}
            </h3>
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

            <div className="mt-5">
              <h4 className="text-md font-semibold mb-2">Recent Attempts</h4>
              {attemptsLoading && <p className="text-sm text-gray-600">Loading attempts...</p>}
              {!attemptsLoading && attempts.length === 0 && (
                <p className="text-sm text-gray-600">No attempts yet. Run your code to create one.</p>
              )}
              {!attemptsLoading && attempts.length > 0 && (
                <div className="space-y-2">
                  {attempts.map((attempt) => (
                    <div key={attempt._id} className="bg-white border rounded p-3 text-sm">
                      <p className="text-gray-800">
                        <span className="font-semibold">Status:</span> {attempt.status}
                      </p>
                      <p className={attempt.passed ? 'text-green-700' : 'text-amber-700'}>
                        {attempt.passed ? 'Passed check' : 'Not passed'}
                      </p>
                      <p className="text-gray-600">
                        {new Date(attempt.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="pt-2">
            <button
              onClick={handleToggleComplete}
              disabled={isSaving || (!isCompleted && (!hasPassedAttempt || !hasQuizPassed))}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
            {saveMessage && <p className="mt-2 text-sm text-gray-700">{saveMessage}</p>}
            {!isCompleted && (!hasPassedAttempt || !hasQuizPassed) && (
              <p className="mt-2 text-sm text-amber-700">
                Pass both code check and quiz before marking complete.
              </p>
            )}
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
              nextLocked ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                >
                  Next Lesson (Locked)
                </button>
              ) : (
                <Link
                  href={`/learn/${nextLesson._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Lesson
                </Link>
              )
            ) : (
              <span className="text-sm text-gray-500">Course completed</span>
            )}
          </section>
        </article>
        )}
      </div>
    </main>
  )
}
