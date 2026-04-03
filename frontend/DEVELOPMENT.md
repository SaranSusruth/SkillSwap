# Frontend Environment Setup Guide

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Environment Configuration

### Development Server
- **Port**: 5173 (configure in `vite.config.js`)
- **Auto-reload**: Enabled
- **API Proxy**: http://localhost:5000/api (configure in `vite.config.js`)

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

## Development Assets

### Dummy User for Testing
```
Email: demo@college.edu
Password: password
Role: student (can switch to admin for testing)
```

### API Mock Data
All mock data is stored in `src/context/appStore.js` for easy testing without backend.

## Folder Structure Details

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── Layout/           # Layout wrapper components
│   │   ├── SkillCard.jsx     # Skill card display component
│   │   └── SkeletonLoader.jsx# Loading state components
│   ├── pages/
│   │   ├── Dashboard.jsx     # Home/dashboard page
│   │   ├── Marketplace.jsx   # Skill discovery page
│   │   ├── RequestManagement.jsx # Request handling page
│   │   ├── Profile.jsx       # User profile page
│   │   ├── AdminDashboard.jsx# Admin panel page
│   │   └── Login.jsx         # Login/auth page
│   ├── context/
│   │   └── appStore.js       # Zustand store (state management)
│   ├── hooks/
│   │   └── useCustomHooks.js # Custom React hooks
│   ├── utils/
│   │   └── helpers.js        # Utility helper functions
│   ├── styles/
│   │   └── globals.css       # Global styles & Tailwind config
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── README.md                 # Documentation
```

## Code Commenting Standards

All components follow comprehensive JSDoc format:

```javascript
/**
 * ComponentName - Brief description
 * 
 * Detailed explanation of what this component does,
 * how it's used, and any important notes.
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} - Return value description
 */
```

## Responsive Design Breakpoints

```
Mobile:     < 640px
Tablet:     SM  640px - 767px
           MD  768px - 1023px
Desktop:    LG  1024px - 1279px
           XL  1280px - 1535px
           2XL > 1536px
```

## Performance Optimization Tips

1. **Use React.memo** for components that don't change often
2. **Lazy load** components used conditionally
3. **Optimize images** before adding to project
4. **Avoid inline functions** in render methods
5. **Use Zustand** selectors to prevent unnecessary re-renders
6. **Profile with Chrome DevTools** Lighthouse

## Accessibility Checklist

- ✅ Semantic HTML elements
- ✅ ARIA labels for complex components
- ✅ Proper heading hierarchy (h1 → h6)
- ✅ Color contrast ratio 4.5:1 minimum
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Form labels properly associated
- ✅ Alt text for all images

## Common Development Tasks

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route in App.jsx switch statement
4. Add navigation link in Sidebar
5. Test responsiveness

### Adding a New Component

1. Create in `src/components/ComponentName.jsx`
2. Add JSDoc comments
3. Export from component's index file (if using folders)
4. Import and use in pages

### Adding State

1. Add to Zustand store in `src/context/appStore.js`
2. Export hook if creating new store
3. Access state in components with `const { state } = useStore()`

### API Integration

1. Replace mock data in store with API calls
2. Use `useFetch` hook for data fetching
3. Add error handling and loading states
4. Test with browser DevTools network tab

## Debugging

### React Component Issues
- Use React DevTools extension
- Check component tree structure
- Inspect props and state values

### State Management Issues
- Install Zustand DevTools for Redux DevTools compatibility
- Check store actions are being called
- Verify component subscriptions to store

### Styling Issues
- Use Tailwind class intellisense extension
- Inspect CSS in Chrome DevTools
- Check cascade and specificity
- Verify Tailwind config is loaded

### Performance Issues
- Use Chrome Lighthouse
- Profile with React DevTools Profiler
- Check for unnecessary re-renders
- Optimize heavy computations

## Make These Replacements for Backend Integration

In each component marked with `TODO`, replace the mock implementation:

### Authentication
```javascript
// FROM: Mock login
await onLogin({ email, password })

// TO: Real login
const response = await api.post('/auth/login', { email, password })
localStorage.setItem('authToken', response.data.token)
```

### Data Fetching
```javascript
// FROM: Mock data
const mockUser = { id: 'user_1', name: 'John Doe', ... }

// TO: API fetch
const { data: user } = await api.get('/users/me')
```

### Form Submissions
```javascript
// FROM: Console log
console.log('Connecting for skill:', skill.name)

// TO: API call
await api.post('/requests/create', {
  skillOffered: userSkill,
  skillRequested: targetSkill,
  recipientId: targetUser.id
})
```

---

**Next Steps**: Review the components, understand the patterns, and integrate with your backend API!
