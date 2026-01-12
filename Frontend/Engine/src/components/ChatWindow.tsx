import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Message } from '../types/message';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  projectId: string;
}

const ChatWindow = ({ projectId }: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to Socket.io
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join_project', projectId);

    newSocket.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch initial messages
    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      projectId,
      senderId: user?._id,
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-muted p-4 border-b border-border">
        <h3 className="font-bold text-foreground">Project Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              layout
              key={msg._id}
              initial={{ opacity: 0, scale: 0.9, y: 10, x: msg.sender._id === user?._id ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              className={`flex flex-col ${
                msg.sender._id === user?._id ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl border shadow-sm ${
                  msg.sender._id === user?._id
                    ? 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                    : 'bg-muted text-muted-foreground border-border rounded-tl-none'
                }`}
              >
                <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">{msg.sender.name}</p>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-background/50 backdrop-blur-sm border-t border-border flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-primary h-10 w-10 rounded-full text-primary-foreground hover:opacity-90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
