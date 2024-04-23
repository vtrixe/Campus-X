"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServerWithMembersWithProfiles } from "@/lib/types";
import { MemberRole, Server } from "@prisma/client";
import { ChevronDown, LogOut, Trash } from "lucide-react";
import { useDialog } from "@/zustand/use-dialogs";

interface HeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: HeaderProps) => {
  const { onOpen } = useDialog();
  const isAdmin = role === MemberRole.ADMIN;
  const isAdminorFaculty = isAdmin || role === MemberRole.LECTURER;
  const isStudent = role === MemberRole.STUDENT;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isAdminorFaculty && !isStudent && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            Invite New Members
          </DropdownMenuItem>
        )}
        {isAdmin && !isStudent && (
          <DropdownMenuItem
            onClick={() => onOpen("editServerAdmin", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
           Update Settings and Rules
          </DropdownMenuItem>
        )}
        {isAdmin && !isStudent && (
          <DropdownMenuItem

          onClick={() => onOpen("members", { server })}
          
          className="px-3 py-2 text-sm cursor-pointer">
            
            Manage Roles & Permissions
          </DropdownMenuItem>
        )}
        {isAdminorFaculty && !isStudent && (
          <DropdownMenuItem

          onClick={() => onOpen("createChannel")}
          
          className="px-3 py-2 text-sm cursor-pointer">
            Create New Channel
          </DropdownMenuItem>
        )}
        {isAdminorFaculty && !isStudent && <DropdownMenuSeparator />}
        {isAdmin && !isStudent && (
          <DropdownMenuItem

          onClick={() => onOpen("deleteServer", { server })}

          
          className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
            Delete Server <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
          onClick={() => onOpen("leaveServer", { server })}
          className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
            Leave Server <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};