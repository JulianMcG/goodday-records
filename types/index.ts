export interface Album {
  id: string;
  artistName: string;
  albumName: string;
  coverUrl: string;
  streamingLinks: StreamingLinks;
  subdomain: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
  soundcloud?: string;
  bandcamp?: string;
  tidal?: string;
  amazonMusic?: string;
  deezer?: string;
  [key: string]: string | undefined;
}

export interface CreateAlbumData {
  artistName: string;
  albumName: string;
  coverFile: File;
  streamingLinks: StreamingLinks;
  subdomain: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  albums: string[];
} 