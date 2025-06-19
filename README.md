# Vilog - Video Sharing Platform

A modern video sharing platform built with Next.js, featuring secure user authentication, video uploads, and a responsive interface.

## Features

### Video Management
- Upload videos with custom thumbnails
- Personal dashboard for video management
- Delete videos with ownership verification
- Public video gallery accessible to all users

### Authentication & Security
- Multiple authentication providers (Google, GitHub, Email/Password)
- JWT-based sessions with 30-day expiration
- Password hashing with bcrypt
- Input validation and security headers
- Route protection with middleware

### User Interface
- Responsive design for all devices
- Clean, modern interface
- Real-time upload progress tracking
- Intuitive navigation and user experience

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **File Storage**: ImageKit
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+
- MongoDB database
- ImageKit account
- Google/GitHub OAuth credentials (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-poject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # ImageKit
   NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
nextjs-poject/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── components/        # Reusable components
│   ├── dashboard/         # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── profile/          # User profile
├── models/               # MongoDB schemas
├── utils/                # Utility functions
├── middleware.ts         # NextAuth middleware
└── next.config.ts       # Next.js configuration
```

## Configuration

### MongoDB Setup
1. Create a MongoDB database (local or MongoDB Atlas)
2. Update `MONGODB_URI` in your environment variables

### ImageKit Setup
1. Sign up at [ImageKit.io](https://imagekit.io)
2. Get your public key, private key, and URL endpoint
3. Update the ImageKit environment variables

### OAuth Setup
1. **Google OAuth**: Create credentials in Google Cloud Console
2. **GitHub OAuth**: Create OAuth App in GitHub Developer Settings
3. Add appropriate callback URLs for each provider

## Usage

### For Users
1. Browse videos on the homepage
2. Register or login to upload videos
3. Use the dashboard to manage your videos
4. Upload videos with titles, descriptions, and thumbnails
5. Delete your own videos when needed

### For Developers
- API routes are located in `app/api/`
- Database models are in `models/`
- Components are in `app/components/`
- Add new pages in the `app/` directory

## API Endpoints

- `GET /api/video` - Fetch all videos or filter by user email
- `POST /api/video` - Upload a new video (authenticated)
- `DELETE /api/video?id=<videoId>` - Delete a video (authenticated, owner only)
- `GET /api/imageKit-auth` - Get ImageKit authentication tokens

## Security Features

- JWT-based authentication with NextAuth.js
- Password hashing with bcrypt
- Input validation and sanitization
- Security headers (XSS protection, clickjacking prevention)
- Route protection with middleware
- Ownership verification for video operations

## Database Schema

```typescript
// User Model
interface User {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Video Model
interface Video {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  owner: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Production Environment Variables
```env
NEXTAUTH_URL=https://your-domain.com
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=your_production_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check existing issues
2. Create a new issue with detailed information
3. Include error messages and reproduction steps

---

Built with Next.js, NextAuth.js, MongoDB, and ImageKit.
