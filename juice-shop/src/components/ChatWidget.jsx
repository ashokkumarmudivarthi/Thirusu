import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, Minimize2, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [view, setView] = useState('menu') // 'menu', 'predefined', 'chat'
  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [predefinedQueries, setPredefinedQueries] = useState([])
  const [agentsAvailable, setAgentsAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const pollingIntervalRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPredefinedQueries()
    checkAgentAvailability()
  }, [])

  useEffect(() => {
    if (session && isOpen && !isMinimized) {
      fetchMessages()
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [session, isOpen, isMinimized])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchPredefinedQueries = async () => {
    try {
      const response = await api.get('/chat/predefined-queries')
      setPredefinedQueries(response.data)
    } catch (error) {
      console.error('Error fetching predefined queries:', error)
    }
  }

  const checkAgentAvailability = async () => {
    try {
      const response = await api.get('/chat/agent-availability')
      setAgentsAvailable(response.data.available)
    } catch (error) {
      console.error('Error checking agent availability:', error)
    }
  }

  const startPolling = () => {
    if (pollingIntervalRef.current) return
    
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages()
    }, 3000) // Poll every 3 seconds
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const createSession = async (subject) => {
    try {
      setLoading(true)
      const response = await api.post('/chat/sessions', {
        subject,
        customerName: user?.name || 'Guest',
        customerEmail: user?.email || ''
      })
      setSession(response.data)
      setView('chat')
      setMessages([])
      
      // Add initial system message based on status
      if (response.data.status === 'waiting') {
        setMessages([{
          id: 'system-1',
          message: 'Thank you for contacting us! All our agents are currently busy. Please wait, an agent will be with you shortly (estimated wait: 2-5 minutes). You can send your question now and we\'ll respond as soon as possible.',
          sender_type: 'system',
          sender_name: 'System',
          created_at: new Date().toISOString()
        }])
      } else if (response.data.status === 'active') {
        setMessages([{
          id: 'system-1',
          message: 'You\'re connected with a support agent. How can we help you today?',
          sender_type: 'agent',
          sender_name: 'Support Agent',
          created_at: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to start chat session')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!session) return

    try {
      const response = await api.get(`/chat/sessions/${session.id}/messages`)
      setMessages(response.data)
      
      // Also fetch session data to check if status changed (waiting -> active)
      const sessionResponse = await api.get(`/chat/sessions/${session.id}`)
      if (sessionResponse.data.status !== session.status) {
        setSession(sessionResponse.data)
        // Update agent availability if session is now active
        if (sessionResponse.data.status === 'active') {
          setAgentsAvailable(true)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return

    try {
      const response = await api.post(`/chat/sessions/${session.id}/messages`, {
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

  const handlePredefinedQuery = (query) => {
    setMessages([
      { 
        id: Date.now(), 
        message: query.question, 
        sender_type: 'customer',
        created_at: new Date().toISOString()
      },
      { 
        id: Date.now() + 1, 
        message: query.answer, 
        sender_type: 'agent',
        sender_name: 'Auto-Response',
        created_at: new Date().toISOString()
      }
    ])
    setView('predefined')
  }

  const handleStartLiveChat = () => {
    checkAgentAvailability()
    createSession('Live Chat Support')
  }

  const closeSession = async () => {
    if (!session) return
    
    try {
      await api.patch(`/chat/sessions/${session.id}/close`)
      setMessages([])
      setSession(null)
      setView('menu')
      stopPolling()
      alert('Chat session closed. Thank you!')
    } catch (error) {
      console.error('Error closing session:', error)
      alert('Failed to close session')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setView('menu')
    setSession(null)
    setMessages([])
    stopPolling()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          ?
        </span>
      </button>
    )
  }

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl border-2 border-orange-500 p-4 cursor-pointer hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center gap-3">
          <MessageCircle size={24} className="text-orange-500" />
          <div>
            <div className="font-bold text-gray-900">Chat Support</div>
            {session && <div className="text-xs text-gray-500">Active chat session</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col" style={{ maxHeight: 'calc(100vh - 100px)', height: '500px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={24} />
          <div>
            <div className="font-bold">Chat Support</div>
            <div className="text-xs text-orange-100">
              {session?.status === 'active' ? '🟢 Agent connected' : agentsAvailable ? '🟢 Agents available' : '🔴 Offline - Auto responses'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-orange-600 p-1 rounded"
          >
            <Minimize2 size={20} />
          </button>
          <button
            onClick={handleClose}
            className="hover:bg-orange-600 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'menu' && (
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How can we help you?</h3>
            
            <button
              onClick={() => setView('predefined')}
              className="w-full p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={24} className="text-orange-500" />
                <div>
                  <div className="font-semibold text-gray-900">Quick Answers</div>
                  <div className="text-sm text-gray-600">Browse common questions</div>
                </div>
              </div>
            </button>

            <button
              onClick={handleStartLiveChat}
              disabled={loading}
              className="w-full p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-left transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={24} />
                <div>
                  <div className="font-semibold">Chat with Us</div>
                  <div className="text-sm text-orange-100">
                    {agentsAvailable ? 'Connect with an agent' : 'Leave a message'}
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {view === 'predefined' && !session && (
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={() => setView('menu')}
              className="text-orange-500 hover:text-orange-600 mb-4 text-sm font-medium"
            >
              ← Back to menu
            </button>
            
            <h3 className="font-bold text-gray-900 mb-4">Quick Answers</h3>
            
            <div className="space-y-3">
              {predefinedQueries.map(query => (
                <button
                  key={query.id}
                  onClick={() => handlePredefinedQuery(query)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border border-gray-200"
                >
                  <div className="font-medium text-gray-900 text-sm mb-1">{query.question}</div>
                  <div className="text-xs text-gray-600 line-clamp-2">{query.answer}</div>
                </button>
              ))}
            </div>

            {messages.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-bold text-gray-900 mb-2">Question:</div>
                <div className="text-sm text-gray-700 mb-3">{messages[0]?.message}</div>
                <div className="font-bold text-gray-900 mb-2">Answer:</div>
                <div className="text-sm text-gray-700">{messages[1]?.message}</div>
              </div>
            )}
          </div>
        )}

        {(view === 'chat' || session) && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="mb-2">
                    {agentsAvailable 
                      ? 'Connected! Type your message below.' 
                      : 'All agents are busy. Send a message and we\'ll respond within 5 minutes.'}
                  </p>
                  {!agentsAvailable && (
                    <div className="text-xs text-orange-600 font-semibold mt-2">
                      ⏱️ Estimated wait: 2-5 minutes
                    </div>
                  )}
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender_type === 'customer'
                        ? 'bg-orange-500 text-white'
                        : msg.sender_type === 'system'
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {(msg.sender_type === 'agent' || msg.sender_type === 'system') && msg.sender_name && (
                      <div className={`text-xs font-semibold mb-1 ${
                        msg.sender_type === 'system' ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {msg.sender_name}
                      </div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-1 ${msg.sender_type === 'customer' ? 'text-orange-100' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {session && session.status === 'waiting' && (
                <div className="mb-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-center">
                  ⏳ Waiting for agent... Your message will be seen when an agent connects
                </div>
              )}
              {session && session.status === 'active' && (
                <div className="mb-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 text-center">
                  ✓ Connected with support agent
                </div>
              )}
              {session && session.status === 'closed' && (
                <div className="mb-2 text-xs text-gray-700 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-center">
                  🔒 This chat session has been closed
                </div>
              )}
              {session && session.status !== 'closed' && (
                <>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={session?.status === 'waiting' ? 'Send your question...' : 'Type your message...'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <button
                    onClick={closeSession}
                    className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 hover:bg-red-50 rounded transition-colors"
                  >
                    Close Chat
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
