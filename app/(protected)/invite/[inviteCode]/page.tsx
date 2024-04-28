import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { toast } from "sonner";

interface PageProps {
  params: { inviteCode: string };
  searchParams: { role?: string };
}

const allowedRoles = ["LECTURER", "STUDENT"] as const;

const Page = async ({ params, searchParams }: PageProps) => {
  console.log(params.inviteCode);
  console.log(searchParams.role);
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

  const server = await db.server.findUnique({
    where: { inviteCode },
    include: { members: true },
  });

  if (!server) {
    return redirect("/");
  }

  // Extract the domain from the user's email
  const userEmail = profile.email;
  if(!userEmail){
    return redirect('/actions')
  }
  const userDomain = userEmail.substring(userEmail.lastIndexOf("@") + 1);

  // Check if the user's domain matches the server's domain
  if (userDomain !== server.domain) {

    return redirect("/domain-error");
  }

  const existingServer = server.members.some(
    (member) => member.userId === profile.id
  );

  if (existingServer) {
    return redirect(`/servers/${server.id}`);
  }

  const updatedServer = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [
          {
            userId: profile.id,
            role: allowedRoles.includes(role as typeof allowedRoles[number])
              ? (role as typeof allowedRoles[number])
              : "STUDENT",
          },
        ],
      },
    },
  });

  if (updatedServer) {
    return redirect(`/servers/${updatedServer.id}`);
  }

  return null;
};

export default Page;