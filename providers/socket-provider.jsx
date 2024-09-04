"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import { useAuthContext } from "@auth/useAuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuthContext();

  // Memoize the socket instance to prevent unnecessary re-creations
  const socketInstance = useMemo(() => {
    if (!user?.id) return null;

    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      return new ClientIO(process.env.NEXT_PUBLIC_REACT_APP_HOST_API_KEY, {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        query: { userId: user.id },
      });
    }

    return null;
  }, [user?.id]);

  useEffect(() => {
    if (socketInstance) {
      // Set up event listeners
      socketInstance.on("online-users", (msg) => {
        setOnlineUsers(msg);
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      setSocket(socketInstance);

      // Cleanup on component unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [socketInstance]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({ socket, isConnected, onlineUsers }),
    [socket, isConnected, onlineUsers]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
