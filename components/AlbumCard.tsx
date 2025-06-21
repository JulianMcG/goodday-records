'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Music } from 'lucide-react'
import { Album } from '@/types'

interface AlbumCardProps {
  album: Album
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const streamingServices = [
    { key: 'spotify', name: 'Spotify', color: 'bg-green-500' },
    { key: 'appleMusic', name: 'Apple Music', color: 'bg-pink-500' },
    { key: 'youtube', name: 'YouTube', color: 'bg-red-500' },
    { key: 'soundcloud', name: 'SoundCloud', color: 'bg-orange-500' },
    { key: 'bandcamp', name: 'Bandcamp', color: 'bg-blue-500' },
    { key: 'tidal', name: 'Tidal', color: 'bg-purple-500' },
    { key: 'amazonMusic', name: 'Amazon Music', color: 'bg-yellow-500' },
    { key: 'deezer', name: 'Deezer', color: 'bg-indigo-500' },
  ]

  const availableServices = streamingServices.filter(
    service => album.streamingLinks[service.key]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Album Cover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={album.coverUrl}
          alt={`${album.albumName} by ${album.artistName}`}
          className="w-full h-full object-cover album-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Album Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">
            {album.albumName}
          </h3>
          <p className="text-slate-600 font-medium">
            {album.artistName}
          </p>
        </div>

        {/* Streaming Links */}
        {availableServices.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Available on:</p>
            <div className="flex flex-wrap gap-2">
              {availableServices.map((service) => (
                <a
                  key={service.key}
                  href={album.streamingLinks[service.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${service.color} text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity flex items-center space-x-1`}
                >
                  <span>{service.name}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Subdomain Link */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {album.subdomain}.{typeof window !== 'undefined' ? window.location.hostname : 'gooddayrecords.xyz'}
          </span>
          <a
            href={`https://${album.subdomain}.${typeof window !== 'undefined' ? window.location.hostname : 'gooddayrecords.xyz'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View Page</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
} 