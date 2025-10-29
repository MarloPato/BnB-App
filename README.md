# BnB Management Application

A full-stack TypeScript application for managing BnB properties and bookings, built with Next.js, Hono, and Supabase.

## Features

### Backend (Hono + TypeScript)

- **Authentication**: Cookie-based authentication with Supabase Auth
- **Property Management**: Full CRUD operations for BnB properties
- **Booking System**: Automatic price calculation and conflict detection
- **Role-based Access**: Admin and property owner permissions
- **Strict TypeScript**: No `any` types, fully typed API

### Frontend (Next.js + TypeScript)

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Login/register with form validation
- **Property Management**: Create, view, edit, and delete properties
- **Booking Management**: View and manage reservations
- **Real-time Updates**: Automatic price calculation and availability checking

## Tech Stack

### Backend

- **Hono**: Fast, lightweight web framework
- **TypeScript**: Strict typing throughout
- **Supabase**: Database and authentication
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe frontend development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Axios**: HTTP client
- **Lucide React**: Icon library

## Project Structure

```
Bnb-app/
├── backend/                 # Hono API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # API client and utilities
│   │   └── types/         # TypeScript type definitions
│   ├── package.json
│   └── next.config.js
├── database/              # Database schema and migrations
│   └── schema.sql         # Supabase database schema
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Note your Supabase URL and anon key

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
JWT_SECRET=your_jwt_secret_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property (owner/admin)
- `DELETE /api/properties/:id` - Delete property (owner/admin)

### Bookings

- `GET /api/bookings` - Get user's bookings (authenticated)
- `GET /api/bookings/:id` - Get booking by ID (authenticated)
- `POST /api/bookings` - Create booking (authenticated)
- `PUT /api/bookings/:id` - Update booking (owner)
- `DELETE /api/bookings/:id` - Cancel booking (owner)

## Database Schema

### Users

- `id` (UUID, Primary Key)
- `name` (TEXT)
- `email` (TEXT, Unique)
- `isAdmin` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Properties

- `id` (UUID, Primary Key)
- `name` (TEXT)
- `description` (TEXT)
- `location` (TEXT)
- `pricePerNight` (DECIMAL)
- `availability` (BOOLEAN)
- `user_id` (UUID, Foreign Key)
- `created_at`, `updated_at` (TIMESTAMP)

### Bookings

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `property_id` (UUID, Foreign Key)
- `checkInDate` (DATE)
- `checkOutDate` (DATE)
- `totalPrice` (DECIMAL, Auto-calculated)
- `created_at`, `updated_at` (TIMESTAMP)

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Cross-origin request handling

## Development

### Backend Development

```bash
cd backend
npm run dev    # Start with hot reload
npm run build  # Build for production
npm start      # Start production build
```

### Frontend Development

```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
```

## Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Deploy to your preferred platform (Vercel, Railway, etc.)
3. Set environment variables in your deployment platform

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables

### Database Deployment

- Use Supabase's built-in deployment
- Run the schema.sql in your Supabase project

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
