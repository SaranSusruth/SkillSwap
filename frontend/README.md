# Skill Swap Hub Frontend - React.js Application

> A modern, high-performance React.js frontend for The Skill Swap Hub - Campus Peer Learning Platform

## 📋 Project Overview

This is a **portfolio-grade React.js frontend** built with modern web technologies following industry best practices. The application enables students to exchange skills through a structured peer-to-peer learning platform.

### Key Features

✨ **Elite Dashboard** - Centralized learning hub with active exchanges, pending requests, and skill match feed

🔍 **Discovery Engine** - Searchable marketplace with filtering by category, competency level, and real-time search

👥 **Profile System** - Visual user profiles with skills offered/desired, competency ratings, and achievement badges

📬 **Request Management** - Dual-pane interface for managing incoming and outgoing skill exchange requests

🛡️ **Admin Dashboard** - High-level monitoring of platform activity, user management, and system health

## 🛠 Tech Stack

- **Framework**: React.js 18.2.0
- **Build Tool**: Vite 4.3.0 (Ultra-fast development server)
- **Styling**: Tailwind CSS 3.3.2 (Utility-first CSS)
- **State Management**: Zustand 4.4.0 (Lightweight state store)
- **Animations**: Framer Motion 10.16.4 (Smooth micro-interactions)
- **Icons**: Lucide React 0.263.1 (Beautiful SVG icons)
- **HTTP Client**: Axios 1.4.0 (API requests)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   └── index.jsx            # Main layout wrapper
│   │   ├── SkillCard.jsx            # Premium skill card component
│   │   └── SkeletonLoader.jsx       # Loading placeholders
│   ├── pages/
│   │   ├── Dashboard.jsx            # Main learning hub
│   │   ├── Marketplace.jsx          # Skill discovery
│   │   ├── RequestManagement.jsx    # Request handling
│   │   ├── Profile.jsx              # User profile
│   │   ├── AdminDashboard.jsx       # Admin interface
│   │   └── Login.jsx                # Authentication
│   ├── context/
│   │   └── appStore.js              # Zustand state store
│   ├── hooks/
│   │   └── useCustomHooks.js        # Reusable hooks
│   ├── utils/
│   │   └── helpers.js               # Utility functions
│   ├── styles/
│   │   └── globals.css              # Global styles & Tailwind directives
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # React entry point
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔑 Demo Credentials

```
Email: demo@college.edu
Password: password
```

## 🎨 Design System

### Color Palette (Modern Academic Theme)

```
Primary (Deep Indigo):    #6366f1 → #312e81
Slate (Gray):            #64748b → #0f172a
Accents:
  - Cyan:   #06b6d4
  - Rose:   #f43f5e
  - Violet: #a855f7
  - Emerald: #10b981
```

### Key Design Features

- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Framer Motion micro-interactions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance (focus states, proper contrast)
- **Light/Dark Awareness**: CSS that adapts to system preferences

## 📱 Page Components

### Dashboard (`src/pages/Dashboard.jsx`)
- Active learning sessions with progress tracking
- Pending request notifications
- Recommended skills based on learning profile
- At-a-glance statistics and KPIs

### Marketplace (`src/pages/Marketplace.jsx`)
- Searchable skill grid with real-time filtering
- Category and competency level filters
- Skill cards with instructor info and ratings
- "Connect for Exchange" action buttons

### Request Management (`src/pages/RequestManagement.jsx`)
- **Dual-pane interface**: List view + detail view
- Incoming requests with accept/decline actions
- Outgoing requests with status tracking
- Request filtering by status (pending, accepted, completed)

### Profile (`src/pages/Profile.jsx`)
- Visual user profile card
- Skills offered vs. desired with tags
- Achievement badges system
- User reviews and ratings

### Admin Dashboard (`src/pages/AdminDashboard.jsx`)
- Platform statistics and health metrics
- User management table
- System alerts and bandwidth monitoring
- User status management

## 🔌 API Integration Points

All API integration points are marked with `TODO` comments. Replace with your backend endpoints:

