"use client"
import React from 'react';
import Image from 'next/image';
import ReactTooltip, { Tooltip } from 'react-tooltip';
import Logo from "@/public/png/logo-no-background.png"
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '../auth/user-button';
import { ServerCog } from 'lucide-react';

const Navbar = () => {
  const router=useRouter();
  return (
    <nav className="bg-blue-400 dark:bg-purple-400 shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center" data-tip="Campus -x">
              <Image
                src={Logo}
                alt='logo'
                height={50}
                width={50}
              />
            </div>
          </div>

          <div className="flex justify-end items-center space-x-4">
            <button className="text-black px-3 py-2 rounded-md text-sm font-medium" aria-label="About Us">
              About Us
            </button>
            <button
              data-tip="Settings"
              className="text-black px-3 py-2 rounded-md text-sm font-medium flex items-center"
              aria-label="Settings"
              onClick={() => router.push('/settings')}
            >
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </button>
            <div data-tip="User">
              <UserButton />
            </div>
            <button
              data-tip="Server"
              onClick={() => router.push('/')}
              className="text-black px-3 py-2 rounded-md text-sm font-medium flex items-center"

            >
              <ServerCog className="h-5 w-5 mr-1" />
              Servers
            </button>
            <Tooltip place="bottom" />
          </div>
        </div>
      </div>
    </nav>
  
  );
};

export default Navbar;
