# ⚡ Quick Start Checklist

## 🎯 Before You Start

- [ ] Ensure Node.js 16+ is installed (`node --version`)
- [ ] Navigate to `d:\Btech\Skill_Swap\frontend` directory
- [ ] Ensure all dependencies will be installed

## 🚀 5-Minute Setup

### 1. Install Dependencies (2 min)
```bash
npm install
```

### 2. Start Development Server (1 min)
```bash
npm run dev
```
App opens at `http://localhost:5173` ✅

### 3. Login with Demo Account (1 min)
```
Email: demo@college.edu
Password: password
```

### 4. Explore the Application (1 min)
- Click "Dashboard" in sidebar
- Try searching in Marketplace
- Check Request Management
- View Profile page
- Try Admin Dashboard (if admin role)

## 📋 Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint

# Cleanup
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies
```

## 🎨 Test the Design

### Dark Theme Area
- Look for gradient headers (Deep Indigo → Cyan)
- Notice glassmorphism effects on cards
- Hover over cards to see animations

### Responsive Design
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1440x900)

### Interactions
- Hover over buttons (smooth color transition)
- Click search bar (animated border glow)
- Expand notification dropdown
- Navigate between tabs

## 📂 Key Files to Review

### Understanding the Codebase
1. **`src/App.jsx`** - Main app component (routing logic)
2. **`src/context/appStore.js`** - State management (all mock data)
3. **`src/pages/Dashboard.jsx`** - Dashboard implementation (best example)
4. **`src/components/Layout/index.jsx`** - Layout structure
5. **`src/styles/globals.css`** - Custom Tailwind components

### Important Configurations
- **`vite.config.js`** - API proxy & build settings
- **`tailwind.config.js`** - Theme colors & tokens
- **`package.json`** - Dependencies & scripts

## 🔗 Backend Integration Checklist

### When Ready to Connect Backend

- [ ] Update API base URL in `.env.local`
- [ ] Replace mock data in `src/context/appStore.js`
- [ ] Implement API calls in `src/utils/api.js`
- [ ] Add error notifications
- [ ] Test each endpoint
- [ ] Setup token refresh

### API Endpoints to Implement
See `API_INTEGRATION.md` for complete list:
- Authentication (login, signup, logout)
- Skills (create, search, filter)
- Requests (send, accept, reject)
- Sessions (create, complete, review)
- Users (profile, ratings, reviews)

## 🐛 Troubleshooting

### "Port 5173 already in use"
```bash
# Option 1: Kill the process
# On Windows: netstat -aon | findstr :5173
# On Mac/Linux: lsof -i :5173 | kill -9

# Option 2: Use different port
npm run dev -- --port 3000
```

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styling not loading
```bash
# Restart dev server
npm run dev

# Clear browser cache (Ctrl+Shift+Delete)
```

### State not updating
- Check React DevTools for state changes
- Verify component is using correct hook
- Check Zustand store in browser console

## 📱 Device Testing

### Mobile (Tablet)
1. Dev Tools → Resize to 768px width
2. Check sidebar collapse
3. Test touch interactions

### Desktop
1. Test at 1440px and above
2. Check multi-column layouts
3. Test all hover effects

## ✅ Feature Testing Checklist

### Dashboard Page
- [ ] Stats cards display correctly
- [ ] Active sessions show progress bar
- [ ] Pending requests list appears
- [ ] Recommended skills grid loads
- [ ] Skeleton loaders appear briefly

### Marketplace Page
- [ ] Skill cards display in grid
- [ ] Search works in real-time
- [ ] Category filters work
- [ ] Competency filters work
- [ ] Connect buttons are interactive

### Request Management
- [ ] Incoming and Outgoing tabs switch
- [ ] Request list shows correctly
- [ ] Detail view appears on click
- [ ] Accept/Reject buttons work
- [ ] Status badges display correctly

### Profile Page
- [ ] Profile information displays
- [ ] Skills offered/desired visible
- [ ] Achievement badges show
- [ ] Reviews section loads
- [ ] Edit button is clickable

### Admin Dashboard
- [ ] Stats cards show numbers
- [ ] User table displays data
- [ ] Search filters users
- [ ] Status indicators visible
- [ ] Action buttons present

## 🎓 Learning Path

### Beginner (understand structure)
1. Read `README.md`
2. Explore `src/App.jsx`
3. Look at `Dashboard.jsx`
4. Review `appStore.js`

### Intermediate (understand patterns)
1. Study layout components
2. Analyze state management
3. Review animations in components
4. Check API service structure

### Advanced (modify and extend)
1. Add new pages
2. Modify state management
3. Implement new API endpoints
4. Create custom components

## 🎉 Success Indicators

You'll know everything is working when:
✅ Development server starts without errors
✅ App loads at http://localhost:5173
✅ Dashboard displays with all sections
✅ Marketplace shows skill cards
✅ Sidebar navigation works
✅ Responsive design adapts on resize
✅ Animations are smooth and responsive
✅ No console errors in DevTools

---

## 📞 Next Steps

1. **Explore**: Spend 10 minutes testing all features
2. **Read**: Review `README.md` for architecture details
3. **Understand**: Study `src/context/appStore.js` for state
4. **Integrate**: Connect to backend API using `src/utils/api.js`
5. **Deploy**: Build with `npm run build` when ready

**Questions? Check the documentation files:**
- `README.md` - Comprehensive documentation
- `DEVELOPMENT.md` - Development guide
- `API_INTEGRATION.md` - Backend integration
- `PROJECT_SUMMARY.md` - Complete project overview

---

**Ready to launch?** Run `npm install && npm run dev` 🚀
