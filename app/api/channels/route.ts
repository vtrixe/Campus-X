import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request
) {
  try {


  const user = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId : user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.LECTURER]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            userId : user.id,
            name,
            type,
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
