"use client";
import { useSocket } from "../providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-red-600 text-white border-none"
      >
        Disconnected : Polling
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-green-600 text-white border-none"
    >
      Real Time Chat
    </Badge>
  )
}