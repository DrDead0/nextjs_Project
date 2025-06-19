# Vilog

Vilog is a modern video uploading and vlogging platform built with Next.js. Users can register, log in, upload videos, view their dashboard, and manage their profile.

## Features
- User authentication (NextAuth)
- Video upload and management
- User dashboard and profile
- Responsive and modern UI

## Getting Started

## 🚀 Features

- **🔐 Authentication System**
  - Email/password authentication with NextAuth.js
  - Secure password hashing with bcrypt
  - JWT-based sessions
  - Protected routes

- **🗄️ Database Integration**
  - MongoDB with Mongoose ODM
  - TypeScript interfaces for type safety
  - Automatic timestamps
  - User model with validation

- **⚡ Modern Tech Stack**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - ESLint for code quality

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git for version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-poject
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Optional: For additional providers
   # GITHUB_ID=your_github_client_id
   # GITHUB_SECRET=your_github_client_secret
   # GOOGLE_CLIENT_ID=your_google_client_id
   # GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nextjs-poject/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── models/                # Database models
│   ├── user.ts           # User schema and interface
│   └── video.ts          # Video model (if applicable)
├── utils/                 # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── db.ts             # Database connection
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Database Setup

The project uses MongoDB with Mongoose. The User model includes:

- Email (unique, required)
- Password (hashed, required)
- Automatic timestamps (createdAt, updatedAt)

### Authentication Setup

NextAuth.js is configured with:

- Credentials provider for email/password login
- JWT strategy for sessions
- Custom login page at `/login`
- 30-day session duration
- Password hashing with bcrypt

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Secure session management with JWT
- **Input Validation**: TypeScript interfaces ensure type safety
- **Environment Variables**: Sensitive data stored in environment variables

## 📝 API Endpoints

The authentication system provides:

- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get current session
- `/api/auth/csrf` - CSRF protection

## 🎯 Usage Examples

### Creating a User
```typescript
import User from '@/models/user';

const newUser = new User({
  email: 'user@example.com',
  password: 'securepassword123'
});

await newUser.save();
```

### Protecting Routes
```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/auth';

const session = await getServerSession(authOptions);
if (!session) {
  redirect('/login');
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the [NextAuth.js documentation](https://next-auth.js.org)
3. Open an issue in the repository

## 🔮 Future Enhancements

- [ ] Add social login providers (Google, GitHub, Twitter)
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Create user profile management
- [ ] Add role-based access control
- [ ] Implement rate limiting
- [ ] Add comprehensive testing

---

**Built with ❤️ using Next.js, NextAuth.js, and MongoDB**
