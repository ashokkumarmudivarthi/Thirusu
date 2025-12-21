import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Users, Clock, CheckCircle, X, Send, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import TopScroll from '../sections/TopScroll'
import Footer from '../components/Footer'

export default function Support() {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'waiting', 'active', 'closed'
  const [agentStatus, setAgentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ waiting: 0, active: 0, total: 0 })
  const messagesEndRef = useRef(null)
  const pollingIntervalRef = useRef(null)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user?.role !== 'admin' && user?.role !== 'support') {
      navigate('/')
    } else {
      fetchAgentStatus()
      fetchSessions()
      startPolling()
    }

    return () => stopPolling()
  }, [isAuthenticated, user, navigate, filter])

  useEffect(() => {
    if (selectedSession) {
      fetchMessages()
      // Mark as read when selected
      markSessionAsRead(selectedSession.id)
    }
  }, [selectedSession])

  const markSessionAsRead = async (sessionId) => {
    try {
      // Messages are automatically marked as read when fetched
      await api.get(`/chat/sessions/${sessionId}/messages`)
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startPolling = () => {
    if (pollingIntervalRef.current) return
    
    pollingIntervalRef.current = setInterval(() => {
      fetchSessions()
      if (selectedSession) {
        fetchMessages()
      }
    }, 3000)
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const fetchAgentStatus = async () => {
    try {
      const response = await api.get('/chat/agent/status')
      setAgentStatus(response.data)
    } catch (error) {
      console.error('Error fetching agent status:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const queryParam = filter !== 'all' ? `?status=${filter}` : ''
      const response = await api.get(`/chat/sessions/all${queryParam}`)
      setSessions(response.data)

      // Calculate stats
      const waiting = response.data.filter(s => s.status === 'waiting').length
      const active = response.data.filter(s => s.status === 'active').length
      setStats({ waiting, active, total: response.data.length })
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedSession) return

    try {
      const response = await api.get(`/chat/sessions/${selectedSession.id}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return

    try {
      const response = await api.post(`/chat/sessions/${selectedSession.id}/messages`, {
        message: newMessage
      })
      
      setMessages(prev => [...prev, response.data])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !agentStatus?.is_online
      await api.post('/chat/agent/status', { isOnline: newStatus })
      setAgentStatus(prev => ({ ...prev, is_online: newStatus }))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const assignToMe = async (sessionId) => {
    try {
      await api.patch(`/chat/sessions/${sessionId}/assign`)
      fetchSessions()
      alert('Session assigned to you!')
    } catch (error) {
      console.error('Error assigning session:', error)
      alert('Failed to assign session')
    }
  }

  const closeSession = async (sessionId) => {
    if (!confirm('Are you sure you want to close this chat?')) return

    try {
      await api.patch(`/chat/sessions/${sessionId}/close`)
      setSelectedSession(null)
      setMessages([])
      fetchSessions()
    } catch (error) {
      console.error('Error closing session:', error)
      alert('Failed to close session')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'support')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin or support privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
        <TopScroll />
        <Navbar 
          activePrimary="Support"
          currentMenuColor="#FF6B35"
          showLeftList={false}
          onLogoClick={() => navigate('/')}
        />
      </header>

      <div className="flex-1" style={{ paddingTop: '240px', paddingBottom: '3rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
            >
              ← Back to Admin Panel
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Support Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage customer chat sessions</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleOnlineStatus}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    agentStatus?.is_online
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  {agentStatus?.is_online ? '🟢 Online' : '🔴 Offline'}
                </button>
                <button
                  onClick={() => {
                    fetchSessions()
                    if (selectedSession) fetchMessages()
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-800">{stats.waiting}</div>
                  <div className="text-sm text-yellow-700 font-medium">Waiting</div>
                </div>
                <Clock size={40} className="text-yellow-500" />
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-800">{stats.active}</div>
                  <div className="text-sm text-green-700 font-medium">Active Chats</div>
                </div>
                <MessageCircle size={40} className="text-green-500" />
              </div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-800">{stats.total}</div>
                  <div className="text-sm text-blue-700 font-medium">Total Sessions</div>
                </div>
                <Users size={40} className="text-blue-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            {['all', 'waiting', 'active', 'closed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Chat Sessions ({sessions.length})</h3>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No sessions found</p>
                  </div>
                ) : (
                  sessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSession?.id === session.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {session.customer_display_name || session.customer_name || 'Guest'}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1 line-clamp-1">{session.subject}</div>
                      {session.customer_email && (
                        <div className="text-xs text-gray-500">{session.customer_email}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(session.last_message_at).toLocaleString()}
                      </div>
                      {session.unread_count > 0 && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {session.unread_count} new
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col" style={{ height: '650px' }}>
              {!selectedSession ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                    <p>Select a chat session to view messages</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">
                          {selectedSession.customer_display_name || selectedSession.customer_name || 'Guest'}
                        </div>
                        <div className="text-sm text-orange-100">{selectedSession.customer_email}</div>
                        <div className="text-xs text-orange-100">{selectedSession.subject}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedSession.status === 'waiting' && (
                          <button
                            onClick={() => assignToMe(selectedSession.id)}
                            className="px-3 py-1.5 bg-white text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50"
                          >
                            Assign to Me
                          </button>
                        )}
                        {selectedSession.status !== 'closed' && (
                          <button
                            onClick={() => closeSession(selectedSession.id)}
                            className="px-3 py-1.5 bg-white text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50"
                          >
                            Close Chat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>No messages yet. Customer messages will appear here.</p>
                        <p className="text-sm mt-2">👈 Customer messages appear on the left</p>
                        <p className="text-sm">Your replies appear on the right 👉</p>
                      </div>
                    )}
                    {messages.map((msg, idx) => (
                      <div
                        key={msg.id || idx}
                        className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender_type === 'agent'
                              ? 'bg-orange-500 text-white'
                              : 'bg-blue-100 border-2 border-blue-300 text-gray-900'
                          }`}
                        >
                          {msg.sender_name && (
                            <div className={`text-xs font-semibold mb-1 ${
                              msg.sender_type === 'agent' ? 'text-orange-100' : 'text-blue-700'
                            }`}>
                              {msg.sender_type === 'customer' ? '👤 ' : '🎧 '}{msg.sender_name}
                            </div>
                          )}
                          <div className="text-sm">{msg.message}</div>
                          <div className={`text-xs mt-1 ${
                            msg.sender_type === 'agent' ? 'text-orange-100' : 'text-blue-600'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {selectedSession.status !== 'closed' && (
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                      <div className="mb-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>💬 Type your response to {selectedSession.customer_display_name || selectedSession.customer_name || 'customer'}</span>
                        <span className="text-green-600">● Connected</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your reply and press Enter..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                        >
                          <Send size={20} />
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedSession.status === 'closed' && (
                    <div className="p-4 border-t border-gray-200 bg-gray-100 rounded-b-lg">
                      <div className="text-center text-gray-600">
                        🔒 This chat has been closed
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
