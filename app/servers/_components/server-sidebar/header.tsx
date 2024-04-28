"use client";

import { ServerWithMembersWithProfiles } from "@/lib/types";
import { MemberRole, Server } from "@prisma/client";
import { ChevronDown, LogOut, Trash } from "lucide-react";
import { useDialog } from "@/zustand/use-dialogs";
import { Button } from "@/components/ui/button";

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
    <div className='flex flex-wrap items-center justify-between focus: outline-none'>
      <div className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        {server.name}
      </div>
      {isAdminorFaculty && !isStudent && (
        <button
          id='inviteNewMembers'
          onClick={() => onOpen("invite", { server })}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        >
          Invite New Members
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='updateSettingsAndRules'
          onClick={() => onOpen("editServerAdmin", { server })}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        >
          Update Settings and Rules
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='manageRolesAndPermissions'
          onClick={() => onOpen("members", { server })}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        >
          Manage Roles & Permissions
        </button>
      )}
      {isAdminorFaculty && !isStudent && (
        <button
          id='createNewChannel'
          onClick={() => onOpen("createChannel")}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        >
          Create New Channel
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='deleteServer'
          onClick={() => onOpen("deleteServer", { server })}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition text-red-600'
        >
          Delete Server <Trash className='h-4 w-4 ml-auto' />
        </button>
      )}
      {!isAdmin && (
        <button
          id='leaveServer'
          onClick={() => onOpen("leaveServer", { server })}
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition text-red-600'
        >
          Leave Server <LogOut className='h-4 w-4 ml-auto' />
        </button>
      )}
    </div>
  );
};
