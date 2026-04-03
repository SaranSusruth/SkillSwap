/**
 * Settings Page Component
 * Account preferences and privacy controls
 */
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Settings = ({ onNavigate }) => {
  const { currentUser, updateProfile, logout } = useAppStore()
  const [formState, setFormState] = useState({
    teachSkills: true,
    learnSkills: true,
    phone: '',
    bio: '',
  })
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })

  useEffect(() => {
    if (!currentUser) return
    setFormState({
      teachSkills: currentUser.teachSkills !== undefined ? currentUser.teachSkills : true,
      learnSkills: currentUser.learnSkills !== undefined ? currentUser.learnSkills : true,
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
    })
  }, [currentUser])

  const onSaveSettings = async () => {
    setStatus({ loading: true, message: '', error: '' })
    try {
      await updateProfile({
        teachSkills: formState.teachSkills,
        learnSkills: formState.learnSkills,
        phone: formState.phone,
        bio: formState.bio,
      })
      setStatus({ loading: false, message: 'Settings saved successfully', error: '' })
    } catch (error) {
      setStatus({ loading: false, message: '', error: error.response?.data?.error || 'Unable to save settings' })
    }
  }

  const onLogout = () => {
    logout()
    onNavigate('login')
  }

  if (!currentUser) {
    return (
      <Layout onNavigate={onNavigate}>
        <div className="min-h-screen bg-slate-100 p-4">Loading settings...</div>
      </Layout>
    )
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account preferences and privacy.</p>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-slate-800">Skill Exchange Preferences</h2>

            <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg p-4">
              <div>
                <p className="font-semibold text-slate-800">Available to teach skills</p>
                <p className="text-sm text-slate-500">Show your profile for users looking for mentors.</p>
              </div>
              <input
                type="checkbox"
                checked={formState.teachSkills}
                onChange={(e) => setFormState((prev) => ({ ...prev, teachSkills: e.target.checked }))}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg p-4">
              <div>
                <p className="font-semibold text-slate-800">Interested in learning</p>
                <p className="text-sm text-slate-500">Allow others to send you learning requests.</p>
              </div>
              <input
                type="checkbox"
                checked={formState.learnSkills}
                onChange={(e) => setFormState((prev) => ({ ...prev, learnSkills: e.target.checked }))}
                className="w-5 h-5"
              />
            </label>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Contact & Bio</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                placeholder="Tell others about your learning goals"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={onSaveSettings}
                disabled={status.loading}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-70"
              >
                {status.loading ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
              >
                Back to Profile
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-5 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
            {status.message && <p className="text-green-600 mt-3">{status.message}</p>}
            {status.error && <p className="text-rose-600 mt-3">{status.error}</p>}
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
