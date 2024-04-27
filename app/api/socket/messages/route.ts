// // @ts-ignore
// import { NextApiRequest } from "next";
// import { NextApiResponseServerIo } from "@/lib/types";
// import { currentUser } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import Redis from 'ioredis'
// import kafka, { produceMessage } from "@/lib/kafka";

// export async function POST(
//   req: NextRequest,
//   res: NextApiResponseServerIo,
// ) {
//   if (req.method !== "POST") {
//     return new NextResponse("Method not Allowed", { status: 405 });
//   }

//   try {
//     const user = await currentUser();
//     const { content, fileUrl } = await req.json();

//     const pub = new Redis("");
//     console.log("Successfully connected PUb");
//     const sub = new Redis("");
//     sub.subscribe("MESSAGES");

//     await pub.publish("MESSAGES", JSON.stringify({ content, fileUrl }));
//     console.log("Message Successfully Published to Redis");

//     sub.on("message", async (channel, message) => {
//       if (channel === "MESSAGES") {
//         console.log("New message from Redis Publisher:", message);
//         const parsedMessage = JSON.parse(message);
//         console.log("Content:", parsedMessage.content);
//         console.log("File URL:", parsedMessage.fileUrl);
//         await produceMessage(message);
//         console.log("Message Produced to Kafka Broker");
//       }
//     });


//     const consumer = kafka.consumer({ groupId: "default" });

//     console.log("consumer started");

//     // Connect the consumer
//     await consumer.connect();

//     console.log("Consmer connected");

//     // Check if the consumer is connected before accessing its properties


//     await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

//     console.log("consumer Subscriber");

//     await consumer.run({
//       autoCommit: true,
//       eachMessage: async ({ message, pause }) => {
//         if (!message.value) return;
//         console.log(`New Message Recv..`);

//         const { contentKafka, fileUrlKafka } = JSON.parse(message.value.toString());

//         const url = req.nextUrl;
//         const channelId = url.searchParams.get("channelId");
//         const serverId = url.searchParams.get("serverId");
//         if (!user) {
//           return new NextResponse("Unauthoritized", { status: 401 });
//         }

//         if (!serverId || !channelId || !content) {
//           return new NextResponse("Bad Request", { status: 400 });
//         }

//         const server = await db.server.findFirst({
//           where: {
//             id: serverId,
//             members: {
//               some: {
//                 userId: user.id
//               }
//             }
//           },
//           include: {
//             members: true,
//           }
//         });

//         if (!server) {
//           return new NextResponse("Server Not found", { status: 404 });
//         }

//         const channel = await db.channel.findFirst({
//           where: {
//             id: channelId,
//             serverId: serverId,
//           }
//         });

//         if (!channel) {
//           return new NextResponse("Channel Not found", { status: 404 });
//         }

//         const member = server.members.find((member) => member.userId === user.id);

//         if (!member) {
//           return new NextResponse("Member not Found", { status: 404 });
//         }

//         const dbmessage = await db.message.create({
//           data: {
//             content: contentKafka, // Corrected the property name to 'content'
//             fileUrl: fileUrlKafka, // Corrected the property name to 'fileUrl'
//             channelId: channelId,
//             memberId: member.id,
//           },
//           include: {
//             member: {
//               include: {
//                 user: true
//               }
//             }
//           }
//         });

//         const channelKey = `chat:${channelId}:messages`;

//         revalidatePath(`/servers/${serverId}/conversations/${channelId}`);

//         res?.socket?.server?.io?.emit(channelKey, message);

//         return NextResponse.json(dbmessage)


     
//       },

  
      
//     });

    
//   } catch (error) {
//     console.log("[MESSAGES_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }



import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";


export  async function POST(
  req: NextRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return new NextResponse ("Method not Allowed" , {status : 405
    })
  }

  try {

    const user = await currentUser();

    const { content, fileUrl } = await req.json();
    

  
    const url = req.nextUrl;
    const channelId = url.searchParams.get("channelId");
    const serverId = url.searchParams.get("serverId");
    if (!user) {
        return new NextResponse("Unauthoritized" , { status : 401});
    }    
  
    if (!serverId) {
        return new NextResponse("Bad Request" , { status :400})
    }
      
    if (!channelId) {
        return new NextResponse("Bad Request" , { status :400})
    }
          
    if (!content) {
        return new NextResponse("Bad Request" , { status :400})
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId : user.id
          }
        }
      },
      include: {
        members: true,
      }
    });

    if (!server) {
        return new NextResponse("Server Not found" , { status :404})
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      }
    });

    if (!channel) {
        return new NextResponse("Channel Not found" , { status :404})
    }

    const member = server.members.find((member) => member.userId === user.id);

    if (!member) {
        return new NextResponse("Member not Found" , { status :404})
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user : true
          }
        }
      }
    });

    const channelKey = `chat:${channelId}:messages`;

    revalidatePath(`/servers/${serverId}/conversations/${channelId}`);

    res?.socket?.server?.io?.emit(channelKey, message);

    return NextResponse.json(message)
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal error" , { status :500})
  }
}