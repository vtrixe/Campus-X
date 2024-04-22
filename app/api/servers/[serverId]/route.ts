import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        adminId : profile.id
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        adminId : profile.id
      },
      data: {
        name,
        imageUrl,
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}