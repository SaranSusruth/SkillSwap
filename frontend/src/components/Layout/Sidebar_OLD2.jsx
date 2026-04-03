/**
 * Sidebar Navigation Component
 * Animated sidebar with user profile, avatars, and smooth transitions
 */
import React from 'react'
import { Home, Compass, MessageSquare, BookOpen, FileText, Activity, Users, Settings, LogOut, X, UserCircle2 } from 'lucide-react'
import { useAppStore } from '../../context/appStore'

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAppStore()

  const items = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Marketplace', icon: Compass, href: '/marketplace' },
    { label: 'Requests', icon: MessageSquare, href: '/requests' },
    { label: 'My Sessions', icon: BookOpen, href: '/sessions' },
    { label: 'Profile', icon: FileText, href: '/profile' },
  ]

  const adminItems = [
    { label: 'Admin Dashboard', icon: Activity, href: '/admin' },
    { label: 'User Management', icon: Users, href: '/admin/users' },
  ]

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-50 to-white border-r-2 border-slate-300 p-4 overflow-y-auto transition-all duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Skill Swap</h2>
            <p className="text-xs text-slate-600 font-semibold">Campus learning</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-700" />
          </button>
        </div>

        {/* User Profile Card with Avatar */}
        {currentUser && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg border-2 border-blue-400">
            <div className="flex items-center gap-3 mb-3">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-3 border-white object-cover"
                />
              ) : (
                <span className="w-16 h-16 rounded-full border-3 border-white bg-white/20 inline-flex items-center justify-center" aria-hidden="true">
                  <UserCircle2 size={30} />
                </span>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold">{currentUser.name}</p>
                <p className="text-xs text-blue-100">{currentUser.department}</p>
              </div>
            </div>
            <div className="text-center text-xs text-blue-100 font-semibold">
              ⭐ {currentUser.ratings || 4.5}/5.0 Rating
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-2 mb-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <a 
                key={item.label} 
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-slate-800 font-semibold border-2 border-slate-300 hover:border-blue-400 transition-all duration-200 hover:translate-x-1 hover:shadow-md"
              >
                <Icon size={20} className="text-blue-600" />
                <span className="text-sm">{item.label}</span>
              </a>
            )
          })}

          {/* Admin Section */}
          {currentUser?.role === 'admin' && (
            <>
              <div className="border-t-2 border-slate-300 mt-4 pt-4 text-xs text-slate-600 font-bold">ADMIN</div>
              {adminItems.map((item) => {
                const Icon = item.icon
                return (
                  <a 
                    key={item.label} 
                    href={item.href} 
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <Icon size={18} className="text-slate-600" />
                    <span className="text-sm">{item.label}</span>
                  </a>
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
    </>
  )
}

export default Sidebar
