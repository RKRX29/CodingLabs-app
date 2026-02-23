import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-fuchsia-50 to-orange-50 text-slate-900">
      <div className="pointer-events-none absolute -left-36 -top-24 h-96 w-96 rounded-full bg-fuchsia-300/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-16 h-[28rem] w-[28rem] rounded-full bg-orange-300/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-[30rem] w-[30rem] rounded-full bg-pink-300/45 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-gradient-to-r from-purple-200/25 via-pink-200/25 to-orange-200/25 blur-2xl" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <h1 className="text-4xl font-black tracking-tight text-blue-700">CodingLabs</h1>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-lg px-4 py-2 text-lg font-bold text-slate-800 hover:bg-white">
            Login
          </Link>
          <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-lg font-bold text-white hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 pt-6 md:grid-cols-[1.25fr_0.75fr] md:px-10 md:pt-12">
        <div className="rounded-3xl border border-fuchsia-200 bg-gradient-to-br from-white/90 via-rose-50/90 to-fuchsia-100/85 p-8 shadow-md backdrop-blur-sm md:p-12">
          <p className="mb-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-base font-bold tracking-wide text-blue-800">
            Structured coding for real outcomes
          </p>
          <h2 className="mb-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
            Learn to Code.
            <br />
            Build Your Future.
          </h2>
          <p className="mb-10 max-w-3xl text-xl font-semibold text-slate-700 md:text-2xl">
            Interactive lessons, code runner practice, chapter quizzes, and progress tracking in one focused learning flow.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-7 py-3 text-xl font-bold text-white hover:bg-blue-700"
            >
              Start Learning Free
            </Link>
            <Link
              href="/courses/python"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-xl font-bold text-slate-800 hover:bg-slate-50"
            >
              Explore Python Course
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-100/85 to-white/90 p-7 shadow-sm backdrop-blur-sm">
            <p className="text-base font-bold text-slate-500">Learner Progress</p>
            <p className="mt-2 text-4xl font-black text-slate-900">Trackable</p>
            <p className="mt-2 text-lg font-medium text-slate-700">Code pass + quiz pass + completion state are all persisted.</p>
          </div>
          <div className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-100/85 to-white/90 p-7 shadow-sm backdrop-blur-sm">
            <p className="text-base font-bold text-slate-500">Practice Engine</p>
            <p className="mt-2 text-4xl font-black text-slate-900">Live Runner</p>
            <p className="mt-2 text-lg font-medium text-slate-700">Run Python code instantly with output validation and attempt history.</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-100/85 to-white/90 p-7 shadow-sm backdrop-blur-sm">
            <p className="text-base font-bold text-teal-800">Current Focus</p>
            <p className="mt-2 text-2xl font-black text-slate-900">Multi-Track Learning</p>
            <p className="mt-2 text-lg font-medium text-slate-700">Languages, roadmaps, and core subjects in one platform.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-10">
        <h3 className="mb-8 inline-flex rounded-xl bg-gradient-to-r from-violet-100 to-pink-100 px-4 py-2 text-4xl font-black text-slate-900 md:text-5xl">
          Choose Your Learning Path
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100/85 to-white/90 p-7 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h4 className="mb-3 inline-flex rounded-lg bg-violet-600 px-3 py-1 text-2xl font-black text-white">Programming Languages</h4>
            <p className="mb-5 text-xl font-medium text-slate-700">
              Python
              <br />
              Java
              <br />
              C++
            </p>
            <span className="text-lg font-bold text-blue-700">Explore path</span>
          </div>
          <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-100/80 to-white/90 p-7 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h4 className="mb-3 inline-flex rounded-lg bg-fuchsia-600 px-3 py-1 text-2xl font-black text-white">Roadmaps</h4>
            <p className="mb-5 text-xl font-medium text-slate-700">
              Web Development
              <br />
              AI/ML
              <br />
              Data Science
            </p>
            <span className="text-lg font-bold text-blue-700">Explore roadmap</span>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-100/80 to-white/90 p-7 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h4 className="mb-3 inline-flex rounded-lg bg-orange-500 px-3 py-1 text-2xl font-black text-white">Core Subjects</h4>
            <p className="mb-5 text-xl font-medium text-slate-700">
              Mathematics
              <br />
              Problem Solving
              <br />
              Computer Science Basics
            </p>
            <span className="text-lg font-bold text-blue-700">Explore modules</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">
        <h3 className="mb-8 inline-flex rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 text-4xl font-black text-slate-900 md:text-5xl">
          Learn, Practice, Achieve
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-200 bg-white/90 p-7 shadow-sm backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-black text-slate-900">Learn Concept</h4>
            <p className="text-lg font-medium text-slate-700">Understand lesson concepts through structured and readable content.</p>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-white/90 p-7 shadow-sm backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-black text-slate-900">Run Code</h4>
            <p className="text-lg font-medium text-slate-700">Practice instantly in the built-in runner and validate output.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white/90 p-7 shadow-sm backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-black text-slate-900">Pass & Progress</h4>
            <p className="text-lg font-medium text-slate-700">Complete quiz + coding checks and track real progress chapter by chapter.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
