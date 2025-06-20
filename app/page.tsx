'use client'

import { useState } from 'react'
import { Music, Upload } from 'lucide-react'
import AlbumForm from '@/components/AlbumForm'

export default function Home() {
  const [showForm, setShowForm] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-slate-900">Good Day Records</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Create Your Album Page
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Upload your album cover, add streaming links, and get a custom subdomain to share your music.
            </p>
          </div>
          
          {/* Album Form */}
          <AlbumForm onClose={() => {}} />
        </div>
      </div>
    </div>
  )
} 