import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import api from '../services/api';

export default function ChatHistory() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSessions();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/sessions/my');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} />, text: 'Waiting' },
      active: { color: 'bg-green-100 text-green-800', icon: <MessageCircle size={14} />, text: 'Active' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <CheckCircle size={14} />, text: 'Closed' }
    };
    return badges[status] || badges.closed;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar 
          activePrimary="Profile"
          menuColors={menuColors}
          currentMenuColor="#FF6B35"
          showLeftList={true}
          onLogoClick={() => navigate('/')}
        />
      </header>

      <div className="flex-1 bg-gray-50" style={{ paddingTop: '220px', paddingBottom: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
            >
              ← Back to Profile
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle size={32} className="text-orange-500" />
              Chat History
            </h1>
            <p className="text-gray-600 mt-2">View your previous support conversations</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your chat history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No chat history yet</h3>
              <p className="text-gray-600 mb-4">You haven't started any support conversations.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sessions List */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
                  <h3 className="font-bold text-white">Your Conversations ({sessions.length})</h3>
                  <p className="text-xs text-orange-100">Click to view details</p>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                  {sessions.map(session => {
                    const badge = getStatusBadge(session.status);
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors ${
                          selectedSession?.id === session.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-gray-900">{session.subject}</div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${badge.color}`}>
                            {badge.icon}
                            {badge.text}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.created_at).toLocaleDateString()} at{' '}
                          {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {session.agent_id && (
                          <div className="text-xs text-gray-600 mt-1">🎧 Agent assigned</div>
                        )}
                        {session.unread_count > 0 && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              {session.unread_count} unread
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Messages Panel */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col" style={{ height: '650px' }}>
                {!selectedSession ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-semibold mb-2">Select a conversation</p>
                      <p className="text-sm">Click on a chat from the left to view messages</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">{selectedSession.subject}</div>
                          <div className="text-sm text-orange-100">
                            Started on {new Date(selectedSession.created_at).toLocaleDateString()} at{' '}
                            {new Date(selectedSession.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${getStatusBadge(selectedSession.status).color}`}>
                          {getStatusBadge(selectedSession.status).icon}
                          {getStatusBadge(selectedSession.status).text}
                        </span>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                          <p>No messages in this conversation yet</p>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div
                            key={msg.id || idx}
                            className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
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
                                  {msg.sender_type === 'agent' ? '🎧 ' : 'ℹ️ '}{msg.sender_name}
                                </div>
                              )}
                              <div className="text-sm">{msg.message}</div>
                              <div className={`text-xs mt-1 ${
                                msg.sender_type === 'customer' ? 'text-orange-100' : 'text-gray-500'
                              }`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Status Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                      {selectedSession.status === 'closed' ? (
                        <div className="text-center text-gray-600">
                          <span className="text-sm font-medium">🔒 This conversation has been closed</span>
                          {selectedSession.closed_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Closed on {new Date(selectedSession.closed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-600">
                          <span className="text-sm font-medium">
                            {selectedSession.status === 'active' ? '🟢 This conversation is active' : '⏳ Waiting for agent response'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Use the chat widget on homepage to continue this conversation
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
