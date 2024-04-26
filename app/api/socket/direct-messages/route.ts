import { NextApiRequest } from "next";
import { currentUser } from "@/lib/auth";
import { NextApiResponseServerIo } from "@/lib/types";

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(
  req: NextRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return new NextResponse("Method not Allowed" , { status : 405});
  }

  try {
    const user = await currentUser();
    const { content, fileUrl } = await req.json();
    const url = req.nextUrl;
    const conversationId = url.searchParams.get("conversationId");

    
    if (!user) {
        return new NextResponse("Unauthoritized" , { status : 401});
    }    
  
    if (!conversationId) {
        return new NextResponse("Bad Request , conversationId missing." , { status : 400});
    }
          
    if (!content) {
        return new NextResponse("Bad Request , content missing." , { status : 400});
    }


    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
                userId : user.id,
            }
          },
          {
            memberTwo: {
                userId : user.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            user : true,
          }
        },
        memberTwo: {
          include: {
            user : true,
          }
        }
      }
    })

    if (!conversation) {
        return new NextResponse("Conversation Not Found" , { status : 404});
    }

    const member = conversation.memberOne.userId === user.id ? conversation.memberOne : conversation.memberTwo

    if (!member) {
        return new NextResponse("Member Not Found" , { status : 404});
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user : true,
          }
        }
      }
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return NextResponse.json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return new NextResponse("Internal Error" , { status : 500});
  }
}