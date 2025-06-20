'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Music, ArrowLeft } from 'lucide-react'
import { Album } from '@/types'
import { albumService } from '@/lib/firebase-services'
import { Instrument_Sans } from 'next/font/google'

const instrumentSans = Instrument_Sans({ subsets: ['latin'] })

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading album...</p>
        </div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Album Not Found</h1>
          <p className="text-gray-400 mb-6">
            The album you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-gray-300 font-medium"
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Blurred background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={album.coverUrl}
          alt=""
          className="w-[800px] h-[800px] object-cover rounded-[30px] blur-[200px] opacity-75"
          style={{ filter: 'blur(200px)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Album Cover */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <img
              src={album.coverUrl}
              alt={`${album.albumName} by ${album.artistName}`}
              className="w-80 h-80 object-cover rounded-[30px] mx-auto"
            />
          </motion.div>

          {/* Album Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <h1 
              className={`text-5xl md:text-6xl font-bold text-white leading-tight mb-4 ${instrumentSans.className}`}
            >
              {album.albumName}
            </h1>
            <p 
              className="text-2xl text-gray-300 font-medium tracking-wider"
              style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
            >
              {album.artistName.toUpperCase()}
            </p>
          </motion.div>

          {/* Streaming Links */}
          {availableServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="grid gap-4 max-w-md mx-auto">
                {availableServices.map((service) => (
                  <a
                    key={service.key}
                    href={album.streamingLinks[service.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${service.color} text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between group hover:shadow-lg hover:scale-105`}
                    style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{service.icon}</span>
                      <span className="text-lg tracking-wider">{service.name.toUpperCase()}</span>
                    </div>
                    <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 