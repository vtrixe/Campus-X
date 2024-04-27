/* eslint-disable no-unused-vars */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { currentUser } from "@/lib/auth";
import { DashboardIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/mode-toggle";
import { currentRole } from "@/lib/auth";
import { ServerCog } from "lucide-react";

export const Actions = async () => {
  const user = await currentUser();
  const role = await currentRole();

  return (
    <div className='flex items-center justify-end gap-x-2 ml-4 lg:ml-0'>
      {!user && <Button size='sm'>Login</Button>}
      {!!user && (
        <div className='flex items-center gap-x-4'>
          <Button
            size='sm'
            variant='ghost'
            className='text-muted-foreground hover:text-primary'
            asChild
          >
            <Link href={`/settings`}>
              <DashboardIcon className='h-5 w-5 lg:mr-2' />
              <span className='hidden lg:block'>
                {<div>User Settings</div>}
              </span>
            </Link>
          </Button>
          <Button
            size='sm'
            id=' Setup'
            variant='ghost'
            className='text-muted-foreground hover:text-primary'
            asChild
          >
            <Link href={`/setup`}>
              <ServerCog className='h-5 w-5 lg:mr-2' />
              <span className='hidden lg:block'>{<div>User Setup</div>}</span>
            </Link>
          </Button>
          <UserButton />
          <ModeToggle />
        </div>
      )}
    </div>
  );
};