```javascript
// Example: Login API
// POST /api/auth/login
// GET /api/dashboard/stats
// GET /api/skills/marketplace
// POST /api/requests/create
// PUT /api/requests/:id/accept
```

### Axios Setup (To be implemented)
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

## 🎯 State Management with Zustand

The application uses Zustand for lightweight, scalable state management:

```javascript
import { useAppStore } from './context/appStore'

// In any component:
const { currentUser, activeSessions, login } = useAppStore()
```

### Store Structure
- **Auth State**: currentUser, isAuthenticated, login/logout
- **Skills State**: allSkills, filteredSkills, searchSkills, filterSkills
- **Requests State**: requestsSent, requestsReceived, acceptRequest, rejectRequest
- **Sessions State**: activeSessions, completedSessions, createSession
- **Admin State**: users, platformStats (separate `useAdminStore`)

## 🎬 Animation & Transitions

Framer Motion provides smooth animations:

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

## 📦 Component Library

### Custom Components

- **`SkillCard.jsx`** - Premium SaaS-style card with hover effects
- **`SkeletonLoader.jsx`** - Loading placeholders for async data
- **`Layout/`** - Sidebar, Header, and main layout wrapper

### Tailwind CSS Classes

Custom Tailwind components in `src/styles/globals.css`:

```tailwind
.glass          /* Glassmorphism effect */
.card           /* Card styling */
.btn-primary    /* Primary button */
.badge          /* Status badges */
.skeleton       /* Shimmer loader */
```

## 🔍 Best Practices Implemented

✅ **Component Architecture**
- Modular, single-responsibility components
- Proper prop passing and composition
- Separation of concerns (pages, components, hooks)

✅ **Performance**
- Code splitting with Vite
- Lazy loading components (to implement)
- Memoization where needed
- Efficient re-renders with React.memo

✅ **Code Quality**
- Comprehensive JSDoc comments
- Consistent naming conventions
- Error handling and fallbacks
- Loading states and skeletons

✅ **Accessibility**
- Semantic HTML elements
- ARIA labels where needed
- Focus management
- Keyboard navigation support

✅ **Responsiveness**
- Mobile-first design
- Breakpoint system (sm, md, lg)
- Touch-friendly interactive elements
- Adaptive layouts

## 🐛 Debugging & Development

### Browser DevTools
- React DevTools extension for component inspection
- Zustand DevTools for state debugging
- Network tab for API monitoring

### Common Issues & Solutions

**Styles not loading?**
```bash
# Rebuild Tailwind cache
rm -rf node_modules/.vite
npm run dev
```

**Port already in use?**
```bash
# Change port in vite.config.js or:
npm run dev -- --port 3000
```

**State not updating?**
- Check Zustand store subscriptions
- Verify component is using correct store hook
- Check for accidental mutations

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Examples](https://www.framer.com/motion)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🎓 Portfolio Highlights

This codebase demonstrates:

### Frontend Engineering Excellence
✨ Modern React patterns with hooks and functional components
✨ Advanced state management without Redux boilerplate
✨ Sophisticated UI animations and micro-interactions
✨ Mobile-responsive design principles
✨ Comprehensive error handling and loading states

### Design Proficiency
✨ "Modern Academic" design system implementation
✨ Color psychology and visual hierarchy
✨ Glassmorphic components with blur effects
✨ Accessibility-first approach (WCAG compliance)
✨ Professional typography and spacing

### Code Quality
✨ Clean, self-documenting code with comments
✨ Industry-standard folder structure
✨ Reusable hooks and utility functions
✨ Separation of concerns and DRY principles
✨ Production-ready error boundaries

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### Environment Variables
Create `.env.local`:
```
VITE_API_BASE_URL=https://api.skillswap.edu
VITE_AUTH_TOKEN=your_token_here
```

## 📞 Support & Contribution

For issues, feature requests, or improvements:
1. Check existing documentation
2. Review the TODO comments in code
3. Follow the established code patterns
4. Test thoroughly before committing

---

**Built with ❤️ for The Skill Swap Hub - Campus Peer Learning Platform**

*B.Tech Project | Modern Academic Design Philosophy | Production-Ready Code*
