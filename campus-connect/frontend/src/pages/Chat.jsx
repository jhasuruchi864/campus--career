import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  FolderGit2,
  Paperclip,
  Code2,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Chat = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeChannelType, setActiveChannelType] = useState('project'); // 'project' or 'direct'
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [projectsList, setProjectsList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Direct chat targets
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchProjects = async () => {
    try {
      const data = await api.get('/projects');
      setProjectsList(data || []);
      if (data && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      const others = (data || []).filter((s) => s.user_id !== user?.id);
      setStudentsList(others);
      if (others.length > 0 && !selectedStudentId) {
        setSelectedStudentId(others[0].user_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;
    try {
      if (activeChannelType === 'project' && selectedProjectId) {
        const data = await api.get(`/chat/project/${selectedProjectId}`);
        setMessages(data || []);
      } else if (activeChannelType === 'direct' && selectedStudentId) {
        const data = await api.get(`/chat/direct/${selectedStudentId}`);
        setMessages(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Polling for real-time responsiveness
    return () => clearInterval(interval);
  }, [activeChannelType, selectedProjectId, selectedStudentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const text = newMessage;
    setNewMessage('');

    try {
      if (activeChannelType === 'project') {
        await api.post(`/chat/project/${selectedProjectId}`, {
          project_id: selectedProjectId,
          message: text
        });
      } else {
        await api.post(`/chat/direct/${selectedStudentId}`, {
          receiver_id: selectedStudentId,
          message: text
        });
      }
      fetchMessages();
    } catch (err) {
      addToast(err.message || 'Could not send message.', 'error');
    }
  };

  const handleInsertSnippet = () => {
    setNewMessage((prev) => `${prev}\n\`\`\`javascript\n// Quick code snippet / API spec:\nconst config = { timeout: 5000 };\n\`\`\`\n`);
  };

  const activeProject = projectsList.find((p) => p.id === selectedProjectId);
  const activeStudent = studentsList.find((s) => s.user_id === selectedStudentId);

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>
          Campus Team Rooms & Live Messaging
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Coordinate architectural decisions, share code snippets, and collaborate with your capstone squad in real-time.
        </p>
      </div>

      {/* Main Chat Layout */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '620px', padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        {/* Sidebar Channels List */}
        <div style={{ borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-subtle)', display: 'flex', flexDirection: 'column' }}>
          {/* Channel Type Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0.5rem' }}>
            <button
              onClick={() => setActiveChannelType('project')}
              className={`btn btn-sm ${activeChannelType === 'project' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, fontSize: '0.75rem', gap: '4px' }}
            >
              <FolderGit2 size={14} /> Projects
            </button>
            <button
              onClick={() => setActiveChannelType('direct')}
              className={`btn btn-sm ${activeChannelType === 'direct' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, fontSize: '0.75rem', gap: '4px' }}
            >
              <Users size={14} /> 1-on-1 DMs
            </button>
          </div>

          {/* Channels scroll list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
            {activeChannelType === 'project' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', marginBottom: '4px', paddingLeft: '8px' }}>
                  Project Channels
                </span>
                {projectsList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: selectedProjectId === p.id ? 'var(--color-accent-light)' : 'transparent',
                      color: selectedProjectId === p.id ? 'var(--color-accent)' : 'var(--color-text-main)',
                      fontWeight: selectedProjectId === p.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <FolderGit2 size={16} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      # {p.title}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', marginBottom: '4px', paddingLeft: '8px' }}>
                  Classmates & Peers
                </span>
                {studentsList.map((s) => (
                  <button
                    key={s.user_id}
                    onClick={() => setSelectedStudentId(s.user_id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: selectedStudentId === s.user_id ? 'var(--color-accent-light)' : 'transparent',
                      color: selectedStudentId === s.user_id ? 'var(--color-accent)' : 'var(--color-text-main)',
                      fontWeight: selectedStudentId === s.user_id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.full_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg-surface)' }}>
          {/* Chat Header */}
          <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-surface)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>
                {activeChannelType === 'project' ? (
                  activeProject ? `# ${activeProject.title}` : 'Project Room'
                ) : (
                  activeStudent ? `@ ${activeStudent.full_name} (${activeStudent.university})` : 'Direct Conversation'
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {activeChannelType === 'project' ? 'Team Channel • Real-time synchronization active' : 'Direct encrypted message'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleInsertSnippet} className="btn btn-outline btn-xs" title="Share Code Snippet">
                <Code2 size={14} /> Snippet
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-subtle)', margin: 'auto 0' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages in this channel yet.</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Start the conversation by sending an update or question below!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: isMe ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <img
                      src={msg.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={msg.sender_name}
                      style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{msg.sender_name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        style={{
                          backgroundColor: isMe ? 'var(--color-primary)' : 'var(--color-bg-subtle)',
                          color: isMe ? '#ffffff' : 'var(--color-text-main)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message or share update (press Enter to send)..."
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
