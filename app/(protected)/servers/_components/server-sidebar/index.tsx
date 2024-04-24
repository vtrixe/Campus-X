import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrapper } from "./wrapper";
import { Toggle } from "../Sidebar/toggle";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, Video } from "lucide-react";
import { Notebook } from "lucide-react";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { ServerHeader } from "./header";
import { redirect } from "next/navigation";
import { ServerWithMembersWithProfiles } from "@/lib/types";
import { ServerSearch } from "./search";
import { ServerSection } from "./serction";
import { Separator } from "@/components/ui/separator";
import { ServerChannel } from "./rooms";
import { ServerMember } from "./members";
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
  const role = server.members.find((member) => member.userId === user?.id)?.role;


  const serverforHeader = server as unknown as ServerWithMembersWithProfiles;


  
    return (

        <Wrapper >
        <div className="flex flex-col h-full text-primary w-full " >
             <ServerHeader

             server={serverforHeader}

        role={"ADMIN"}
      />

<ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Room",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Calls",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Meets",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.user.name || "",
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
            
          />

        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Rooms"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Calls"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Meets"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

{!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      
       
      </ScrollArea>
        </div>
   
        </Wrapper>

    )
  }