'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Music, ExternalLink } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { CreateAlbumData, StreamingLinks } from '@/types'
import { albumService } from '@/lib/firebase-services'

interface AlbumFormProps {
  onClose: () => void
}

const streamingServices = [
  { key: 'spotify', name: 'Spotify', icon: '🎵' },
  { key: 'appleMusic', name: 'Apple Music', icon: '🍎' },
  { key: 'youtube', name: 'YouTube', icon: '📺' },
  { key: 'soundcloud', name: 'SoundCloud', icon: '☁️' },
  { key: 'bandcamp', name: 'Bandcamp', icon: '🎸' },
  { key: 'tidal', name: 'Tidal', icon: '🌊' },
  { key: 'amazonMusic', name: 'Amazon Music', icon: '📦' },
  { key: 'deezer', name: 'Deezer', icon: '🎧' },
]

export default function AlbumForm({ onClose }: AlbumFormProps) {
  const [formData, setFormData] = useState<Partial<CreateAlbumData>>({
    artistName: '',
    albumName: '',
    subdomain: '',
    streamingLinks: {},
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkingSubdomain, setCheckingSubdomain] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setCoverFile(file)
        const reader = new FileReader()
        reader.onload = () => {
          setCoverPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  })

  const handleInputChange = (field: keyof CreateAlbumData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStreamingLinkChange = (service: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      streamingLinks: {
        ...prev.streamingLinks,
        [service]: url
      }
    }))
  }

  const generateSubdomain = () => {
    const artist = formData.artistName?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
    const album = formData.albumName?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
    const subdomain = `${artist}-${album}`.substring(0, 30)
    setFormData(prev => ({ ...prev, subdomain }))
  }

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain) return
    
    setCheckingSubdomain(true)
    try {
      const isAvailable = await albumService.isSubdomainAvailable(subdomain)
      if (!isAvailable) {
        toast.error('This subdomain is already taken. Please choose another one.')
      } else {
        toast.success('Subdomain is available!')
      }
    } catch (error) {
      console.error('Error checking subdomain:', error)
      toast.error('Error checking subdomain availability')
    } finally {
      setCheckingSubdomain(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.artistName || !formData.albumName || !formData.subdomain || !coverFile) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Check subdomain availability
      const isAvailable = await albumService.isSubdomainAvailable(formData.subdomain)
      if (!isAvailable) {
        toast.error('This subdomain is already taken. Please choose another one.')
        return
      }

      // Create album
      const albumData: CreateAlbumData = {
        artistName: formData.artistName,
        albumName: formData.albumName,
        subdomain: formData.subdomain,
        coverFile: coverFile,
        streamingLinks: formData.streamingLinks || {},
      }

      await albumService.createAlbum(albumData)
      
      toast.success('Album created successfully!')
      onClose()
      
      // Redirect to the new album page
      window.open(`https://${formData.subdomain}.gooddayrecords.xyz`, '_blank')
    } catch (error) {
      console.error('Error creating album:', error)
      toast.error('Failed to create album. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Share Your Album</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Album Cover Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Album Cover *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input {...getInputProps()} />
                {coverPreview ? (
                  <div className="space-y-4">
                    <img
                      src={coverPreview}
                      alt="Album cover preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-slate-600">
                      {coverFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-900">
                        {isDragActive ? 'Drop the file here' : 'Upload album cover'}
                      </p>
                      <p className="text-sm text-slate-500">
                        Drag and drop or click to select
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Album Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={formData.artistName}
                  onChange={(e) => handleInputChange('artistName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., The Beatles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Album Name *
                </label>
                <input
                  type="text"
                  value={formData.albumName}
                  onChange={(e) => handleInputChange('albumName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Abbey Road"
                />
              </div>
            </div>

            {/* Subdomain */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subdomain *
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your-album-name"
                />
                <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-600">
                  .gooddayrecords.xyz
                </span>
              </div>
              <div className="flex space-x-2 mt-1">
                <button
                  type="button"
                  onClick={generateSubdomain}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Generate from artist & album name
                </button>
                {formData.subdomain && (
                  <button
                    type="button"
                    onClick={() => checkSubdomainAvailability(formData.subdomain!)}
                    disabled={checkingSubdomain}
                    className="text-sm text-slate-600 hover:text-slate-700 disabled:opacity-50"
                  >
                    {checkingSubdomain ? 'Checking...' : 'Check availability'}
                  </button>
                )}
              </div>
            </div>

            {/* Streaming Links */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Streaming Links
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {streamingServices.map((service) => (
                  <div key={service.key}>
                    <label className="block text-sm text-slate-600 mb-1">
                      {service.icon} {service.name}
                    </label>
                    <input
                      type="url"
                      value={formData.streamingLinks?.[service.key] || ''}
                      onChange={(e) => handleStreamingLinkChange(service.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      placeholder={`${service.name} URL`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Music className="h-4 w-4" />
                    <span>Create Album Page</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 