'use client'

import { useState } from 'react'
import { Upload, Music, ExternalLink } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { CreateAlbumData, StreamingLinks } from '@/types'
import { albumService } from '@/lib/firebase-services'

interface AlbumFormProps {
  onClose?: () => void
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
      
      // Redirect to the new album page
      window.open(`https://${formData.subdomain}.gooddayrecords.xyz`, '_blank')
      
      // Reset form
      setFormData({
        artistName: '',
        albumName: '',
        subdomain: '',
        streamingLinks: {},
      })
      setCoverFile(null)
      setCoverPreview('')
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Error creating album:', error)
      toast.error('Failed to create album. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Share Your Album</h2>
        <p className="text-slate-600 mt-2">Create a beautiful album page with your own subdomain</p>
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
                    Drag and drop an image, or click to select
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Artist Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Artist Name *
          </label>
          <input
            type="text"
            value={formData.artistName || ''}
            onChange={(e) => handleInputChange('artistName', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter artist name"
            required
          />
        </div>

        {/* Album Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Album Name *
          </label>
          <input
            type="text"
            value={formData.albumName || ''}
            onChange={(e) => handleInputChange('albumName', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter album name"
            required
          />
        </div>

        {/* Subdomain */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subdomain *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.subdomain || ''}
              onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your-album-name"
              required
            />
            <button
              type="button"
              onClick={generateSubdomain}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => checkSubdomainAvailability(formData.subdomain || '')}
              disabled={checkingSubdomain || !formData.subdomain}
              className="px-4 py-3 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {checkingSubdomain ? 'Checking...' : 'Check'}
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Your album will be available at: {formData.subdomain ? `${formData.subdomain}.gooddayrecords.xyz` : 'your-subdomain.gooddayrecords.xyz'}
          </p>
        </div>

        {/* Streaming Links */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Streaming Links
          </label>
          <div className="grid grid-cols-2 gap-4">
            {streamingServices.map((service) => (
              <div key={service.key}>
                <label className="block text-sm text-slate-600 mb-2">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
        >
          {isSubmitting ? 'Creating Album...' : 'Create Album Page'}
        </button>
      </form>
    </div>
  )
} 