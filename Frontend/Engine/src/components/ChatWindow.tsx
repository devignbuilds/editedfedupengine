import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { useAuth } from "../context/useAuth";
import { useSocket } from "../context/SocketContext";
import type { Message } from "../types/message";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, ShieldCheck } from "lucide-react";

interface ChatWindowProps {
  projectId: string;
}

const ChatWindow = ({ projectId }: ChatWindowProps) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
      const url =
        projectId === "general"
          ? `${apiBaseUrl}/chat/general`
          : `${apiBaseUrl}/chat/project/${projectId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [projectId, user?.token]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_project", projectId);

    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", handleMessage);

    // Fetch initial messages
    fetchMessages();

    return () => {
      socket.off("receive_message", handleMessage);
      socket.emit("leave_project", projectId);
    };
  }, [projectId, socket, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      projectId,
      senderId: user?._id,
      content: newMessage,
    };

    // We can emit via socket for real-time, but also use the new POST route for persistence if needed
    // The socket handler already saves to DB, so socket emit is sufficient for real-time + persistence
    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-card/50 border-0 rounded-none overflow-hidden relative">
      {/* Premium Header */}
      <div className="bg-background/80 backdrop-blur-md p-6 border-b border-border/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest italic flex items-center gap-2">
              Project Engine{" "}
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full not-italic">
                V1.0
              </span>
            </h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">
              Real-time Collaboration Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.98]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender._id === user?._id;
            const isPro =
              msg.sender.role === "admin" || msg.sender.role === "employee";

            return (
              <motion.div
                layout
                key={msg._id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 10,
                  x: isMe ? 20 : -20,
                }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`flex items-center gap-2 mb-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  <p className="text-[10px] uppercase font-black tracking-[0.1em] opacity-40">
                    {msg.sender.name}
                  </p>
                  {isPro && (
                    <div className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-md shadow-sm shadow-primary/20">
                      <ShieldCheck className="h-2.5 w-2.5 text-primary-foreground" />
                      <span className="text-[8px] font-black text-primary-foreground uppercase tracking-widest">
                        Pro Team
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-[85%] p-4 rounded-[1.5rem] border shadow-md transition-all hover:shadow-lg ${
                    isMe
                      ? "bg-foreground text-background border-foreground rounded-tr-none"
                      : "bg-card text-foreground border-border/60 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>

                <span className="text-[9px] text-muted-foreground mt-2 font-black uppercase tracking-widest opacity-40">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-background/50 backdrop-blur-xl border-t border-border/40">
        <form onSubmit={handleSendMessage} className="relative group mt-auto">
          <input
            type="text"
            placeholder="Initialize response..."
            className="w-full bg-muted/20 border-2 border-border/40 rounded-2xl pl-6 pr-16 py-4 text-sm text-foreground focus:ring-0 focus:border-primary/40 outline-none transition-all placeholder:text-muted-foreground/40 font-medium"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary h-11 w-11 rounded-xl text-primary-foreground hover:scale-105 active:scale-95 flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-primary/20"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <p className="text-[8px] text-center mt-4 text-muted-foreground font-black uppercase tracking-[0.2em] opacity-30">
          Engine Secure Transmission Channel
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
