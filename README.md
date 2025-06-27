# PharmaCRM - Clean Room Management System

A comprehensive pharmacy clean room management system built with React, Vite, and Supabase.

## Features

- 🏥 **Pharmacy Management** - Manage multiple pharmacy locations and clean room facilities
- 👥 **Client Relationship Management** - Track client information and relationships
- ✅ **Task Management** - Kanban-style task board with priority management
- 💬 **Real-time Comments** - Collaborative commenting system with mentions
- 📁 **File Management** - Document upload and organization
- 📋 **Form Integration** - JotForm integration for inspections and compliance
- 🔔 **Smart Notifications** - Real-time notifications for mentions, assignments, and updates
- 🌙 **Dark Mode** - Complete dark/light theme support
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## Authentication Methods

### 🔐 Multiple Sign-in Options:

1. **Google OAuth** - One-click sign-in with Google account
2. **Email/Password** - Traditional email and password authentication
3. **Demo Accounts** - Pre-configured demo users for testing

### Demo Credentials:
- **Admin**: admin@pharmacy.com / admin123
- **Technician**: tech@pharmacy.com / tech123

## Google OAuth Setup

To enable Google OAuth authentication, you need to configure it in your Supabase project:

### 1. Google Cloud Console Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add your authorized redirect URIs:
   - `https://bvxkpspovcnufyffeppc.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (for development)

### 2. Supabase Configuration:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console

### 3. Environment Setup:

The app is already configured to work with Google OAuth. The redirect URLs are set to:
- Production: Your domain + `/#/dashboard`
- Development: `http://localhost:5173/#/dashboard`

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-management-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth + Email/Password)
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## Authentication Flow

### Google OAuth Flow:
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to app with auth code
5. Supabase exchanges code for session
6. User is automatically signed in and redirected to dashboard

### Email/Password Flow:
1. User enters email and password
2. Supabase validates credentials
3. Session is created and stored
4. User is redirected to dashboard

### Demo Account Flow:
1. User enters demo credentials
2. Local authentication with fallback
3. Demo user session is created
4. User is redirected to dashboard

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Comments/       # Comment system components
│   ├── Files/          # File management components
│   ├── Forms/          # Form components
│   ├── Kanban/         # Task board components
│   ├── Layout/         # Layout components
│   ├── Modals/         # Modal dialogs
│   └── Notifications/  # Notification components
├── contexts/           # React Context providers
├── lib/               # Third-party library configurations
├── pages/             # Main application pages
├── services/          # API and business logic
└── common/            # Common utilities and components
```

## Key Features Explained

### 🔐 **Multi-Provider Authentication**
- Seamless Google OAuth integration
- Fallback email/password authentication
- Demo accounts for testing
- Automatic session management
- Secure token handling

### 📱 **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized for both desktop and mobile workflows

### 🎨 **Modern UI/UX**
- Clean, professional design
- Smooth animations and transitions
- Intuitive navigation
- Consistent design system
- Dark/light theme support

### 🔔 **Smart Notifications**
- Real-time mention notifications
- Task assignment alerts
- Comment notifications
- Cross-navigation from notifications
- Persistent notification history

### 📊 **Task Management**
- Kanban board visualization
- Drag-and-drop task organization
- Priority-based sorting
- Task filtering and searching
- Real-time collaboration

## Development

### Available Scripts:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Build Configuration:

The app uses Vite for fast development and optimized production builds:
- Hot Module Replacement (HMR)
- Optimized bundling
- Asset optimization
- Source maps for debugging

## Security

- **Authentication**: Secure OAuth flow with PKCE
- **Session Management**: Automatic token refresh
- **Data Protection**: Row Level Security (RLS) in Supabase
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.