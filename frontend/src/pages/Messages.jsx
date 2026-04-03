import React, { useEffect, useMemo, useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAppStore } from '../context/appStore'

const Messages = ({ onNavigate }) => {
  const {
    currentUser,
    getAcceptedChatRequests,
    activeChatRequestId,
    setActiveChatRequestId,
    loadChatMessages,
    sendChatMessage,
    addNotification,
  } = useAppStore()

  const threads = getAcceptedChatRequests()
  const [selectedThreadId, setSelectedThreadId] = useState(activeChatRequestId || threads[0]?._id || '')
  const [messages, setMessages] = useState([])
  const [composerValue, setComposerValue] = useState('')
  const [threadLoading, setThreadLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0]._id)
    }
  }, [selectedThreadId, threads])

  useEffect(() => {
    if (!selectedThreadId && activeChatRequestId) {
      setSelectedThreadId(activeChatRequestId)
    }
  }, [activeChatRequestId, selectedThreadId])

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([])
      return
    }

    const loadThread = async () => {
      try {
        setThreadLoading(true)
        const response = await loadChatMessages(selectedThreadId)
        setMessages(response.messages || [])
        setActiveChatRequestId(selectedThreadId)
      } catch (error) {
        addNotification({
          title: 'Chat unavailable',
          message: error.response?.data?.error || 'Unable to load this conversation right now.',
        })
      } finally {
        setThreadLoading(false)
      }
    }

    loadThread()
  }, [selectedThreadId, loadChatMessages, setActiveChatRequestId, addNotification])

  const activeThread = threads.find((thread) => thread._id === selectedThreadId) || null

  const partner = useMemo(() => {
    if (!activeThread || !currentUser) return null

    const senderId = activeThread.senderId?._id || activeThread.senderId?.id || activeThread.senderId
    const currentUserId = currentUser._id || currentUser.id

    if (String(senderId) === String(currentUserId)) {
      return activeThread.receiverId
    }

    return activeThread.senderId
  }, [activeThread, currentUser])

  const handleSend = async () => {
    const content = composerValue.trim()
    if (!content || !selectedThreadId || sending) return

    try {
      setSending(true)
      const response = await sendChatMessage(selectedThreadId, content)
      const nextMessages = [...messages, response.chatMessage]
      setMessages(nextMessages)
      setComposerValue('')
      addNotification({ title: 'Message sent', message: 'Your message was delivered to your connection.' })
    } catch (error) {
      addNotification({
        title: 'Send failed',
        message: error.response?.data?.error || 'Unable to send your message right now.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
              <p className="text-slate-600 mt-1">Chat only opens after a request is accepted.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('marketplace')}
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              Find more people
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 min-h-[70vh]">
            <aside className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Connections</h2>
                <span className="text-xs font-semibold text-slate-500">{threads.length}</span>
              </div>

              <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                {threads.length > 0 ? (
                  threads.map((thread) => {
                    const senderId = thread.senderId?._id || thread.senderId
                    const currentUserId = currentUser?._id || currentUser?.id
                    const otherUser = String(senderId) === String(currentUserId) ? thread.receiverId : thread.senderId
                    const preview = thread.skillOfferedId?.name && thread.skillRequestedId?.name
                      ? `${thread.skillOfferedId.name} ↔ ${thread.skillRequestedId.name}`
                      : 'Accepted connection'

                    return (
                      <button
                        key={thread._id}
                        type="button"
                        onClick={() => setSelectedThreadId(thread._id)}
                        className={`w-full text-left rounded-xl border p-3 transition-all ${
                          selectedThreadId === thread._id
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {otherUser?.profileImage ? (
                            <img
                              src={otherUser.profileImage}
                              alt={otherUser?.name || 'Connection'}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <span className="w-11 h-11 rounded-full border border-slate-200 bg-slate-100 text-slate-500 inline-flex items-center justify-center" aria-hidden="true">
                              <UserCircle2 size={20} />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 truncate">{otherUser?.name || 'Connection'}</p>
                            <p className="text-xs text-slate-600 truncate">{preview}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    No chat threads yet. Accept a request to start messaging.
                  </div>
                )}
              </div>
            </aside>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              {activeThread ? (
                <>
                  <div className="border-b border-slate-200 p-4 flex items-center gap-3">
                    {partner?.profileImage ? (
                      <img
                        src={partner.profileImage}
                        alt={partner?.name || 'Connection'}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <span className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 text-slate-500 inline-flex items-center justify-center" aria-hidden="true">
                        <UserCircle2 size={22} />
                      </span>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{partner?.name || 'Connection'}</p>
                      <p className="text-xs text-slate-600">
                        {activeThread.skillOfferedId?.name || 'Skill'} ↔ {activeThread.skillRequestedId?.name || 'Skill'}
                      </p>
                    </div>
                    {threadLoading && <span className="text-xs font-semibold text-slate-500">Loading...</span>}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {messages.length > 0 ? (
                      messages.map((entry) => {
                        const isMine = String(entry.senderId?._id || entry.senderId) === String(currentUser?._id || currentUser?.id)

                        return (
                          <div key={entry._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isMine ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                              <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                              <p className={`mt-2 text-[11px] ${isMine ? 'text-blue-100' : 'text-slate-500'}`}>
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-slate-500">
                        <div>
                          <p className="font-semibold text-slate-700">No messages yet</p>
                          <p className="text-sm mt-1">Start the conversation below.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="flex gap-3">
                      <textarea
                        value={composerValue}
                        onChange={(e) => setComposerValue(e.target.value)}
                        placeholder={`Message ${partner?.name || 'your connection'}...`}
                        rows={3}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={sending || !composerValue.trim()}
                        className="self-end rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <h2 className="text-xl font-bold text-slate-900">Select a connection</h2>
                    <p className="mt-2 text-slate-600">
                      Accepted requests appear here. Use the Connect button from Marketplace or Requests to open a chat.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('marketplace')}
                      className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Go to Marketplace
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Messages