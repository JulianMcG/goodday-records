'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Upload, Globe, Heart } from 'lucide-react'
import AlbumForm from '@/components/AlbumForm'
import AlbumCard from '@/components/AlbumCard'
import { Album } from '@/types'
import { albumService } from '@/lib/firebase-services'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedAlbums()
  }, [])

  const loadFeaturedAlbums = async () => {
    try {
      const albums = await albumService.getFeaturedAlbums(6)
      setFeaturedAlbums(albums)
    } catch (error) {
      console.error('Error loading featured albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAlbumCreated = () => {
    // Reload featured albums to show the new one
    loadFeaturedAlbums()
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
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Share Album</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Share Your
              <span className="text-primary-600"> Music</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Create beautiful album pages with custom subdomains. Upload covers, add streaming links, 
              and share your favorite music with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200"
              >
                Get Started
              </button>
              <button className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200">
                View Examples
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Good Day Records?
            </h3>
            <p className="text-lg text-slate-600">
              Everything you need to share your music beautifully
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                Custom Subdomains
              </h4>
              <p className="text-slate-600">
                Get your own subdomain like artist.gooddayrecords.xyz for easy sharing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                Easy Upload
              </h4>
              <p className="text-slate-600">
                Drag and drop album covers, add streaming links, and publish instantly
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                Beautiful Design
              </h4>
              <p className="text-slate-600">
                Clean, modern layouts that showcase your music in the best light
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Featured Albums
            </h3>
            <p className="text-lg text-slate-600">
              Discover amazing music shared by our community
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading albums...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
          
          {!loading && featuredAlbums.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-4">
                No albums yet. Be the first to share your music!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Share Your First Album
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Album Form Modal */}
      {showForm && (
        <AlbumForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
} 