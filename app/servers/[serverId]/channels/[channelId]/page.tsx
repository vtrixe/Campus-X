
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChatHeader } from "../_components/header";

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
    <div className=" flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {/* {channel.type === ChannelType.TEXT && (
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
      )} */}
      {/* {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )} */}
      {/* {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )} */}

      Channel page
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, doloribus perspiciatis. Consectetur qui culpa est nisi esse omnis rerum voluptates quidem eos iure illum, quisquam, architecto accusantium? Minus, deleniti? Inventore omnis suscipit beatae ducimus laborum minus facere obcaecati ullam. Aliquid debitis nihil perspiciatis excepturi sapiente totam expedita neque voluptate. Voluptate molestias quo nihil voluptatem aspernatur omnis eveniet dolor ut ratione culpa rem iure dolore voluptatibus doloremque dignissimos aut saepe ipsam dolorem similique cumque autem architecto, voluptas hic? Molestias sapiente mollitia quia natus nulla officia debitis sint modi fugiat? Rem minus consequuntur, dolores, laborum maiores molestias aperiam voluptas ducimus accusamus accusantium fuga pariatur. Dignissimos accusantium accusamus aperiam recusandae, voluptatem deleniti aspernatur iusto eaque, odit delectus perspiciatis iste a officiis, placeat asperiores modi ab cum nihil. Suscipit non quasi, doloremque neque maxime illum tenetur deserunt quas et perspiciatis repellat unde hic reiciendis consequuntur natus voluptatibus, modi ut, reprehenderit fugit atque dolorum nostrum? Quam distinctio itaque, est repellendus iure quo cupiditate illum nisi ipsa dolorem soluta ducimus qui animi consequuntur tempore, vitae minus in voluptas aut obcaecati perferendis dicta, eius cum sint? Minima, deleniti et totam quis architecto odio corporis, temporibus dolore qui soluta doloremque explicabo molestiae suscipit? Dignissimos, laborum amet alias itaque rerum voluptatem velit ullam, ex dolor minima ipsam ducimus fuga illo accusamus provident labore hic excepturi incidunt pariatur eos voluptatibus! Fugiat explicabo soluta eaque. Earum dolorum a consectetur similique, harum eaque! Error iure iusto dolorum consectetur id laboriosam veritatis nemo eaque cumque accusantium. Architecto aliquid, voluptatem omnis obcaecati incidunt cumque quibusdam laudantium eaque commodi dolorem neque nemo veniam temporibus maiores, sint dignissimos molestiae facere quo quam. Esse nulla necessitatibus placeat, ex quaerat eum dolorem voluptates? Libero deleniti consectetur obcaecati assumenda asperiores quas corrupti laudantium quos sequi rem fugiat aspernatur commodi magni cum tempore sapiente aperiam quia, necessitatibus molestiae! Quaerat temporibus a sunt laboriosam maiores quia libero saepe optio soluta itaque reprehenderit, repudiandae necessitatibus commodi eius impedit. Voluptatibus officia unde accusamus maiores beatae saepe numquam! Vitae pariatur velit voluptas, illum totam repudiandae error nostrum libero! Quam praesentium non consequatur. Magni, laboriosam tempora! Quo consequuntur, error reprehenderit numquam quaerat similique magni perferendis quasi voluptatum dolor dolore quis saepe culpa velit beatae omnis officiis dolorum in, aspernatur dicta laudantium nihil veritatis. Voluptatum illo nam odio eveniet, similique saepe perspiciatis voluptate deserunt omnis est earum possimus enim velit totam optio aperiam incidunt. Non perspiciatis ad, ipsum doloremque explicabo, aliquam accusantium excepturi minima ducimus eos delectus sunt id! Dolorum, beatae? Delectus, quibusdam quasi soluta unde eum molestiae aspernatur velit blanditiis. Cumque dolorum sit harum! Harum quas animi reprehenderit iure impedit similique culpa ipsam maxime, quod ullam, odit, repellendus voluptas qui dolor. Fugiat dolor alias tempora. Consequuntur deleniti exercitationem harum a soluta.
      
      
    </div>
   );
}
 
export default ChannelIdPage;