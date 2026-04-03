/**
 * Sidebar Navigation Component
 * Animated sidebar with user profile, avatars, and smooth transitions
 * - Desktop (lg+): Relative positioning inside layout container
 * - Mobile: Fixed overlay that doesn't push content
 */
import React from 'react'
import { Home, Compass, MessageSquare, FileText, Activity, Users, LogOut, X, UserCircle2, MessageCircle } from 'lucide-react'
import { useAppStore } from '../../context/appStore'

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const { currentUser, logout } = useAppStore()
  const avatarUrl = currentUser?.profileImage || ''

  const items = [
    { label: 'Dashboard', icon: Home, page: 'dashboard' },
    { label: 'Marketplace', icon: Compass, page: 'marketplace' },
    { label: 'Requests', icon: MessageSquare, page: 'requests' },
    { label: 'Messages', icon: MessageCircle, page: 'messages' },
    { label: 'Profile', icon: FileText, page: 'profile' },
  ]

  const adminItems = [
    { label: 'Admin Dashboard', icon: Activity, page: 'admin' },
    { label: 'User Management', icon: Users, page: 'admin-users' },
  ]

  const handleNavigation = (page) => {
    onNavigate(page)
    onClose() // Close mobile sidebar after navigation
  }

  return (
    <>
      {/* Mobile Sidebar - Fixed overlay */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-50 to-white border-r-2 border-slate-300 p-4 overflow-y-auto transition-all duration-300 ease-in-out z-30 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">SkillSwap</h1>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-700" />
          </button>
        </div>

        {/* User Profile Card with Avatar */}
        {currentUser && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg border-2 border-blue-400">
            <div className="flex items-center gap-3 mb-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <span className="w-16 h-16 rounded-full bg-white/20 border-2 border-white inline-flex items-center justify-center" aria-hidden="true">
                  <UserCircle2 size={36} />
                </span>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold">{currentUser.name}</p>
                <p className="text-xs text-blue-100 capitalize">{currentUser.role || 'member'}</p>
              </div>
            </div>
            <div className="text-center text-xs text-blue-100 font-semibold">
              {typeof currentUser.rating === 'number' ? currentUser.rating.toFixed(1) : '0.0'}/5.0 Rating
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-2 mb-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.page)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-slate-800 font-semibold border-2 border-slate-300 hover:border-blue-400 transition-all duration-200 hover:translate-x-1 hover:shadow-md"
              >
                <Icon size={20} className="text-blue-600" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}

          {/* Admin Section */}
          {currentUser?.role === 'admin' && (
            <>
              <div className="border-t-2 border-slate-300 mt-4 pt-4 text-xs text-slate-600 font-bold">ADMIN</div>
              {adminItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.page)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <Icon size={18} className="text-slate-600" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                )
              })}
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 border-2 border-rose-600"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Desktop Sidebar - Relative / inline in layout */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-slate-50 to-white border-r-2 border-slate-300 p-4 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">SkillSwap</h1>
        </div>

        {/* User Profile Card with Avatar */}
        {currentUser && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg border-2 border-blue-400">
            <div className="flex items-center gap-3 mb-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <span className="w-16 h-16 rounded-full bg-white/20 border-2 border-white inline-flex items-center justify-center" aria-hidden="true">
                  <UserCircle2 size={36} />
                </span>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold">{currentUser.name}</p>
                <p className="text-xs text-blue-100 capitalize">{currentUser.role || 'member'}</p>
              </div>
            </div>
            <div className="text-center text-xs text-blue-100 font-semibold">
              {typeof currentUser.rating === 'number' ? currentUser.rating.toFixed(1) : '0.0'}/5.0 Rating
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-2 mb-6 flex-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.page)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-slate-800 font-semibold border-2 border-slate-300 hover:border-blue-400 transition-all duration-200 hover:translate-x-1 hover:shadow-md"
              >
                <Icon size={20} className="text-blue-600" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}

          {/* Admin Section */}
          {currentUser?.role === 'admin' && (
            <>
              <div className="border-t-2 border-slate-300 mt-4 pt-4 text-xs text-slate-600 font-bold">ADMIN</div>
              {adminItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.page)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <Icon size={18} className="text-slate-600" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                )
              })}
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 border-2 border-rose-600 mt-auto"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  )
}

export default Sidebar