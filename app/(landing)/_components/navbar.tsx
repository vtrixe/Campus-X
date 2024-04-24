import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { currentUser } from "@/lib/auth";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg bg-white dark:bg-black flex items-center'>
      <div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
        <Logo />
        <div className='space-x-4 md:block md:w-auto flex items-center justify-between w-full'>
          {user ? (
            <>
              <Button size='sm' variant='outline' asChild>
                <Link href='/settings'>Dashboard</Link>
              </Button>
              <Button size='sm' variant='outline' asChild>
                <UserButton />
              </Button>
            </>
          ) : (
            <>
              <Button size='sm' variant='outline' asChild>
                <Link href='/auth/login'>Login</Link>
              </Button>
              <Button size='sm' asChild>
                <Link href='/auth/register'>Sign Up</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
