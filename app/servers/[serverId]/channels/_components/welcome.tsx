import { Hash, ServerCog } from "lucide-react";
import { FcIcons8Cup } from "react-icons/fc";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
};

export const ChatWelcome = ({
  name,
  type
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full flex items-center justify-center">
          <ServerCog className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to" : "Channel "}{name}
      </p>
      <p className=" text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}`
        }
      </p>
    </div>
  )
}