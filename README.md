# Good Day Records - Album Sharing Platform

A modern web application for creating beautiful album pages with custom subdomains. Built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Custom Subdomains**: Each album gets its own subdomain (e.g., `artist-album.gooddayrecords.xyz`)
- **Image Upload**: Drag and drop album covers with automatic image hosting via ImgBB
- **Streaming Links**: Add links to Spotify, Apple Music, YouTube, and more
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Real-time Updates**: Instant subdomain availability checking

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Image Storage**: ImgBB API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- ImgBB API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JulianMcG/goodday-records.git
cd goodday-records
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Fill in your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ImgBB API Key (for image uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Domain Configuration
NEXT_PUBLIC_DOMAIN=gooddayrecords.xyz
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── album/             # Album page routes
│   │   └── [subdomain]/   # Dynamic album pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Home page (album creation form)
├── components/            # React components
│   ├── AlbumCard.tsx      # Album display component
│   └── AlbumForm.tsx      # Album creation form
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   └── firebase-services.ts # Firebase service functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Album and form types
├── public/                # Static assets
└── vercel.json           # Vercel deployment configuration
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
- `NEXT_PUBLIC_IMGBB_API_KEY`: Your ImgBB API key
- `NEXT_PUBLIC_DOMAIN`: Your domain (e.g., gooddayrecords.xyz)

## Usage

1. **Create an Album Page**:
   - Visit the main page
   - Upload an album cover
   - Enter artist and album names
   - Choose a subdomain
   - Add streaming service links
   - Submit to create your album page

2. **Share Your Album**:
   - Your album will be available at `[subdomain].gooddayrecords.xyz`
   - Share this URL with your audience
   - Viewers can access all your streaming links in one place

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This is a deployment test - the app structure has been updated to show the album creation form on the main page. 