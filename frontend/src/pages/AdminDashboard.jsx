/**
 * Admin Dashboard
 * Distinct moderation console for reported users and admin actions
 */
import React, { useEffect, useMemo, useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import { useAppStore } from '../context/appStore'
import { adminAPI } from '../utils/api'

const initialStats = {
  totalReports: 0,
  openReports: 0,
  resolvedReports: 0,
  activeUsers: 0,
}

const AdminDashboard = () => {
  const { currentUser, logout, addNotification } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(initialStats)
  const [reportedUsers, setReportedUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedReports, setSelectedReports] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reported-users', label: 'Reported Users' },
    { id: 'blocked-users', label: 'Blocked Users' },
  ]

  const loadAdminData = async (preserveSelection = true) => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data?.stats || initialStats)
      setReportedUsers(Array.isArray(response.data?.reportedUsers) ? response.data.reportedUsers : [])

      if (preserveSelection && selectedUserId) {
        const reportsResponse = await adminAPI.getUserReports(selectedUserId)
        setSelectedReports(Array.isArray(reportsResponse.data?.reports) ? reportsResponse.data.reports : [])
      }
    } catch (error) {
      addNotification({
        title: 'Admin load failed',
        message: error.response?.data?.error || 'Unable to load admin dashboard data.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredReportedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return reportedUsers.filter((entry) => {
      const user = entry.user || {}
      const userName = user.name || ''
      const userEmail = user.email || ''
      return !query || userName.toLowerCase().includes(query) || userEmail.toLowerCase().includes(query)
    })
  }, [reportedUsers, searchQuery])

  const blockedUsers = useMemo(
    () => reportedUsers.filter((entry) => (entry.user?.isActive === false)),
    [reportedUsers]
  )

  const handleViewReports = async (userId) => {
    try {
      setSelectedUserId(userId)
      const response = await adminAPI.getUserReports(userId)
      setSelectedReports(Array.isArray(response.data?.reports) ? response.data.reports : [])
    } catch (error) {
      addNotification({
        title: 'Unable to load reports',
        message: error.response?.data?.error || 'Could not load reports for this user.',
      })
    }
  }

  const handleBlockUser = async (userId) => {
    try {
      setActionLoadingId(userId)
      await adminAPI.blockUser(userId)
      addNotification({ title: 'User blocked', message: 'The reported user has been blocked.' })
      await loadAdminData(true)
    } catch (error) {
      addNotification({
        title: 'Block failed',
        message: error.response?.data?.error || 'Could not block the user.',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const selectedUserEntry = reportedUsers.find((entry) => String(entry.user?._id || entry._id) === String(selectedUserId))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-black">A</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Admin Console</p>
              <h1 className="text-lg font-bold text-white md:text-2xl">Moderation Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white">{currentUser?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser?.role || 'admin'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-black text-white hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 md:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm" id="overview">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr] lg:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Admin Console</p>
                <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-white">Moderation Dashboard</h2>
                <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-300">
                  Review reports, inspect behavior patterns, and block users who cross the moderation threshold.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => loadAdminData(true)}
                  className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"
                >
                  Refresh Dashboard
                </button>
              </div>
            </div>
          </section>

          <section className="sticky top-[88px] z-10 rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" id="analytics">
            {[
              { label: 'Total Reports', value: stats.totalReports, accent: 'from-cyan-500 to-blue-600' },
              { label: 'Open Reports', value: stats.openReports, accent: 'from-amber-400 to-orange-500' },
              { label: 'Resolved Reports', value: stats.resolvedReports, accent: 'from-emerald-400 to-teal-500' },
              { label: 'Active Users', value: stats.activeUsers, accent: 'from-fuchsia-500 to-pink-500' },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
                <p className="text-sm text-slate-300">{card.label}</p>
                <div className={`mt-4 inline-flex rounded-2xl bg-gradient-to-r ${card.accent} px-4 py-2 shadow-lg`}>
                  <span className="text-3xl font-black text-white">{loading ? '...' : card.value}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6" id="reported-users">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Reported Users</h2>
                  <p className="mt-1 text-sm text-slate-400">Block button appears only when a user has more than 5 reports.</p>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full md:w-80 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[780px] text-left">
                  <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-300">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Reports</th>
                      <th className="px-4 py-3">Latest Report</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-950/60">
                    {filteredReportedUsers.length > 0 ? (
                      filteredReportedUsers.map((entry) => {
                        const user = entry.user || {}
                        const userId = String(user._id || entry._id)
                        const canBlock = entry.reportCount > 5 && user.isActive !== false

                        return (
                          <tr key={userId} className="transition-colors hover:bg-white/5">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {user.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt={user.name || 'Reported user'}
                                    className="h-12 w-12 rounded-full border border-white/10 object-cover"
                                  />
                                ) : (
                                  <span className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-slate-300 inline-flex items-center justify-center" aria-hidden="true">
                                    <UserCircle2 size={24} />
                                  </span>
                                )}
                                <div>
                                  <p className="font-semibold text-white">{user.name || 'Unknown user'}</p>
                                  <p className="text-xs text-slate-400">{user.email || 'No email available'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-bold text-cyan-300">
                                {entry.reportCount}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-300">
                              {entry.latestReportAt ? new Date(entry.latestReportAt).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 font-semibold ${
                                  user.isActive === false
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {user.isActive === false ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewReports(userId)}
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                                >
                                  View Reports
                                </button>
                                <button
                                  type="button"
                                  disabled={!canBlock || actionLoadingId === userId}
                                  onClick={() => handleBlockUser(userId)}
                                  className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-black text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {actionLoadingId === userId ? 'Blocking...' : canBlock ? 'Block User' : 'Need > 5 Reports'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                          No reported users match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Report Details</h2>
                  <p className="mt-1 text-sm text-slate-300">
                    {selectedUserEntry ? `Showing reports for ${selectedUserEntry.user?.name || 'selected user'}` : 'Select a user to inspect their reports.'}
                  </p>
                </div>
                {selectedUserEntry && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                    {selectedUserEntry.reportCount} total reports
                  </span>
                )}
              </div>

              <div className="mt-5 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
                {selectedReports.length > 0 ? (
                  selectedReports.map((report) => (
                    <div key={report._id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{report.reason}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            By {report.reporterId?.name || 'anonymous'} on {new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-slate-200">
                          {report.status}
                        </span>
                      </div>
                      {report.details && <p className="mt-3 text-sm text-slate-300">{report.details}</p>}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-sm text-slate-400">
                    No report details loaded yet.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-sm" id="blocked-users">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Blocked Users</h2>
                <p className="mt-1 text-sm text-slate-400">Users blocked by admin moderation.</p>
              </div>
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300">
                {blockedUsers.length} blocked
              </span>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-300">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Reports</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-950/60">
                  {blockedUsers.length > 0 ? (
                    blockedUsers.map((entry) => {
                      const user = entry.user || {}
                      return (
                        <tr key={`blocked-${String(user._id || entry._id)}`} className="hover:bg-white/5">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.name || 'Blocked user'}
                                  className="h-10 w-10 rounded-full border border-white/10 object-cover"
                                />
                              ) : (
                                <span className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-slate-300 inline-flex items-center justify-center" aria-hidden="true">
                                  <UserCircle2 size={20} />
                                </span>
                              )}
                              <div>
                                <p className="font-semibold text-white">{user.name || 'Unknown user'}</p>
                                <p className="text-xs text-slate-400">{user.email || 'No email available'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-300">{entry.reportCount}</td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300">
                              Blocked
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-slate-400">
                        No blocked users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
