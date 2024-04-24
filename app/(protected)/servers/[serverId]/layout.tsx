import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ServerSidebar } from "../_components/server-sidebar";
import { Sidebar } from "../_components/Sidebar";

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
    <div className="h-full w-full grid grid-cols-[auto_1fr_auto]">
      <Sidebar />
      <main className="p-4">{children}</main>
      <ServerSidebar serverId={params.serverId} />
    </div>
  );
};

export default ServerIdLayout;