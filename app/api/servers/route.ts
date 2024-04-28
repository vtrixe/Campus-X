import { currentProfile } from "@/lib/current-user";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const user = await currentProfile();
    const role = await currentRole();

    if (role !== "ADMIN") {
      return new NextResponse("Only admins can Perform this action", { status: 401 });
    }

    const adminId = user?.id;

    if (!adminId) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const { name, imageUrl = "", domain } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        adminId: adminId,
        name: name,
        imageUrl: imageUrl, // Use imageUrl if provided, otherwise use an empty string
        domain: domain,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: "Root", userId: adminId }
          ]
        },
        members: {
          create: [
            { userId: adminId, role: "ADMIN" }
          ]
        }
      }
    });

    revalidatePath(`/servers`);

    return new NextResponse(JSON.stringify(server), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}