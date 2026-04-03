/**
 * Profile Page Component
 * Simple profile overview
 */
import React, { useState, useEffect } from 'react'
import { UserCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Profile = ({ onNavigate }) => {
  const { currentUser, updateProfile } = useAppStore()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: '',
    skills: [],
    teachSkills: false,
    learnSkills: false,
  })
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })

  useEffect(() => {
    if (!currentUser) return
    setFormState({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      profileImage: currentUser.profileImage || '',
      teachSkills: currentUser.teachSkills !== undefined ? currentUser.teachSkills : false,
      learnSkills: currentUser.learnSkills !== undefined ? currentUser.learnSkills : false,
      skills: Array.isArray(currentUser.skills)
        ? currentUser.skills.map((skill) => ({
            name: skill.skillId?.name || skill.name || '',
            level: skill.level || 'beginner',
          }))
        : [],
    })
  }, [currentUser])

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-100 p-4">Loading...</div>
  }

  const onSkillChange = (index, field, value) => {
    const newSkills = [...formState.skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setFormState((prev) => ({ ...prev, skills: newSkills }))
  }

  const addSkill = () => {
    setFormState((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: '', level: 'beginner' }],
    }))
  }

  const removeSkill = (index) => {
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const onSave = async () => {
    setStatus({ loading: true, message: '', error: '' })
    try {
      const payload = {
        name: formState.name,
        bio: formState.bio,
        phone: formState.phone,
        profileImage: formState.profileImage,
        teachSkills: formState.teachSkills,
        learnSkills: formState.learnSkills,
        skills: formState.skills.filter((s) => s.name.trim() !== ''),
      }

      await updateProfile(payload)
      setStatus({ loading: false, message: 'Profile updated successfully', error: '' })
    } catch (err) {
      setStatus({ loading: false, message: '', error: 'Unable to update profile' })
      console.error('Profile update error', err)
    }
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {formState.profileImage || currentUser.profileImage ? (
                <img
                  src={formState.profileImage || currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <span className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-100 text-slate-500 inline-flex items-center justify-center" aria-hidden="true">
                  <UserCircle2 size={42} />
                </span>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
                <p className="text-sm text-slate-600">{currentUser.email}</p>
                <p className="text-sm text-slate-500">{currentUser.role}</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 bg-slate-100"
                  value={formState.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  value={formState.bio}
                  onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="teachSkills"
                    checked={formState.teachSkills}
                    onChange={(e) => setFormState((prev) => ({ ...prev, teachSkills: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="teachSkills" className="text-sm font-semibold text-slate-700">
                    Available to teach skills
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="learnSkills"
                    checked={formState.learnSkills}
                    onChange={(e) => setFormState((prev) => ({ ...prev, learnSkills: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="learnSkills" className="text-sm font-semibold text-slate-700">
                    Interested in learning skills
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-800">Skills</h3>
              {formState.skills.map((skill, index) => (
                <div key={index} className="mt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={skill.name}
                    onChange={(e) => onSkillChange(index, 'name', e.target.value)}
                    placeholder="Skill name"
                  />
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={skill.level}
                    onChange={(e) => onSkillChange(index, 'level', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => removeSkill(index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={addSkill}
                type="button"
              >
                + Add Skill
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
                onClick={onSave}
                disabled={status.loading}
              >
                {status.loading ? 'Saving...' : 'Save Profile'}
              </button>
              {status.message && <p className="text-green-600">{status.message}</p>}
              {status.error && <p className="text-red-600">{status.error}</p>}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">Profile preview</h2>
            <p className="text-sm text-slate-600 mt-2">Name: {formState.name}</p>
            <p className="text-sm text-slate-600 mt-1">Email: {formState.email}</p>
            <p className="text-sm text-slate-600 mt-1">Phone: {formState.phone || 'Not set'}</p>
            <p className="text-sm text-slate-600 mt-1">Bio: {formState.bio || 'Not set'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {formState.skills.length > 0 ? (
                formState.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-700">
                    {skill.name} ({skill.level})
                  </span>
                ))
              ) : (
                <span className="text-slate-500">No skills added</span>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
