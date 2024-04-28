import { Wrapper } from "./wrapper";
import { Toggle, ToggleSkeleton } from "./toggle";
import { currentRole, currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Servers } from "./servers";
import { NavigationAction } from "./actions";
import { Actions } from "@/app/(protected)/_components/navbar/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";
import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const Sidebar = async (): Promise<JSX.Element> => {
  const session = await currentUser();
  const userId = session?.id;
  const role = await currentRole();

  if (!session) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: { members: { some: { userId: userId } } },
  });

  return (
    <>
      <Wrapper>
        <Toggle />
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <ScrollArea className="flex-1 w-full">
          <Servers data={servers} />
          {role === "ADMIN" && <NavigationAction />}
          {role === "USER" && <p>Join another Server</p>}
        </ScrollArea>

        {/* Separator */}
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full mx-auto my-4" />

        {/* Div for vertical alignment */}
        <div className="flex flex-col gap-4 mb-4 ml-4">
        <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary  "
            asChild
          >
            <Link href={`/settings`} className="">
              <DashboardIcon className="mr-2" />
              <span>User Settings</span>
            </Link>
          </Button>
          <ModeToggle />
          <LogoutButton>
            <ExitIcon className='h-4 w-4 mr-2' />
        </LogoutButton>
          
        </div>
      </Wrapper>
    </>
  );
};
export const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
      <ToggleSkeleton />
    </aside>
  );
};