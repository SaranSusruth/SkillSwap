/**
 * Sidebar Navigation Component
 * Simple static menu for first-version design
 */
import React from 'react'
import { Home, Compass, MessageSquare, BookOpen, FileText, Activity, Users, Settings, LogOut } from 'lucide-react'
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
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Skill Swap</h2>
          <p className="text-xs text-slate-500">Campus learning</p>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 rounded hover:bg-slate-100">�</button>
      </div>

      {currentUser && (
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm font-semibold text-slate-700">{currentUser.name}</p>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
        </div>
      )}

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-slate-800 font-semibold border border-slate-200 hover:border-blue-400 transition-colors">
              <Icon size={20} className="text-blue-600" />
              <span className="text-sm">{item.label}</span>
            </a>
          )
        })}
        {currentUser?.role === 'admin' && (
          <>
            <div className="border-t border-slate-200 mt-3 pt-3 text-xs text-slate-500">Admin</div>
            {adminItems.map((item) => {
              const Icon = item.icon
              return (
                <a key={item.label} href={item.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-slate-700">
                  <Icon size={16} />
                  {item.label}
                </a>
              )
            })}
          </>
        )}
      </nav>

      <button onClick={logout} className="w-full mt-6 px-3 py-2 rounded bg-rose-500 text-white hover:bg-rose-600">
        <LogOut size={16} className="inline-block mr-2" />
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
