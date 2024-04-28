"use client";

import { 
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  sendMessage: (msg: string) => void; // Change this line
  messages: string[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: function (msg: string) {

  },
  messages: []
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);


  const sendMessage: SocketContextType["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      socket?.emit("event:message", { message: msg });
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log("From Server Msg Rec", msg);
    const { message } = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.SOCKET_URL! || 'http://localhost:8000', {
      path: "/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("message", onMessageRec);

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("message", onMessageRec);
      socketInstance.disconnect();
      setSocket(null);

    }
  }, [onMessageRec]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  )
}