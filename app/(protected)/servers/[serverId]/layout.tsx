import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Container } from "../_components/container";
import { ServerSidebar } from "../_components/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentUser();
  const server = await db.server.findUnique({
    where: { id: params.serverId, members: { some: { userId: profile?.id } } },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-cente">


    <ServerSidebar serverId={params.serverId} />

  <Container>
   {children}
  </Container>

</div>
  );
};

export default ServerIdLayout;