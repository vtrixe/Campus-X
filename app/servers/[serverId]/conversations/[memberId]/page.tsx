
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversations";
import { currentUser } from "@/lib/auth";
import { ChatHeader } from "../../channels/_components/header";


interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

const MemberIdPage = async ({
  params,
  searchParams,
}: MemberIdPageProps) => {
  const user = await currentUser();


  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId : user?.id
    },
    include: {
      user : true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === user?.id ? memberTwo : memberOne;

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.user.image || ""}
        name={otherMember.user.name || "defaultName"}
        serverId={params.serverId}
        type="conversation"
      />
      {/* {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )} */}
      {/* {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )} */}
    </div>
   );
}
 
export default MemberIdPage;