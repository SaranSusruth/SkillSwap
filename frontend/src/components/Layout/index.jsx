/**
 * Main Layout Component
 * Wraps the entire application with collapsible sidebar, header, and layout structure
 * - Desktop: Sidebar toggles visible/hidden with content shifting
 * - Mobile: Sidebar slides in as overlay without pushing content
 */
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default open on desktop

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Fixed position container */}
      <div className={`hidden lg:block transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} onNavigate={onNavigate} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:flex-1">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={onNavigate}
        />

        {/* Mobile Sidebar Overlay - Only visible on mobile when open */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300"
          />
        )}

        {/* Mobile Sidebar - Overlays content on mobile */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={onNavigate} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
