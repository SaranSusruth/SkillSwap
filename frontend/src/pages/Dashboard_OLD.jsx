/**
 * Dashboard Page Component
 * Minimal first-version dashboard with clear layout
 */
import React from 'react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Dashboard = () => {
  const { currentUser, activeSessions, requestsReceived, allSkills } = useAppStore()

  const pendingRequests = requestsReceived.filter((req) => req.status === 'pending')

  return (
    <Layout>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {currentUser?.name || 'Learner'}!</h1>
            <p className="text-slate-600 mt-2">Your activity summary at a glance.</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Active sessions</h2>
              <p className="text-3xl font-bold text-slate-800">{activeSessions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Pending requests</h2>
              <p className="text-3xl font-bold text-slate-800">{pendingRequests.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Skills offered</h2>
              <p className="text-3xl font-bold text-slate-800">{currentUser?.skillsOffered?.length || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Rating</h2>
              <p className="text-3xl font-bold text-slate-800">{(currentUser?.ratings || 0).toFixed(1)}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">⏳ Pending Requests</h3>
              {pendingRequests.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {pendingRequests.map((req) => (
                    <li key={req.id} className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <p className="text-sm font-bold text-slate-900">{req.sender.name} wants {req.skillOffered}</p>
                      <p className="text-sm text-slate-700 mt-1">In exchange for: <strong>{req.skillRequested}</strong></p>
                      <p className="text-xs text-slate-600 italic mt-2">Message: "{req.message}"</p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-sm">
                          ✓ Accept
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 text-sm">
                          ✗ Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-300">
                  <p className="text-slate-600 font-semibold">✓ No pending requests</p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800">Recommended Skills</h3>
              {allSkills.slice(0, 5).map((skill) => (
                <div key={skill.id} className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="font-medium text-slate-700">{skill.name}</p>
                  <p className="text-xs text-slate-600">{skill.category} - {skill.competencyLevel}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
