/**
 * RequestManagement Page Component
 * Simple request tracking UI
 */
import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const RequestManagement = ({ onNavigate }) => {
  const { requestsReceived, requestsSent, acceptRequest, rejectRequest, setActiveChatRequestId } = useAppStore()
  const [activeTab, setActiveTab] = useState('received')
  const [filterStatus, setFilterStatus] = useState('All')

  const receivedCount = (requestsReceived || []).length
  const sentCount = (requestsSent || []).length

  const requests = activeTab === 'received' ? requestsReceived : requestsSent
  const filteredRequests = filterStatus === 'All' ? requests : requests.filter((r) => r.status === filterStatus)

  const onConnect = (request) => {
    if (!request?._id) return
    setActiveChatRequestId(request._id)
    onNavigate('messages')
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          <header className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Request Management</h1>
            <p className="text-slate-600 mt-1">Switch between incoming and outgoing requests.</p>
          </header>

          <div className="flex gap-2 mb-4 flex-wrap">
            {['received', 'sent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 rounded-lg border-2 font-bold text-lg ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-white text-slate-900 border-slate-400 hover:bg-blue-50'
                }`}
              >
                {tab === 'received' ? `INCOMING (${receivedCount})` : `OUTGOING (${sentCount})`}
              </button>
            ))}
          </div>

          <div className="mb-4 bg-white p-4 rounded-lg border border-slate-300">
            <label className="block text-sm font-bold text-slate-800 mb-2">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-slate-400 rounded-lg px-4 py-2 font-semibold w-full"
            >
              {['All', 'pending', 'accepted', 'rejected'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request._id} className="bg-white p-5 rounded-xl border-2 border-slate-400 shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-slate-900">{activeTab === 'received' ? request.senderId?.name : request.receiverId?.name}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      request.status === 'pending' ? 'bg-yellow-300 text-yellow-900' :
                      request.status === 'accepted' ? 'bg-emerald-300 text-emerald-900' :
                      request.status === 'rejected' ? 'bg-rose-200 text-rose-900' : 'bg-slate-300 text-slate-900'
                    }`}>{request.status.toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <strong>Offers:</strong> {request.skillOfferedId?.name} → <strong>Wants:</strong> {request.skillRequestedId?.name}
                  </p>
                  <p className="text-sm text-slate-700 italic mb-3 bg-slate-50 p-2 rounded border border-slate-200">💬 "{request.message || 'No message shared'}"</p>
                  {activeTab === 'received' && request.status === 'pending' && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => acceptRequest(request._id)}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-600 hover:border-emerald-700 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-lg">✓</span>
                          <span>ACCEPT</span>
                        </span>
                      </button>
                      <button
                        onClick={() => rejectRequest(request._id)}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold hover:from-rose-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200 border border-rose-600 hover:border-rose-700 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-lg">✕</span>
                          <span>DECLINE</span>
                        </span>
                      </button>
                    </div>
                  )}
                  {request.status === 'accepted' && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => onConnect(request)}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-700"
                      >
                        OPEN CHAT
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-slate-300">
                <p className="text-slate-700 font-bold text-lg">📭 No requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RequestManagement
