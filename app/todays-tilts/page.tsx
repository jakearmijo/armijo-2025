import Link from "next/link";
import Image from "next/image";
import TodaysGames from "../components/TodaysGames";

export default function TodaysTilts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-black dark:to-red-900">
      {/* Header */}
      <header className="bg-red-600 border-b-4 border-black">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="text-lg font-semibold text-white hover:text-red-200 transition-colors"
            >
              ← Back to Portfolio
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image 
                  src="/nhl-logo.svg" 
                  alt="NHL Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Today&apos;s NHL Tilts
              </h1>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Daily NHL Picks & Analysis
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Your daily destination for expert NHL betting insights, analysis, and picks powered by real-time NHL data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-red-200 dark:border-red-800 shadow-lg">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              Daily NHL Picks
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Expert analysis and picks for today&apos;s NHL games using real-time data from the official NHL API.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-red-200 dark:border-red-800 shadow-lg">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              Live Stats & Records
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time team stats, player performance, and transparent win/loss tracking powered by NHL data.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-red-200 dark:border-red-800 shadow-lg">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              Advanced Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              In-depth breakdowns of matchups, trends, and key factors using official NHL statistics and metrics.
            </p>
          </div>
        </div>

        {/* Today's Games Section */}
        <div className="mb-12">
          <TodaysGames />
        </div>

        {/* NHL Data Integration Section */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-xl p-8 text-center border-2 border-orange-300 dark:border-orange-700">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
            Powered by Official NHL Data
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Real-time integration with the official NHL API for accurate stats, schedules, and game data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-black text-orange-400 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
              View Today&apos;s Games
            </button>
            <button className="px-6 py-3 border-2 border-orange-500 text-black dark:text-white rounded-lg hover:bg-red-600 hover:text-white transition-colors font-semibold">
              Live NHL Stats
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
            Questions About NHL Picks?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Reach out to discuss NHL analysis, picks, or partnership opportunities.
          </p>
          <a 
            href="https://calendly.com/armijojake/meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-black rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Schedule a Call
          </a>
        </div>
      </main>
    </div>
  );
}
