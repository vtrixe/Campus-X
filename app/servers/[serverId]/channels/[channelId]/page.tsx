
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChatHeader } from "../_components/header";
import { ChatInput } from "../_components/input";
import { ChatMessages } from "../_components/messages";
import { Conference } from "@/components/conference";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
    const user = await currentUser();


  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId : user?.id
    }
  });

  if (!channel || !member) {
    redirect("/");
  }

  return ( 
    <>
    <div className=" flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />

{channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

{channel.type === ChannelType.AUDIO && (
        <Conference
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <Conference
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
      
    </div>
    </>
   );
}
 
export default ChannelIdPage;