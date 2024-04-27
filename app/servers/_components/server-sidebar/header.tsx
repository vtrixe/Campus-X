"use client";

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
    <div className='flex flex-wrap items-center justify-between'>
      {isAdminorFaculty && !isStudent && (
        <button
          id='inviteNewMembers'
          onClick={() => onOpen("invite", { server })}
          className='action-button'
        >
          Invite New Members
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='updateSettingsAndRules'
          onClick={() => onOpen("editServerAdmin", { server })}
          className='action-button'
        >
          Update Settings and Rules
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='manageRolesAndPermissions'
          onClick={() => onOpen("members", { server })}
          className='action-button'
        >
          Manage Roles & Permissions
        </button>
      )}
      {isAdminorFaculty && !isStudent && (
        <button
          id='createNewChannel'
          onClick={() => onOpen("createChannel")}
          className='action-button'
        >
          Create New Channel
        </button>
      )}
      {isAdmin && !isStudent && (
        <button
          id='deleteServer'
          onClick={() => onOpen("deleteServer", { server })}
          className='action-button text-rose-500'
        >
          Delete Server <Trash className='h-4 w-4 ml-auto' />
        </button>
      )}
      {!isAdmin && (
        <button
          id='leaveServer'
          onClick={() => onOpen("leaveServer", { server })}
          className='action-button text-rose-500'
        >
          Leave Server <LogOut className='h-4 w-4 ml-auto' />
        </button>
      )}
    </div>
  );
};
