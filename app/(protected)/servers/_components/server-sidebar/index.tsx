import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrapper } from "./wrapper";
import { Toggle } from "../Sidebar/toggle";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, Video } from "lucide-react";
import { Notebook } from "lucide-react";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ServerHeader } from "./header";
import { redirect } from "next/navigation";
import { ServerWithMembersWithProfiles } from "@/lib/types";

interface ServerSidebarProps {
    serverId: string;
  }

  
const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
  };
  
  const roleIconMap = {
    [MemberRole.STUDENT]: null,
    [MemberRole.LECTURER]: <Notebook className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
  }
  
  export const ServerSidebar = async ({
    serverId
  }: ServerSidebarProps) => {


    const user = await currentUser();
    
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
            user : true
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  if(!server){
    return redirect ("/")
  }

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.userId !== user?.id)


  const serverforHeader = server as unknown as ServerWithMembersWithProfiles;


  
    return (

        <Wrapper >
        <div className="flex flex-col h-full text-primary w-full " >
             <ServerHeader

             server={serverforHeader}

        role={"ADMIN"}
      />
        </div>
   
        </Wrapper>

    )
  }