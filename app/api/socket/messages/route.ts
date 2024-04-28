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



// import { NextApiResponseServerIo } from "@/lib/types";
// import { currentUser } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";


// export  async function POST(
//   req: NextRequest,
//   res: NextApiResponseServerIo,
// ) {
//   if (req.method !== "POST") {
//     return new NextResponse ("Method not Allowed" , {status : 405
//     })
//   }

//   try {

//     const user = await currentUser();

//     const { content, fileUrl } = await req.json();
    

  
//     const url = req.nextUrl;
//     const channelId = url.searchParams.get("channelId");
//     const serverId = url.searchParams.get("serverId");
//     if (!user) {
//         return new NextResponse("Unauthoritized" , { status : 401});
//     }    
  
//     if (!serverId) {
//         return new NextResponse("Bad Request" , { status :400})
//     }
      
//     if (!channelId) {
//         return new NextResponse("Bad Request" , { status :400})
//     }
          
//     if (!content) {
//         return new NextResponse("Bad Request" , { status :400})
//     }

//     const server = await db.server.findFirst({
//       where: {
//         id: serverId as string,
//         members: {
//           some: {
//             userId : user.id
//           }
//         }
//       },
//       include: {
//         members: true,
//       }
//     });

//     if (!server) {
//         return new NextResponse("Server Not found" , { status :404})
//     }

//     const channel = await db.channel.findFirst({
//       where: {
//         id: channelId as string,
//         serverId: serverId as string,
//       }
//     });

//     if (!channel) {
//         return new NextResponse("Channel Not found" , { status :404})
//     }

//     const member = server.members.find((member) => member.userId === user.id);

//     if (!member) {
//         return new NextResponse("Member not Found" , { status :404})
//     }

//     const message = await db.message.create({
//       data: {
//         content,
//         fileUrl,
//         channelId: channelId as string,
//         memberId: member.id,
//       },
//       include: {
//         member: {
//           include: {
//             user : true
//           }
//         }
//       }
//     });

//     const channelKey = `chat:${channelId}:messages`;

//     revalidatePath(`/servers/${serverId}/conversations/${channelId}`);

//     res?.socket?.server?.io?.emit(channelKey, message);

//     return NextResponse.json(message)
//   } catch (error) {
//     console.log("[MESSAGES_POST]", error);
//     return new NextResponse("Internal error" , { status :500})
//   }
// }

import { NextApiResponseServerIo } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import Redis from "ioredis";

const pub = new Redis(process.env.REDIS_URL!);
console.log("Successfully connected Pub");
const sub = new Redis(process.env.REDIS_URL!);
console.log("Successfully connected sub");

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
  logLevel: logLevel.ERROR,
});

let producer: null | Producer = null;
let consumer: null | Consumer = null;

async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  console.log("Producer Created Successfully");
  return producer;
}

async function createConsumer() {
  if (consumer) return consumer;
  const _consumer = kafka.consumer({ groupId: 'my-group' });
  await _consumer.connect();
  await _consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });
  consumer = _consumer;
  console.log("Consumer Created Successfully");
  return consumer;
}

async function produceMessage(message: any) {
  const producer = await createProducer();
  await producer.send({
    messages: [{
      key: `message-${Date.now()}`,
      value: JSON.stringify(message)
    }],
    topic: "MESSAGES",
  });
  console.log("Message Sent By Producer Successfully");
  return true;
}

// Kafka Consumer
const run = async () => {
  try {
    console.log("[CONSUMER] Connecting to Kafka consumer...");
    const consumer = await createConsumer();
    console.log("[CONSUMER] Kafka consumer connected successfully.");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("[CONSUMER] Received message from Kafka consumer...");
        const messageData = JSON.parse(message.value!.toString());

        try {
          console.log("[CONSUMER] Saving message to database...");
          const savedMessage = await db.message.create({
            data: {
              content: messageData.content,
              fileUrl: messageData.fileUrl,
              channelId: messageData.channelId,
              memberId: messageData.memberId,
            },
            include: { member: { include: { user: true } } }
          });
          console.log(`[CONSUMER] Message saved to database: ${savedMessage.content}`);
        } catch (error) {
          console.error(`[CONSUMER] Error saving message to database: ${error}`);
        }
      },
    });
  } catch (error) {
    console.error("[CONSUMER] Error:", error);
  }
};

run();

// Redis Subscription
sub.subscribe("MESSAGES", (err, count) => {
  if (err) {
    console.error("[REDIS_SUB] Error subscribing to channel:", err);
    return;
  }
  console.log(`[REDIS_SUB] Subscribed to ${count} channels`);
});

sub.on("message", async (channel, message) => {
  if (channel === "MESSAGES") {
    console.log("[REDIS_SUB] Received message from Redis sub:", message);
    try {
      await produceMessage(JSON.parse(message));
    } catch (error) {
      console.error("[REDIS_SUB] Error producing message to Kafka:", error);
    }
  }
});

export async function POST(
  req: NextRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return new NextResponse("Method not Allowed", { status: 405 });
  }

  try {
    console.log("[MESSAGES_POST] Checking user authentication...");
    const user = await currentUser();
    const { content, fileUrl } = await req.json();
    const url = req.nextUrl;
    const channelId = url.searchParams.get("channelId");
    const serverId = url.searchParams.get("serverId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    console.log("[MESSAGES_POST] Fetching server and channel details...");
    const server = await db.server.findFirst({
      where: { id: serverId as string, members: { some: { userId: user.id } } },
      include: { members: true },
    });

    if (!server) {
      return new NextResponse("Server Not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    });

    if (!channel) {
      return new NextResponse("Channel Not found", { status: 404 });
    }

    console.log("[MESSAGES_POST] Checking member details...");
    const member = server.members.find((member) => member.userId === user.id);

    if (!member) {
      return new NextResponse("Member not Found", { status: 404 });
    }

    console.log("[MESSAGES_POST] Creating message object...");
    const message = {
      content,
      fileUrl,
      channelId: channelId as string,
      memberId: member.id,
    };

    console.log("[MESSAGES_POST] Publishing message to Redis pub...");
    pub.publish("MESSAGES", JSON.stringify(message));

    console.log("[MESSAGES_POST] Emitting message to socket...");
    const channelKey = `chat:${channelId}:messages`;
    revalidatePath(`/servers/${serverId}/channels/${channelId}`);
    res?.socket?.server?.io?.emit(channelKey, message);

    console.log("[MESSAGES_POST] Returning response...");
    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}