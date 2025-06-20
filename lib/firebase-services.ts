import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'
import { db } from './firebase'
import { Album, CreateAlbumData } from '@/types'

const ALBUMS_COLLECTION = 'albums'

export const albumService = {
  // Create a new album
  async createAlbum(data: CreateAlbumData): Promise<string> {
    try {
      // Upload image to ImgBB
      const imageUrl = await uploadToImgBB(data.coverFile)
      
      // Create album document
      const albumData = {
        artistName: data.artistName,
        albumName: data.albumName,
        coverUrl: imageUrl,
        streamingLinks: data.streamingLinks,
        subdomain: data.subdomain,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const docRef = await addDoc(collection(db, ALBUMS_COLLECTION), albumData)
      return docRef.id
    } catch (error) {
      console.error('Error creating album:', error)
      throw new Error('Failed to create album')
    }
  },

  // Get album by subdomain
  async getAlbumBySubdomain(subdomain: string): Promise<Album | null> {
    try {
      const q = query(
        collection(db, ALBUMS_COLLECTION),
        where('subdomain', '==', subdomain)
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as Album
    } catch (error) {
      console.error('Error fetching album:', error)
      throw new Error('Failed to fetch album')
    }
  },

  // Get album by ID
  async getAlbumById(id: string): Promise<Album | null> {
    try {
      const docRef = doc(db, ALBUMS_COLLECTION, id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return null
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Album
    } catch (error) {
      console.error('Error fetching album:', error)
      throw new Error('Failed to fetch album')
    }
  },

  // Get featured albums (most recent)
  async getFeaturedAlbums(limitCount: number = 6): Promise<Album[]> {
    try {
      const q = query(
        collection(db, ALBUMS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Album[]
    } catch (error) {
      console.error('Error fetching featured albums:', error)
      throw new Error('Failed to fetch featured albums')
    }
  },

  // Update album
  async updateAlbum(id: string, data: Partial<Album>): Promise<void> {
    try {
      const docRef = doc(db, ALBUMS_COLLECTION, id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating album:', error)
      throw new Error('Failed to update album')
    }
  },

  // Delete album
  async deleteAlbum(id: string): Promise<void> {
    try {
      const docRef = doc(db, ALBUMS_COLLECTION, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting album:', error)
      throw new Error('Failed to delete album')
    }
  },

  // Check if subdomain is available
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, ALBUMS_COLLECTION),
        where('subdomain', '==', subdomain)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty
    } catch (error) {
      console.error('Error checking subdomain availability:', error)
      throw new Error('Failed to check subdomain availability')
    }
  }
}

// Upload image to ImgBB
export async function uploadToImgBB(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error('Failed to upload image to ImgBB')
    }
    
    return data.data.url
  } catch (error) {
    console.error('Error uploading to ImgBB:', error)
    throw new Error('Failed to upload image')
  }
} 