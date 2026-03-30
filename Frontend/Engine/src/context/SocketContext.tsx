import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

import { eventBus } from "../lib/eventBus";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user?.token) {
      // Use port 5001 to match backend .env
      const newSocket = io("http://localhost:5001", {
        auth: {
          token: user.token,
        },
      });

      newSocket.on("notification", (data) => {
        eventBus.emit("NOTIFICATION_RECEIVED", data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.off("notification");
        newSocket.disconnect();
      };
    }
  }, [user?.token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
