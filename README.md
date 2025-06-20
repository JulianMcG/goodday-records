# Good Day Records - Album Sharing Platform

A modern web application for sharing albums with custom subdomains, similar to Last.fm. Users can upload album covers, add artist and album names, and include links to various streaming services.

## Features

- 🎵 **Album Sharing**: Upload album covers and metadata
- 🌐 **Custom Subdomains**: Each album gets its own subdomain (e.g., `artist-album.gooddayrecords.xyz`)
- 🎧 **Streaming Integration**: Support for Spotify, Apple Music, YouTube, SoundCloud, Bandcamp, Tidal, Amazon Music, and Deezer
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🔥 **Firebase Backend**: Scalable database and storage solution

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Image Upload**: ImgBB API
- **Deployment**: Vercel
- **Domain**: Custom subdomain support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- ImgBB account (for image uploads)
- Domain (gooddayrecords.xyz)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GOODDAYALBUMPAGE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Firebase and ImgBB credentials in `.env.local`

4. **Set up Firebase**
   - Create a new Firebase project
   - Enable Firestore Database
   - Enable Storage
   - Add your web app and copy the config
   - Update your `.env.local` with the Firebase config

5. **Set up ImgBB**
   - Sign up at [imgbb.com](https://imgbb.com)
   - Get your API key
   - Add it to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── album/             # Dynamic album pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AlbumCard.tsx      # Album display card
│   └── AlbumForm.tsx      # Album creation form
├── lib/                   # Utility libraries
│   └── firebase.ts        # Firebase configuration
├── types/                 # TypeScript type definitions
│   └── index.ts           # Album and user types
└── public/                # Static assets
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard

2. **Domain Configuration**
   - Add your domain (gooddayrecords.xyz) to Vercel
   - Configure wildcard subdomains (*.gooddayrecords.xyz)
   - Update DNS records as instructed by Vercel

3. **Environment Variables**
   Make sure to add all environment variables in Vercel:
   - Firebase configuration
   - ImgBB API key
   - Domain configuration

### Firebase Setup

1. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /albums/{albumId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

2. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /album-covers/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## Usage

### Creating an Album

1. Visit the homepage
2. Click "Share Album" or "Get Started"
3. Upload an album cover (drag & drop supported)
4. Fill in artist name and album name
5. Choose or generate a subdomain
6. Add streaming service links
7. Click "Create Album Page"

### Viewing Albums

- Each album gets its own page at `{subdomain}.gooddayrecords.xyz`
- Albums are also displayed on the homepage
- Users can share album pages directly

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@gooddayrecords.xyz or create an issue in this repository.

## Roadmap

- [ ] User authentication and profiles
- [ ] Album collections and playlists
- [ ] Social features (likes, comments, sharing)
- [ ] Analytics and insights
- [ ] Mobile app
- [ ] API for third-party integrations 