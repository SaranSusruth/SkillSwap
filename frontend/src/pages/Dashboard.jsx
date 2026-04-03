/**
 * Dashboard Page Component
 * Minimal first-version dashboard with clear layout
 */
import React from 'react'
import { UserCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Dashboard = ({ onNavigate }) => {
  const { currentUser, requestsReceived, acceptRequest, rejectRequest, addNotification } = useAppStore()

  const pendingRequests = (requestsReceived || []).filter((req) => req.status === 'pending')
  const acceptedCount = (requestsReceived || []).filter((req) => req.status === 'accepted').length
  const offeredSkills = Array.isArray(currentUser?.skills) ? currentUser.skills : []

  const onAccept = async (requestId) => {
    try {
      await acceptRequest(requestId)
      addNotification({ title: 'Request accepted', message: 'The request has been accepted.' })
    } catch (error) {
      addNotification({ title: 'Accept failed', message: error.response?.data?.error || 'Unable to accept request right now.' })
    }
  }

  const onDecline = async (requestId) => {
    try {
      await rejectRequest(requestId)
      addNotification({ title: 'Request declined', message: 'The request has been declined.' })
    } catch (error) {
      addNotification({ title: 'Decline failed', message: error.response?.data?.error || 'Unable to decline request right now.' })
    }
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {currentUser?.name || 'Learner'}!</h1>
            <p className="text-slate-600 mt-2">Your activity summary at a glance.</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Accepted requests</h2>
              <p className="text-3xl font-bold text-slate-800">{acceptedCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Pending requests</h2>
              <p className="text-3xl font-bold text-slate-800">{pendingRequests.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Skills offered</h2>
              <p className="text-3xl font-bold text-slate-800">{offeredSkills.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Rating</h2>
              <p className="text-3xl font-bold text-slate-800">{(currentUser?.rating || 0).toFixed(1)}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Pending Requests</h3>
              {pendingRequests.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {pendingRequests.map((req) => (
                    <li key={req._id || req.id} className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        {req.senderId?.profileImage ? (
                          <img 
                            src={req.senderId.profileImage}
                            alt={req.senderId?.name}
                            className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
                          />
                        ) : (
                          <span className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-50 text-amber-700 inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <UserCircle2 size={24} />
                          </span>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{req.senderId?.name}</p>
                          <p className="text-xs text-slate-600 capitalize">{req.senderId?.role || 'Member'}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm font-bold text-slate-900 mb-1">{req.senderId?.name} offers <span className="text-blue-600">{req.skillOfferedId?.name}</span></p>
                      <p className="text-sm text-slate-700">Wants in exchange: <strong className="text-emerald-600">{req.skillRequestedId?.name}</strong></p>
                      <p className="text-xs text-slate-600 italic mt-2">"{req.message}"</p>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-600 hover:border-emerald-700 transform hover:scale-105"
                          onClick={() => onAccept(req._id || req.id)}
                          type="button"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-lg">Accept</span>
                          </span>
                        </button>
                        <button
                          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold hover:from-rose-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200 border border-rose-600 hover:border-rose-700 transform hover:scale-105"
                          onClick={() => onDecline(req._id || req.id)}
                          type="button"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-lg">Decline</span>
                          </span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-300">
                  <p className="text-slate-600 font-semibold">No pending requests</p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800">Skills offered</h3>
              {offeredSkills.length > 0 ? (
                offeredSkills.map((skill, index) => {
                  const skillName = skill.skillId?.name || skill.name || 'Skill'
                  const skillCategory = skill.skillId?.category || skill.category || 'other'
                  const skillLevel = skill.level || skill.skillId?.level || 'beginner'

                  return (
                    <div key={skill.skillId?._id || `${skillName}-${index}`} className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="font-medium text-slate-700">{skillName}</p>
                      <p className="text-xs text-slate-600">{skillCategory} - {skillLevel}</p>
                    </div>
                  )
                })
              ) : (
                <p className="mt-3 text-sm text-slate-500">No skills added yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
