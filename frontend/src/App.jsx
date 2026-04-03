/**
 * Main App Component
 */
import React, { useState, useEffect } from 'react'
import { useAppStore } from './context/appStore'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import RequestManagement from './pages/RequestManagement'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Settings from './pages/Settings.jsx'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  const { currentUser, isAuthenticated, authInitialized, login, signup, sendSignupVerificationCode, verifySignupEmailCode, initializeAuth, loadSkills, loadRequests } = useAppStore()
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isAuthenticated) {
      loadSkills()
      loadRequests()
    }
  }, [isAuthenticated, loadSkills, loadRequests])

  useEffect(() => {
    if (!isAuthenticated) return

    if (currentUser?.role === 'admin') {
      setCurrentPage('admin')
      return
    }

    if (currentPage === 'admin') {
      setCurrentPage('dashboard')
    }
  }, [currentUser, isAuthenticated, currentPage])

  const renderPage = () => {
    if (!authInitialized) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <p className="text-slate-600 text-sm font-semibold">Restoring your session...</p>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (currentPage === 'signup') {
        return (
          <Signup
            onSignup={signup}
            onSendVerificationCode={sendSignupVerificationCode}
            onVerifyEmailCode={verifySignupEmailCode}
            onPageChange={setCurrentPage}
          />
        )
      }
      return <Login onLogin={login} onPageChange={setCurrentPage} />
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'marketplace':
        return <Marketplace onNavigate={setCurrentPage} />
      case 'requests':
        return <RequestManagement onNavigate={setCurrentPage} />
      case 'messages':
        return <Messages onNavigate={setCurrentPage} />
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />
      case 'admin':
        return currentUser?.role === 'admin' ? <AdminDashboard onNavigate={setCurrentPage} /> : <Dashboard onNavigate={setCurrentPage} />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {renderPage()}
    </div>
  )
}

export default App
