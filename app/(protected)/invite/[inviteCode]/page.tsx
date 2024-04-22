import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

interface PageProps {
  params: {
    inviteCode: string;
  };
  searchParams: {
    role?: string;
  };
}



const allowedRoles = ["LECTURER", "STUDENT"] as const;

const Page = async ({ params, searchParams }: PageProps) => {
    console.log(params.inviteCode)
    console.log(searchParams.role)
  const { inviteCode } = params;
  const { role } = searchParams;

  const profile = await currentUser();

  if (!allowedRoles.includes(role as typeof allowedRoles[number] || "")) {
    return redirect("/");
  }

  if (!profile) {
    return redirect("/auth/login");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: { some: { userId: profile?.id } },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: { inviteCode: inviteCode },
    data: {
      members: {
        create: [
          {
            userId: profile?.id,
            role: allowedRoles.includes(role as typeof allowedRoles[number])
              ? (role as typeof allowedRoles[number])
              : "STUDENT",
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default Page;