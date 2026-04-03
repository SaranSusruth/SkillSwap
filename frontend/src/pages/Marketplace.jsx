/**
 * Marketplace Page Component
 * Simple list grid of people with matching skills
 */
import React, { useState, useEffect, useMemo } from 'react'
import { UserCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Marketplace = ({ onNavigate }) => {
  const { marketplaceUsers, loadMarketplaceUsers, searchQuery, setSearchQuery, selectedCategory, filterSkills, marketplaceLoading, currentUser, requestsSent, requestsReceived, sendRequest, reportUser, submitUserReview, addNotification, setActiveChatRequestId } = useAppStore()
  const [selectedCompetency, setSelectedCompetency] = useState('All')
  const [selectedRequestedSkills, setSelectedRequestedSkills] = useState({})
  const [displayedUsers, setDisplayedUsers] = useState([])
  const [reportModalUser, setReportModalUser] = useState(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reviewModalUser, setReviewModalUser] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')

  const categories = ['All', 'programming', 'design', 'languages', 'music', 'sports', 'arts', 'business', 'other']
  const competencyLevels = ['All', 'beginner', 'intermediate', 'advanced']

  useEffect(() => {
    if (marketplaceUsers.length === 0) {
      loadMarketplaceUsers()
    }
  }, [loadMarketplaceUsers, marketplaceUsers.length])

  useEffect(() => {
    const adjustedQuery = searchQuery.trim().toLowerCase()
    const currentUserId = String(currentUser?._id || currentUser?.id || '')

    const filtered = marketplaceUsers.filter((user) => {
      const listedUserId = String(user?._id || user?.id || '')
      const listedUserRole = String(user?.role || '').toLowerCase()

      if (listedUserRole === 'admin') return false
      if (currentUserId && listedUserId && listedUserId === currentUserId) return false

      const skills = Array.isArray(user.skills) ? user.skills : []

      const matchesSearch = !adjustedQuery || skills.some((skill) => {
        const skillName = skill.skillId?.name || skill.name || ''
        const skillDescription = skill.skillId?.description || skill.description || ''
        const skillTags = skill.skillId?.tags || skill.tags || []

        return (
          skillName.toLowerCase().includes(adjustedQuery) ||
          skillDescription.toLowerCase().includes(adjustedQuery) ||
          skillTags.some((tag) => String(tag).toLowerCase().includes(adjustedQuery))
        )
      })

      const matchesCategory =
        selectedCategory === 'All' ||
        skills.some((skill) => (skill.skillId?.category || skill.category || '').toLowerCase() === selectedCategory.toLowerCase())

      const matchesCompetency =
        selectedCompetency === 'All' ||
        skills.some((skill) => (skill.level || skill.skillId?.level || '').toLowerCase() === selectedCompetency.toLowerCase())

      return matchesSearch && matchesCategory && matchesCompetency
    })

    setDisplayedUsers(filtered)
  }, [marketplaceUsers, selectedCategory, selectedCompetency, searchQuery, currentUser])

  const resultsLabel = useMemo(() => {
    if (!searchQuery.trim()) {
      return 'Browse people with shared skills'
    }

    return `Results for "${searchQuery.trim()}"`
  }, [searchQuery])

  const onCategoryChange = (value) => {
    filterSkills(value)
  }

  const extractSkillId = (skillEntry) => {
    if (!skillEntry) return null
    if (typeof skillEntry.skillId === 'string') return skillEntry.skillId
    return skillEntry.skillId?._id || skillEntry._id || null
  }

  const extractSkillName = (skillEntry) => {
    if (!skillEntry) return 'Skill'
    return skillEntry.skillId?.name || skillEntry.name || 'Skill'
  }

  const getUserSkillOptions = (user) => {
    const userSkills = Array.isArray(user?.skills) ? user.skills : []
    return userSkills
      .map((skillEntry) => {
        const id = extractSkillId(skillEntry)
        if (!id) return null

        return {
          id: String(id),
          name: extractSkillName(skillEntry),
          level: skillEntry.level || skillEntry.skillId?.level || 'beginner',
        }
      })
      .filter(Boolean)
  }

  const onRequestedSkillChange = (userId, skillId) => {
    setSelectedRequestedSkills((prev) => ({
      ...prev,
      [String(userId)]: skillId,
    }))
  }

  const extractRequestSkillId = (request) => {
    if (!request) return null
    if (typeof request.skillRequestedId === 'string') return request.skillRequestedId
    return request.skillRequestedId?._id || null
  }

  const getConnectionRequest = (user, selectedRequestedSkillId) => {
    const userId = user._id || user.id
    const currentUserId = currentUser?._id || currentUser?.id

    if (!userId || !currentUserId || !selectedRequestedSkillId) return null

    const allRequests = [...(requestsSent || []), ...(requestsReceived || [])]
      .filter((request) => {
        const senderId = request.senderId?._id || request.senderId
        const receiverId = request.receiverId?._id || request.receiverId
        const requestedSkillId = extractRequestSkillId(request)

        if (!requestedSkillId || String(requestedSkillId) !== String(selectedRequestedSkillId)) {
          return false
        }

        return (
          (String(senderId) === String(currentUserId) && String(receiverId) === String(userId)) ||
          (String(senderId) === String(userId) && String(receiverId) === String(currentUserId))
        )
      })
      .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))

    return allRequests[0] || null
  }

  const onSendRequest = async (user, requestedSkillIdFromSelection, requestedSkillNameFromSelection) => {
    const receiverId = user._id || user.id

    if (!receiverId) {
      addNotification({ title: 'Connect failed', message: 'Unable to identify selected user.' })
      return
    }

    const mySkills = Array.isArray(currentUser?.skills) ? currentUser.skills : []
    const targetSkills = Array.isArray(user.skills) ? user.skills : []

    const offeredSkillId = extractSkillId(mySkills[0])
    const requestedSkillId = requestedSkillIdFromSelection || extractSkillId(targetSkills[0])
    const requestedSkillName = requestedSkillNameFromSelection || extractSkillName(targetSkills[0])

    if (!offeredSkillId) {
      addNotification({ title: 'Add your skill first', message: 'Please add at least one skill in your profile before sending a request.' })
      return
    }

    if (!requestedSkillId) {
      addNotification({ title: 'No target skill found', message: 'This user has no visible skills to request yet.' })
      return
    }

    try {
      await sendRequest({
        receiverId,
        skillOfferedId: offeredSkillId,
        skillRequestedId: requestedSkillId,
        message: `Hi ${user.name}, I would like to request your ${requestedSkillName} skill and exchange skills with you.`,
      })
      addNotification({ title: 'Request sent', message: `Your request to ${user.name} for ${requestedSkillName} has been sent.` })
    } catch (error) {
      addNotification({
        title: 'Request failed',
        message: error.response?.data?.error || 'Unable to send request right now.',
      })
    }
  }

  const onOpenChat = (request) => {
    if (!request?._id) return
    setActiveChatRequestId(request._id)
    onNavigate('messages')
  }

  const onReportUser = (user) => {
    setReportModalUser(user)
    setReportReason('')
    setReportDetails('')
    setReportError('')
  }

  const onReviewUser = (user) => {
    setReviewModalUser(user)
    setReviewRating(5)
    setReviewComment('')
    setReviewError('')
  }

  const onCloseReportModal = () => {
    if (reportSubmitting) return
    setReportModalUser(null)
    setReportReason('')
    setReportDetails('')
    setReportError('')
  }

  const onCloseReviewModal = () => {
    if (reviewSubmitting) return
    setReviewModalUser(null)
    setReviewRating(5)
    setReviewComment('')
    setReviewError('')
  }

  const onSubmitReport = async () => {
    const user = reportModalUser
    if (!user) return

    const reportedUserId = user._id || user.id

    if (!reportedUserId) {
      setReportError('Unable to identify selected user.')
      return
    }

    const reason = reportReason.trim()
    const details = reportDetails.trim()

    if (!reason) {
      setReportError('Please enter a reason for the report.')
      return
    }

    try {
      setReportSubmitting(true)
      setReportError('')
      await reportUser({ reportedUserId, reason, details })
      addNotification({ title: 'Report submitted', message: `Thanks. Your report for ${user.name} has been submitted.` })
      onCloseReportModal()
    } catch (error) {
      setReportError(error.response?.data?.error || 'Unable to submit report right now.')
    } finally {
      setReportSubmitting(false)
    }
  }

  const onSubmitReview = async () => {
    const user = reviewModalUser
    if (!user) return

    const revieweeId = user._id || user.id
    const comment = reviewComment.trim()

    if (!revieweeId) {
      setReviewError('Unable to identify selected user.')
      return
    }

    if (!Number.isInteger(Number(reviewRating)) || Number(reviewRating) < 1 || Number(reviewRating) > 5) {
      setReviewError('Please choose a rating between 1 and 5.')
      return
    }

    if (comment.length < 10) {
      setReviewError('Please write at least 10 characters in your review.')
      return
    }

    try {
      setReviewSubmitting(true)
      setReviewError('')
      await submitUserReview({ revieweeId, rating: Number(reviewRating), comment })
      addNotification({ title: 'Review submitted', message: `Thanks. Your review for ${user.name} has been submitted.` })
      onCloseReviewModal()
    } catch (error) {
      setReviewError(error.response?.data?.error || 'Unable to submit review right now.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">Skill Marketplace</h1>
            <p className="text-slate-600 mt-1">Browse and connect with campus peers.</p>
          </header>

          <div className="bg-white p-5 rounded-xl border-2 border-slate-300 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">🔍 Search Skills</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a course or skill..."
                  className="w-full border-2 border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">📂 Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full border-2 border-slate-300 px-3 py-2 rounded-lg font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">📊 Level</label>
                <select
                  value={selectedCompetency}
                  onChange={(e) => setSelectedCompetency(e.target.value)}
                  className="w-full border-2 border-slate-300 px-3 py-2 rounded-lg font-semibold"
                >
                  {competencyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>{resultsLabel}</p>
            <p>{marketplaceLoading ? 'Loading people...' : `${displayedUsers.length} people found`}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => {
                const userId = String(user._id || user.id || '')
                const requestableSkills = getUserSkillOptions(user)
                const selectedRequestedSkillId =
                  selectedRequestedSkills[userId] || requestableSkills[0]?.id || ''
                const selectedRequestedSkillName =
                  requestableSkills.find((skill) => skill.id === selectedRequestedSkillId)?.name ||
                  requestableSkills[0]?.name ||
                  'selected skill'
                const connectionRequest = getConnectionRequest(user, selectedRequestedSkillId)
                const isAccepted = connectionRequest?.status === 'accepted'
                const isPending = connectionRequest?.status === 'pending'
                const buttonAction = isAccepted
                  ? () => onOpenChat(connectionRequest)
                  : () => onSendRequest(user, selectedRequestedSkillId, selectedRequestedSkillName)

                return (
                  <div key={user._id || user.id} className="bg-white border-2 border-slate-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-slate-200">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover"
                        />
                      ) : (
                        <span className="w-14 h-14 rounded-full border-2 border-blue-400 bg-blue-50 text-blue-600 inline-flex items-center justify-center" aria-hidden="true">
                          <UserCircle2 size={28} />
                        </span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-600 capitalize">{user.role || 'member'}</p>
                        {typeof user.rating === 'number' && (
                          <p className="text-xs text-yellow-600 font-semibold">{user.rating}/5.0</p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 font-semibold mb-3">{user.bio || 'Open to skill exchange and new projects.'}</p>

                    <div className="space-y-2 mb-4 text-sm">
                      <p className="text-slate-700"><strong>📞 Contact:</strong> {user.phone || 'Not shared'}</p>
                      <p className="text-slate-700"><strong>🎯 Skills:</strong></p>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(user.skills) ? user.skills : []).map((skill, index) => {
                          const skillName = skill.skillId?.name || skill.name || 'Skill'
                          const skillLevel = skill.level || skill.skillId?.level || 'beginner'

                          return (
                            <span key={`${skillName}-${index}`} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                              {skillName} ({skillLevel})
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {!isAccepted && (
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select skill to request</label>
                        <select
                          value={selectedRequestedSkillId}
                          onChange={(event) => onRequestedSkillChange(userId, event.target.value)}
                          disabled={isPending || requestableSkills.length === 0}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold disabled:bg-slate-100 disabled:text-slate-500"
                        >
                          {requestableSkills.length > 0 ? (
                            requestableSkills.map((skill) => (
                              <option key={skill.id} value={skill.id}>
                                {skill.name} ({skill.level})
                              </option>
                            ))
                          ) : (
                            <option value="">No requestable skills</option>
                          )}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={buttonAction}
                        disabled={isPending}
                        className={`flex-1 rounded-lg py-3 px-4 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 border ${
                          isAccepted
                            ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                            : isPending
                              ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-blue-800'
                        }`}
                        type="button"
                      >
                        {isAccepted ? 'Connect' : isPending ? 'Pending' : 'Send Request'}
                      </button>
                      <button
                        onClick={() => onReportUser(user)}
                        className="rounded-lg border border-rose-300 bg-rose-50 text-rose-700 py-3 px-4 text-sm font-bold hover:bg-rose-100"
                        type="button"
                      >
                        Report
                      </button>
                    </div>
                    {isAccepted && (
                      <button
                        onClick={() => onReviewUser(user)}
                        className="mt-2 w-full rounded-lg border border-amber-300 bg-amber-50 text-amber-700 py-2 px-4 text-sm font-bold hover:bg-amber-100"
                        type="button"
                      >
                        Rate & Review
                      </button>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-slate-500 col-span-full">No people found for selected filters.</p>
            )}
          </div>

          {reportModalUser && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
              <button
                type="button"
                onClick={onCloseReportModal}
                className="absolute inset-0 bg-black/50"
                aria-label="Close report modal"
              />
              <div className="relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-slate-900">Report User</h2>
                <p className="mt-1 text-sm text-slate-600">You are reporting {reportModalUser.name}. Please provide details below.</p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Reason *</label>
                    <input
                      type="text"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Example: Harassment, spam, abusive language"
                      maxLength={200}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Additional details</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Share what happened, when it happened, and any relevant context."
                      rows={5}
                      maxLength={1000}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {reportError && (
                    <p className="text-sm text-rose-600">{reportError}</p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onCloseReportModal}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                    disabled={reportSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSubmitReport}
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-70"
                    disabled={reportSubmitting}
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {reviewModalUser && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
              <button
                type="button"
                onClick={onCloseReviewModal}
                className="absolute inset-0 bg-black/50"
                aria-label="Close review modal"
              />
              <div className="relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-slate-900">Rate & Review User</h2>
                <p className="mt-1 text-sm text-slate-600">You are reviewing {reviewModalUser.name}. Share your feedback below.</p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rating *</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} / 5</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Review comment *</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this user (minimum 10 characters)."
                      rows={5}
                      maxLength={1000}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-sm text-rose-600">{reviewError}</p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onCloseReviewModal}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                    disabled={reviewSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSubmitReview}
                    className="px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-70"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Marketplace
