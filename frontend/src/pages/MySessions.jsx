/**
 * My Sessions Page Component
 * Shows user's active and completed skill exchange sessions
 */
import React, { useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const MySessions = ({ onNavigate }) => {
  const { activeSessions, completedSessions, currentUser, submitSessionReview, addNotification } = useAppStore()
  const [activeTab, setActiveTab] = useState('active')
  const currentUserId = currentUser?._id || currentUser?.id

  const sessions = activeTab === 'active' ? activeSessions : completedSessions

  // Helper function to get partner info
  const getPartner = (session) => {
    if (session.mentorId?._id === currentUserId) {
      return session.studentId
    } else {
      return session.mentorId
    }
  }

  const onJoinSession = (session) => {
    if (session.mode === 'online' && session.location && /^https?:\/\//i.test(session.location)) {
      window.open(session.location, '_blank', 'noopener,noreferrer')
      return
    }

    addNotification({
      title: 'Session details',
      message: `Session starts on ${new Date(session.sessionDate).toLocaleString()}${session.location ? ` at ${session.location}` : ''}`,
    })
  }

  const onViewNotes = (session) => {
    const noteText = session.notes && session.notes.trim() ? session.notes : 'No notes added yet for this session.'
    addNotification({ title: 'Session notes', message: noteText })
  }

  const onRateSession = async (session) => {
    const ratingRaw = window.prompt('Rate this session from 1 to 5')
    if (ratingRaw === null) return

    const rating = Number(ratingRaw)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      addNotification({ title: 'Invalid rating', message: 'Please provide a whole number between 1 and 5.' })
      return
    }

    const comment = window.prompt('Add a short feedback comment')
    if (comment === null) return

    try {
      await submitSessionReview(session._id || session.id, rating, comment.trim() || 'Great session')
      addNotification({ title: 'Thanks for the review', message: 'Your session feedback was submitted.' })
    } catch (error) {
      addNotification({
        title: 'Review failed',
        message: error.response?.data?.error || 'Unable to submit your review right now.',
      })
    }
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          <header className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Sessions</h1>
            <p className="text-slate-600 mt-1">Track your skill exchange sessions and learning progress.</p>
          </header>

          <div className="flex gap-2 mb-6 flex-wrap">
            {['active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 rounded-lg border-2 font-bold text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                    : 'bg-white text-slate-900 border-slate-400 hover:bg-blue-50 hover:border-blue-400'
                }`}
              >
                {tab === 'active' ? '🔄 ACTIVE' : '✅ COMPLETED'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                const partner = getPartner(session)

                return (
                  <div key={session._id} className="bg-white p-6 rounded-xl border-2 border-slate-300 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      {partner?.profileImage ? (
                        <img
                          src={partner.profileImage}
                          alt={partner?.name}
                          className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover flex-shrink-0"
                        />
                      ) : (
                        <span className="w-16 h-16 rounded-full border-2 border-blue-400 bg-blue-50 text-blue-700 inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <UserCircle2 size={30} />
                        </span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{partner?.name}</h3>
                        <p className="text-sm text-slate-600">{session.mentorId?._id === currentUserId ? 'Student' : 'Mentor'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            activeTab === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {activeTab === 'active' ? '🔄 ACTIVE' : '✅ COMPLETED'}
                          </span>
                          <span className="text-xs text-slate-500">
                            Scheduled: {new Date(session.sessionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900">📚 Skill: {session.skillId?.name}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <p className="text-sm font-semibold text-emerald-900">⏱️ Duration: {session.duration} minutes</p>
                      </div>
                    </div>

                    {activeTab === 'active' && (
                      <div className="flex gap-3">
                        <button
                          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200 border border-blue-600"
                          onClick={() => onJoinSession(session)}
                          type="button"
                        >
                          📞 Join Session
                        </button>
                        <button
                          className="px-4 py-3 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all duration-200 border border-slate-300"
                          onClick={() => onViewNotes(session)}
                          type="button"
                        >
                          📝 Notes
                        </button>
                      </div>
                    )}

                    {activeTab === 'completed' && (
                      <div className="flex gap-3">
                        <button
                          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg transition-all duration-200 border border-emerald-600"
                          onClick={() => onRateSession(session)}
                          type="button"
                        >
                          ⭐ Rate Session
                        </button>
                        <button
                          className="px-4 py-3 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all duration-200 border border-slate-300"
                          onClick={() => onViewNotes(session)}
                          type="button"
                        >
                          📝 Feedback
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl border-2 border-slate-300">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-700 font-bold text-xl mb-2">
                  {activeTab === 'active' ? 'No Active Sessions' : 'No Completed Sessions'}
                </p>
                <p className="text-slate-500">
                  {activeTab === 'active'
                    ? 'Start a new skill exchange to begin learning!'
                    : 'Complete your active sessions to see them here.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MySessions