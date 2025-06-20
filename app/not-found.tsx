import Link from 'next/link'
import { Music } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Music className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Album Not Found</h2>
        <p className="text-slate-600 mb-8">
          The album page you're looking for doesn't exist.
        </p>
        <Link 
          href="/"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Your Album Page
        </Link>
      </div>
    </div>
  )
} 