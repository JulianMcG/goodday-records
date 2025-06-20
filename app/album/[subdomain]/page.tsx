'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Music, ArrowLeft } from 'lucide-react'
import { Album } from '@/types'
import { albumService } from '@/lib/firebase-services'

interface AlbumPageProps {
  params: {
    subdomain: string
  }
}

const streamingServices = [
  { key: 'spotify', name: 'Spotify', icon: '🎵', color: 'bg-green-500 hover:bg-green-600' },
  { key: 'appleMusic', name: 'Apple Music', icon: '🍎', color: 'bg-pink-500 hover:bg-pink-600' },
  { key: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500 hover:bg-red-600' },
  { key: 'soundcloud', name: 'SoundCloud', icon: '☁️', color: 'bg-orange-500 hover:bg-orange-600' },
  { key: 'bandcamp', name: 'Bandcamp', icon: '🎸', color: 'bg-blue-500 hover:bg-blue-600' },
  { key: 'tidal', name: 'Tidal', icon: '🌊', color: 'bg-purple-500 hover:bg-purple-600' },
  { key: 'amazonMusic', name: 'Amazon Music', icon: '📦', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { key: 'deezer', name: 'Deezer', icon: '🎧', color: 'bg-indigo-500 hover:bg-indigo-600' },
]

export default function AlbumPage({ params }: AlbumPageProps) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await albumService.getAlbumBySubdomain(params.subdomain)
        
        if (!albumData) {
          setError('Album not found')
          return
        }
        
        setAlbum(albumData)
      } catch (err) {
        console.error('Error fetching album:', err)
        setError('Failed to load album')
      } finally {
        setLoading(false)
      }
    }

    fetchAlbum()
  }, [params.subdomain])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading album...</p>
        </div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Album Not Found</h1>
          <p className="text-slate-600 mb-6">
            The album you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Good Day Records</span>
          </a>
        </div>
      </div>
    )
  }

  const availableServices = streamingServices.filter(
    service => album.streamingLinks[service.key]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Good Day Records</span>
            </a>
            <div className="text-sm text-slate-500">
              {album.subdomain}.gooddayrecords.xyz
            </div>
          </div>
        </div>
      </header>

      {/* Album Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Album Cover */}
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src={album.coverUrl}
                alt={`${album.albumName} by ${album.artistName}`}
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl album-cover"
              />
            </motion.div>
          </div>

          {/* Album Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {album.albumName}
              </h1>
              <p className="text-2xl text-slate-600 font-medium">
                {album.artistName}
              </p>
            </motion.div>

            {/* Streaming Links */}
            {availableServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-slate-900">
                  Listen Now
                </h2>
                <div className="grid gap-3">
                  {availableServices.map((service) => (
                    <a
                      key={service.key}
                      href={album.streamingLinks[service.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${service.color} text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between group hover:shadow-lg`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{service.icon}</span>
                        <span className="text-lg">{service.name}</span>
                      </div>
                      <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-8 border-t border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Share This Album
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigator.share?.({
                    title: `${album.albumName} by ${album.artistName}`,
                    url: window.location.href,
                  })}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 