import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextApiResponseServerIo } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest, res: NextApiResponseServerIo) {
  try {
    const user = await currentUser();
    console.log("User:", user);

    const url = req.nextUrl;
    const pathSegments = url.pathname.split("/");
    const directMessageId = pathSegments[pathSegments.length - 1];
    const conversationId = url.searchParams.get("conversationId");
    const { content } = await req.json();

    console.log("directMessageId:", directMessageId);
    console.log("conversationId:", conversationId);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Bad Request. Conversation ID missing", { status: 400 });
    }

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

    console.log("Conversation:", conversation);

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const member = conversation.memberOne.userId === user.id ? conversation.memberOne : conversation.memberTwo;
    console.log("Member:", member);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: { include: { user: true } }
      }
    });

    console.log("Direct Message:", directMessage);

    if (!directMessage || directMessage.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const canModify = isMessageOwner;

    console.log("isMessageOwner:", isMessageOwner);
    console.log("canModify:", canModify);

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    directMessage = await db.directMessage.update({
      where: {
        id: directMessageId as string,
      },
      data: {
        content,
      },
      include: {
        member: { include: { user: true } }
      }
    });

    console.log("Updated Direct Message:", directMessage);

    const updateKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return NextResponse.json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextApiResponseServerIo) {
  try {
    const user = await currentUser();
    console.log("User:", user);

    const url = req.nextUrl;
    const pathSegments = url.pathname.split("/");
    const directMessageId = pathSegments[pathSegments.length - 1];
    const conversationId = url.searchParams.get("conversationId");

    console.log("directMessageId:", directMessageId);
    console.log("conversationId:", conversationId);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Bad Request. Conversation ID missing", { status: 400 });
    }

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

    console.log("Conversation:", conversation);

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const member = conversation.memberOne.userId === user.id ? conversation.memberOne : conversation.memberTwo;
    console.log("Member:", member);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: { include: { user: true } }
      }
    });

    console.log("Direct Message:", directMessage);

    if (!directMessage || directMessage.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const canModify = isMessageOwner;

    console.log("isMessageOwner:", isMessageOwner);
    console.log("canModify:", canModify);

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    directMessage = await db.directMessage.update({
      where: {
        id: directMessageId as string,
      },
      data: {
        fileUrl: null,
        content: "This message has been deleted.",
        deleted: true,
      },
      include: {
        member: { include: { user: true } }
      }
    });

    console.log("Updated Direct Message:", directMessage);

    const updateKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, { messageId: directMessage.id, deleted: true });
    revalidatePath(`/conversations/${conversationId}`);

    return new NextResponse("Successful Request", { status: 200 });
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}