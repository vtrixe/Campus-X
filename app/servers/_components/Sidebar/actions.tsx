"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useDialog } from "@/zustand/use-dialogs";


export const NavigationAction = () => {

    const { onOpen } = useDialog();


  return (
    <div>
      <ActionTooltip
        side="right"
        align="center"
        label="Add a server"
      >
        <button
          className="group flex items-center"
          onClick={()=> onOpen("createServerAdmin")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center">
            <Plus
              className="group-hover:text-white transition text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}