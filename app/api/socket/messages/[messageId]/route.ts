import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";
import { NextRequest , NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextApiResponseServerIo } from "@/lib/types";

export async function PATCH(
    req : NextRequest ,
    res : NextApiResponseServerIo,


) {


  try {
    const user = await currentUser();
    const url = req.nextUrl;
    const channelId = url.searchParams.get("channelId");

    const serverId = url.searchParams.get("serverId");

    const pathSegments = url.pathname.split("/");
    const messageId = pathSegments[pathSegments.length - 1];


    const { content } = await req.json();

    if (!user) {
      return new NextResponse("Unauthoritized " , {status : 401});

    }

    if (!serverId) {
        return new NextResponse("Bad Request . ServerId missing " , { status : 400});
    }

    if (!channelId) {
        return new NextResponse("Bad Request . ChannelId missing " , { status : 400});
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId : user.id,

          }
        }
      },
      include: {
        members: true,
      }
    })

    if (!server) {
        return new NextResponse("  Server not Found " , { status : 404});
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
  
    if (!channel) {
        return new NextResponse(" Channel Not found " , { status : 404});
    }

    const member = server.members.find((member) => member.userId=== user.id);

    if (!member) {
        return new NextResponse("Member not Found " , { status : 404});
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user : true,
          }
        }
      }
    })

    if (!message || message.deleted) {
        return new NextResponse("Message not found " , { status : 404});
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.LECTURER;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
        return new NextResponse("Unauthoritzed action" , { status : 401});
    }

 
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return new NextResponse("Unauthoritized Action " , { status : 401});
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
                user : true,
            }
          }
        }
      })
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return new NextResponse("Internal Server Error" , { status : 500});
  }
}
export async function DELETE(req: NextRequest, res: NextApiResponseServerIo) {
    try {
      const user = await currentUser();
      const url = req.nextUrl;
      const channelId = url.searchParams.get("channelId");
      const serverId = url.searchParams.get("serverId");
      const pathSegments = url.pathname.split("/");
      const messageId = pathSegments[pathSegments.length - 1];
  
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!serverId) {
        return new NextResponse("Bad Request. ServerId missing", { status: 400 });
      }
  
      if (!channelId) {
        return new NextResponse("Bad Request. ChannelId missing", { status: 400 });
      }
  
      const server = await db.server.findFirst({
        where: {
          id: serverId as string,
          members: { some: { userId: user.id } }
        },
        include: { members: true }
      });
  
      if (!server) {
        return new NextResponse("Server not Found", { status: 404 });
      }
  
      const channel = await db.channel.findFirst({
        where: {
          id: channelId as string,
          serverId: serverId as string
        }
      });
  
      if (!channel) {
        return new NextResponse("Channel Not found", { status: 404 });
      }
  
      const member = server.members.find((member) => member.userId === user.id);
      if (!member) {
        return new NextResponse("Member not Found", { status: 404 });
      }
  
      let message = await db.message.findFirst({
        where: {
          id: messageId as string,
          channelId: channelId as string
        },
        include: { member: { include: { user: true } } }
      });
  
      if (!message || message.deleted) {
        return new NextResponse("Message not found", { status: 404 });
      }
  
      const isMessageOwner = message.memberId === member.id;
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.LECTURER;
      const canModify = isMessageOwner || isAdmin || isModerator;
  
      if (!canModify) {
        return new NextResponse("Unauthorized action", { status: 401 });
      }
  
      // Delete the message
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              user : true,
              
            }
          }
        }
      })
  
      const updateKey = `chat:${channelId}:messages:update`;
      res?.socket?.server?.io?.emit(updateKey, { messageId, deleted: true });
  
      return new NextResponse("Successful Request", { status: 200 });
    } catch (error) {
      console.log("[MESSAGE_ID]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }