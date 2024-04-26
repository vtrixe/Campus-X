/* eslint-disable react/jsx-no-undef */
import { Hash, LucideWand } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { FaMarker } from "react-icons/fa";
import { SocketIndicator } from "@/components/ui/indicator";
import { MobileToggle } from "./toggle";
import { ChatVideoButton } from "./video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <LucideWand className="w-5 h-5 " />
      )}
      {type === "conversation" && (
        <UserAvatar 
          src={imageUrl}
          className="h-8 w-8 md:h-8 md:w-8 mr-2"
        />
      )}
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  )
}