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
          const savedMessage = await db.directMessage.create({
            data: {
              content: messageData.content,
              fileUrl: messageData.fileUrl,
              conversationId: messageData.conversationId,
              memberId: messageData.memberId,
            },
            include: {
              member: {
                include: {
                  user: true,
                }
              }
            },
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
    console.log("[DIRECT_MESSAGES_POST] Checking user authentication...");
    const user = await currentUser();
    const { content, fileUrl } = await req.json();
    const url = req.nextUrl;
    const conversationId = url.searchParams.get("conversationId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Bad Request, conversationId missing.", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Bad Request, content missing.", { status: 400 });
    }

    console.log("[DIRECT_MESSAGES_POST] Fetching conversation details...");
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { userId: user.id } },
          { memberTwo: { userId: user.id } }
        ]
      },
      include: {
        memberOne: { include: { user: true } },
        memberTwo: { include: { user: true } }
      }
    });

    if (!conversation) {
      return new NextResponse("Conversation Not Found", { status: 404 });
    }

    const member = conversation.memberOne.userId === user.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) {
      return new NextResponse("Member Not Found", { status: 404 });
    }

    console.log("[DIRECT_MESSAGES_POST] Creating message object...");
    const message = {
      content,
      fileUrl,
      conversationId: conversationId as string,
      memberId: member.id,
    };

    console.log("[DIRECT_MESSAGES_POST] Publishing message to Redis pub...");
    pub.publish("MESSAGES", JSON.stringify(message));

    console.log("[DIRECT_MESSAGES_POST] Emitting message to socket...");
    const channelKey = `chat:${conversationId}:messages`;
    revalidatePath(`/conversations/${conversationId}`);
    res?.socket?.server?.io?.emit(channelKey, message);

    console.log("[DIRECT_MESSAGES_POST] Returning response...");
    return NextResponse.json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { DirectMessage } from "@prisma/client";
// import { currentUser } from "@/lib/auth";
// import { db } from "@/lib/db";

// const MESSAGES_BATCH = 10;

// export async function GET(
//   req: Request
// ) {
//   try {
//     const user = await currentUser();
//     const { searchParams } = new URL(req.url);

//     const cursor = searchParams.get("cursor");
//     const conversationId = searchParams.get("conversationId");

//     if (!user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
  
//     if (!conversationId) {
//       return new NextResponse("Conversation ID missing", { status: 400 });
//     }

//     let messages: DirectMessage[] = [];

//     if (cursor) {
//       messages = await db.directMessage.findMany({
//         take: MESSAGES_BATCH,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//              user : true,
//             }
//           }
//         },
//         orderBy: {
//           createdAt: "desc",
//         }
//       })
//     } else {
//       messages = await db.directMessage.findMany({
//         take: MESSAGES_BATCH,
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//                 user : true,
//             }
//           }
//         },
//         orderBy: {
//           createdAt: "desc",
//         }
//       });
//     }

//     let nextCursor = null;

//     if (messages.length === MESSAGES_BATCH) {
//       nextCursor = messages[MESSAGES_BATCH - 1].id;
//     }

//     return NextResponse.json({
//       items: messages,
//       nextCursor
//     });
//   } catch (error) {
//     console.log("[DIRECT_MESSAGES_GET]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }