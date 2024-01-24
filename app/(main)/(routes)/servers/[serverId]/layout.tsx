
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";


const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return  redirect('/auth/login');
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return ( 
    <div className="h-full">
 <div className="hidden md:flex h-screen w-60 z-20 flex-col fixed top-[4rem] inset-y-0 right-0  dark:bg-green-600 bg-yellow-300">
  <ServerSidebar serverId={params.serverId} />
</div>

    <main className="h-full md:pl-60">
      {children}
    </main>
  </div>
   );
}
 
export default ServerIdLayout;