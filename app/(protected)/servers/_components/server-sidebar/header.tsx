"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServerWithMembersWithProfiles } from "@/lib/types";
import { MemberRole, Server } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useDialog } from "@/zustand/use-dialogs";
interface HeaderProps {
    server : ServerWithMembersWithProfiles;
    role?: MemberRole
}


export const ServerHeader = ({
    server,
    role
  }: HeaderProps) => {

    const {onOpen} =useDialog();
  
    const isAdmin = role === MemberRole.ADMIN;
    const isAdminorFaculty = isAdmin || role === MemberRole.LECTURER
  
    return (
      <DropdownMenu >
        <DropdownMenuTrigger
          className="focus:outline-none" 
          asChild
        >
          <button
            className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
          >
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
        >
          {isAdminorFaculty && (
            <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
              className=" px-3 py-2 text-sm cursor-pointer"
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem

              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem

              className="px-3 py-2 text-sm cursor-pointer"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdminorFaculty && (
            <DropdownMenuItem

              className="px-3 py-2 text-sm cursor-pointer"
            >
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdminorFaculty && (
            <DropdownMenuSeparator />
          )}
          {isAdmin && (
            <DropdownMenuItem
        
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
             className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }