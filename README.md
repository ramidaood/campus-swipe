# Campus Swipe 🏠

A modern, mobile-first apartment discovery app designed specifically for students in Haifa, Israel. Campus Swipe helps students find their perfect accommodation near university campuses through an intuitive swipe interface and comprehensive listing features.

## 🚀 Features

### Core Functionality
- **Swipe Interface**: Tinder-like swiping experience for apartment discovery
- **Map View**: Interactive map showing apartment locations and nearby universities
- **Favorites System**: Save and manage liked apartments
- **Detailed Listings**: Comprehensive apartment details with photo galleries
- **Add Listings**: Submit new apartment listings with photos and details

### Key Features
- **Mobile-First Design**: Optimized for mobile devices with responsive UI
- **Real-time Search**: Filter apartments by location and keywords
- **Photo Galleries**: Multiple image support with carousel navigation
- **Location Services**: Map integration for apartment locations
- **University Proximity**: Focus on apartments near major universities in Haifa

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Reliable database
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 App Structure

### Pages
- **Home** (`/`) - Main dashboard with map/list view and search
- **Swipe** (`/swipe`) - Tinder-like apartment discovery interface
- **Favorites** (`/favorites`) - Saved apartments management
- **Apartment Detail** (`/apartment/:id`) - Detailed apartment view
- **Add Listing** (`/add`) - Submit new apartment listings

### Components
- **BottomNavigation** - Mobile navigation bar
- **UI Components** - Reusable shadcn/ui components
- **Data Layer** - Demo data and Supabase integration

## 🏗️ Project Structure

```
campus-swipe/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── BottomNavigation.tsx
│   ├── pages/              # Main application pages
│   │   ├── Home.tsx        # Dashboard with map/list view
│   │   ├── Swipe.tsx       # Swipe interface
│   │   ├── Favorites.tsx   # Saved apartments
│   │   ├── ApartmentDetail.tsx # Detailed view
│   │   └── AddListing.tsx  # New listing form
│   ├── data/               # Data layer
│   │   └── demoData.ts     # Demo apartment data
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client and types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── App.tsx             # Main app component
├── supabase/               # Supabase configuration
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd campus-swipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🗄️ Database Schema

The app uses Supabase with the following data structure:

### Apartments Table
```typescript
interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  room_type: string;
  address: string;
  lat: number;
  lng: number;
  image_urls: string[];
  created_by: string;
  created_at: string;
}
```

### Universities/Institutions
```typescript
interface Institution {
  name: string;
  lat: number;
  lng: number;
  type: string;
}
```

## 🎨 Design System

The app uses a consistent design system with:
- **Color Scheme**: Tailwind CSS with dark/light mode support
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable shadcn/ui components
- **Icons**: Lucide React icon set

## 📱 Mobile-First Features

- **Bottom Navigation**: Easy thumb navigation
- **Swipe Gestures**: Intuitive apartment discovery
- **Touch-Friendly**: Large touch targets and proper spacing
- **Responsive Design**: Works on all screen sizes
- **Progressive Web App**: Can be installed on mobile devices

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

### State Management
- React hooks for local state
- TanStack Query for server state
- React Router for navigation state

### Testing
- Component testing with React Testing Library
- Integration testing for user flows
- E2E testing with Playwright (planned)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure build settings
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for students in Haifa**
