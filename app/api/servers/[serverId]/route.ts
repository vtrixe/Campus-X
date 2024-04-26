import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
      where: { id: params.serverId, adminId: profile.id },
    });
    revalidatePath(`/servers`)
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
    const { name, imageUrl, domain } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.update({
      where: { id: params.serverId },
      data: { name, imageUrl, domain },
    });
    revalidatePath(`/servers/${params.serverId}`)
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}