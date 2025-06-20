'use client'

import { useState, useEffect } from 'react'
import { Music, Upload } from 'lucide-react'
import AlbumForm from '@/components/AlbumForm'

export default function Home() {
  const [showForm, setShowForm] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if environment variables are loaded
    const checkEnvVars = () => {
      console.log('Checking environment variables...')
      
      // Temporarily hardcode for testing
      const firebaseConfig = {
        apiKey: "AIzaSyAIqmbmuZ4tsedAqlEd3Xi-u2gaZvEQxnU",
        authDomain: "goodday-records.firebaseapp.com",
        projectId: "goodday-records",
        storageBucket: "goodday-records.firebasestorage.app",
        messagingSenderId: "216124466634",
        appId: "1:216124466634:web:e8b7c5005867c0fefa9b33",
      }
      
      console.log('Using hardcoded Firebase config:', firebaseConfig)
      
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      ]
      
      // Log all environment variables for debugging
      console.log('All NEXT_PUBLIC env vars:', {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
      })
      
      const missingVars = requiredVars.filter(varName => !process.env[varName])
      
      if (missingVars.length > 0) {
        console.error('Missing environment variables:', missingVars)
        console.log('But continuing with hardcoded config for testing...')
        // Don't set error, continue with hardcoded config
      } else {
        console.log('Environment variables loaded successfully')
      }
      
      setIsLoading(false)
    }

    checkEnvVars()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Music className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Configuration Error</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <p className="text-sm text-slate-500 mb-4">
            Please check your environment variables in Vercel dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

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