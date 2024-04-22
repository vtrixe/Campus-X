"use client";

import { useEffect, useState } from "react";

import { InitialModal } from "../dialogs/initial-dialog-admin";
import { CreateServerAdmin } from "../dialogs/create-server-admin";
import {  InviteDialog } from "../dialogs/invite";
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

    </>
  )
}