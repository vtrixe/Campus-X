import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ServerSidebar } from "../_components/server-sidebar";
import { Sidebar, SidebarSkeleton } from "../_components/Sidebar";
import { Suspense } from "react";

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


<div className="flex h-screen">
  {/* Render main sidebar always collapsed on mobile */}
  <div className="hidden lg:block"> {/* Hide on mobile */}
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />
    </Suspense>
  </div>
  {/* Render content */}
  <div className="flex-1 flex justify-center lg:justify-start">
    <div className="max-w-5xl w-full">
      {children}
    </div>
  </div>
  {/* Render server sidebar only on desktop */}
  <div className="hidden lg:block"> {/* Hide on mobile */}
    <Suspense fallback={<SidebarSkeleton />}>
      <ServerSidebar serverId={params.serverId} />
    </Suspense>
  </div>
</div>


  );
};

export default ServerIdLayout;