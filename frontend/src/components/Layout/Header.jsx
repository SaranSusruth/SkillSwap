/**
 * Header/Navbar Component
 * Simple, plain header
 */
import React, { useState } from 'react'
import { Menu, Search, Bell, ChevronDown, UserCircle2 } from 'lucide-react'
import { useAppStore } from '../../context/appStore'
import BrandLogo from '../BrandLogo'

const Header = ({ onMenuClick, onNavigate }) => {
  const { currentUser, logout, searchSkills, notifications, removeNotification, uploadProfileImage } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const avatarUrl = currentUser?.profileImage || ''

  const onSearch = () => {
    if (!searchQuery.trim()) return
    searchSkills(searchQuery)
    onNavigate && onNavigate('marketplace')
  }

  const clearAllNotifications = () => {
    ;(notifications || []).forEach((note) => removeNotification(note.id))
  }

  const handleProfileNavigate = () => {
    setShowUserMenu(false)
    onNavigate('profile')
  }

  const handleSettingsNavigate = () => {
    setShowUserMenu(false)
    onNavigate('settings')
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    onNavigate('login')
  }

  const handleUploadPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      setUploadingPhoto(true)
      await uploadProfileImage(file)
      addNotification({ title: 'Photo updated', message: 'Your profile photo has been updated.' })
      setShowUserMenu(false)
    } catch (error) {
      addNotification({
        title: 'Upload failed',
        message: error.response?.data?.error || 'Unable to upload profile photo.',
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="p-2 rounded-md hover:bg-slate-200 font-bold" title="Open menu">
            <Menu size={24} className="text-slate-800" />
          </button>
          <BrandLogo showTagline={false} textSize="text-sm" />
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <Search size={16} />
            <input
              type="text"
              className="bg-transparent outline-none text-sm"
              placeholder="Search people by skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              aria-label="Search people by skill"
            />
            <button
              onClick={onSearch}
              className="text-xs text-blue-600 font-semibold hover:underline"
              type="button"
            >
              Go
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-md hover:bg-slate-100"
              title="Notifications"
            >
              <Bell size={20} />
              {notifications?.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">Notifications</span>
                  {notifications && notifications.length > 0 ? (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>
                {notifications && notifications.length > 0 ? (
                  <ul className="max-h-52 overflow-y-auto">
                    {notifications.map((note) => (
                      <li key={note.id} className="px-3 py-2 border-b border-slate-100">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{note.title}</p>
                            <p className="text-xs text-slate-600">{note.message}</p>
                          </div>
                          <button
                            onClick={() => removeNotification(note.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-sm text-slate-500">No notifications</div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 inline-flex items-center justify-center" aria-hidden="true">
                  <UserCircle2 size={20} />
                </span>
              )}
              <span className="text-sm font-medium text-slate-700">{currentUser?.name || 'Guest'}</span>
              <ChevronDown size={14} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                <label className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer block">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} disabled={uploadingPhoto} />
                </label>
                <button
                  onClick={handleProfileNavigate}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleSettingsNavigate}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
