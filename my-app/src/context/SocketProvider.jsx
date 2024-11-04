import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = (props) => {
  // Configure the socket connection with extra options
  const socket = useMemo(() => {
    return io("https://video-streaming-app-server-psi.vercel.app", {
      transports: ["websocket"], // Ensure WebSocket is used
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 1000, // Delay between reconnections
      timeout: 20000, // Connection timeout
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
