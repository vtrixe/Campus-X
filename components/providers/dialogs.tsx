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
import { EditChannel } from "../dialogs/edit-channel";
import { DeleteChannel } from "../dialogs/delete-channel";
import { Attachment } from "../dialogs/attachments";
import { DeleteMessageModal } from "../dialogs/delete-message";
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
       <EditChannel />
       <DeleteChannel />
       <Attachment />
       <DeleteMessageModal />
    </>
  )
}