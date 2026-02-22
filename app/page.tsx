import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">CodingLab</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-8">
        <h2 className="text-5xl font-bold mb-6">Learn to Code.<br/>Build Your Future.</h2>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl">Interactive coding lessons, roadmaps, and projects. From complete beginner to job ready.</p>
        <Link href="/login" className="px-8 py-4 bg-blue-600 rounded-lg text-xl hover:bg-blue-700">
          Start Learning Free
        </Link>
      </section>

      {/* Sections */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-8">What do you want to learn?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Programming Languages */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 cursor-pointer">
            <h4 className="text-xl font-bold mb-2">Programming Languages</h4>
            <p className="text-gray-400 mb-4">Python, JavaScript, Java, C++ and more</p>
            <span className="text-blue-500">Explore →</span>
          </div>

          {/* Roadmaps */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 cursor-pointer">
            <h4 className="text-xl font-bold mb-2">Roadmaps</h4>
            <p className="text-gray-400 mb-4">Web Dev, AI/ML, Data Analytics and more</p>
            <span className="text-blue-500">Explore →</span>
          </div>

          {/* Subjects */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 cursor-pointer">
            <h4 className="text-xl font-bold mb-2">Subjects</h4>
            <p className="text-gray-400 mb-4">Mathematics, Physics, Chemistry and more</p>
            <span className="text-blue-500">Explore →</span>
          </div>

        </div>
      </section>
    </div>
  );
}
