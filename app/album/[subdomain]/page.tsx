'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Music, ArrowLeft } from 'lucide-react'
import { Album } from '@/types'
import { albumService } from '@/lib/firebase-services'
import { Instrument_Serif } from 'next/font/google'

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400'
})

interface AlbumPageProps {
  params: {
    subdomain: string
  }
}

const streamingServices = [
  { 
    key: 'spotify', 
    name: 'Spotify', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNi41IDExLjVDMTYuNSAxMS4yMjM5IDE2LjI3NjEgMTEgMTYgMTFDMTUuNzIzOSAxMSAxNS41IDExLjIyMzkgMTUuNSAxMS41QzE1LjUgMTEuNzc2MSAxNS43MjM5IDEyIDE2IDEyQzE2LjI3NjEgMTIgMTYuNSAxMS43NzYxIDE2LjUgMTEuNVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMiAxMUMxMS43MjM5IDExIDExLjUgMTEuMjIzOSAxMS41IDExLjVDMTEuNSAxMS43NzYxIDExLjcyMzkgMTIgMTIgMTJDMTIuMjc2MSAxMiAxMi41IDExLjc3NjEgMTIuNSAxMS41QzEyLjUgMTEuMjIzOSAxMi4yNzYxIDExIDEyIDExWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTggMTFDNy43MjM5IDExIDcuNSAxMS4yMjM5IDcuNSAxMS41QzcuNSAxMS43NzYxIDcuNzIzOSAxMiA4IDEyQzguMjc2MSAxMiA4LjUgMTEuNzc2MSA4LjUgMTEuNUM4LjUgMTEuMjIzOSA4LjI3NjEgMTEgOCAxMVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=' 
  },
  { 
    key: 'appleMusic', 
    name: 'Apple Music', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTIgMTVDMTMuNjU2OSAxNSAxNSAxMy42NTY5IDE1IDEyQzE1IDEwLjM0MzEgMTMuNjU2OSA5IDEyIDlDMTAuMzQzMSA5IDkgMTAuMzQzMSA5IDEyQzkgMTMuNjU2OSAxMC4zNDMxIDE1IDEyIDE1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==' 
  },
  { 
    key: 'youtube', 
    name: 'YouTube', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMCAxNlY4TDE2IDEyTDEwIDE2WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==' 
  },
  { 
    key: 'soundcloud', 
    name: 'SoundCloud', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K' 
  },
  { 
    key: 'bandcamp', 
    name: 'Bandcamp', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K' 
  },
  { 
    key: 'tidal', 
    name: 'Tidal', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K' 
  },
  { 
    key: 'amazonMusic', 
    name: 'Amazon Music', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K' 
  },
  { 
    key: 'deezer', 
    name: 'Deezer', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyQzEzLjY1NjkgMTIgMTUgMTAuNjU2OSAxNSA5QzE1IDcuMzQzMTUgMTMuNjU2OSA2IDEyIDZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K' 
  },
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
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex items-center max-w-7xl mx-auto gap-20">
          {/* Album Cover Section */}
          <div className="relative">
            {/* Multi-layer glow effect to reduce banding */}
            <div className="absolute inset-0">
              {/* Base glow layer */}
              <img
                src={album.coverUrl}
                alt=""
                className="w-[500px] h-[500px] object-cover rounded-[30px] opacity-30"
                style={{ 
                  filter: 'blur(80px) brightness(1.2)',
                  transform: 'scale(1.1)'
                }}
              />
              {/* Additional glow layers for smoother effect */}
              <img
                src={album.coverUrl}
                alt=""
                className="absolute inset-0 w-[500px] h-[500px] object-cover rounded-[30px] opacity-20"
                style={{ 
                  filter: 'blur(120px) brightness(1.5)',
                  transform: 'scale(1.2)'
                }}
              />
              <img
                src={album.coverUrl}
                alt=""
                className="absolute inset-0 w-[500px] h-[500px] object-cover rounded-[30px] opacity-15"
                style={{ 
                  filter: 'blur(160px) brightness(1.8)',
                  transform: 'scale(1.3)'
                }}
              />
            </div>
            
            {/* Album Cover */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10"
            >
              <div 
                className="w-[500px] h-[500px] rounded-[30px] p-[2px]"
                style={{
                  background: 'linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.5) 100%)',
                  opacity: 0.1,
                  mixBlendMode: 'normal'
                }}
              >
                <img
                  src={album.coverUrl}
                  alt={`${album.albumName} by ${album.artistName}`}
                  className="w-full h-full object-cover rounded-[30px]"
                />
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Album Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h1 
                className={`text-6xl md:text-7xl font-bold text-white leading-tight mb-4 ${instrumentSerif.className}`}
              >
                {album.albumName}
              </h1>
              <p 
                className="text-xl text-gray-300 font-bold tracking-wider"
                style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: '700' }}
              >
                {album.artistName.toUpperCase()}
              </p>
            </motion.div>

            {/* Streaming Links */}
            {availableServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center gap-4">
                  {availableServices.map((service) => (
                    <a
                      key={service.key}
                      href={album.streamingLinks[service.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative bg-white bg-opacity-5 text-white px-8 py-4 rounded-full font-bold transition-all duration-200 hover:bg-opacity-10 hover:scale-105 flex items-center justify-center space-x-3"
                      style={{ 
                        fontFamily: 'Helvetica Neue, sans-serif',
                        fontWeight: '700',
                        width: 'fit-content',
                        minWidth: '200px'
                      }}
                    >
                      {/* Stroke effect */}
                      <div 
                        className="absolute inset-0 rounded-full p-[1.25px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 100%)',
                          opacity: 1,
                          mixBlendMode: 'overlay'
                        }}
                      />
                      <img 
                        src={service.logo} 
                        alt={`${service.name} logo`}
                        className="w-6 h-6 relative z-10"
                      />
                      <span className="text-lg tracking-wider relative z-10">{service.name.toUpperCase()}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 