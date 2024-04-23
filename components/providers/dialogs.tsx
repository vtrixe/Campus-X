"use client";

import { useEffect, useState } from "react";

import { InitialModal } from "../dialogs/initial-dialog-admin";
import { CreateServerAdmin } from "../dialogs/create-server-admin";
import {  InviteDialog } from "../dialogs/invite";
import { EditServerAdmin } from "../dialogs/edit-server-admin";
import { ManageMembers } from "../dialogs/members";
import { CreateChannel } from "../dialogs/create-channel";
import { LeaveServer } from "../dialogs/leave-server";
import { DeleteServer } from "../dialogs/delete-server";
export const Dialogs = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerAdmin />
       <InviteDialog />
       <EditServerAdmin />
       <ManageMembers />
       <CreateChannel />
       <LeaveServer />
       <DeleteServer />
    </>
  )
}