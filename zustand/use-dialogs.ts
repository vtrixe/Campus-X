import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";


export type DialogType = "createServerAdmin" | "invite" | "editServerAdmin" |"members" | "createChannel" | "leaveServer" |"deleteServer"




interface Data {
    server ?: Server
    channelType?: ChannelType;
}


interface Store {
    type: DialogType | null;
    data: Data;
    isOpen: boolean;
    onOpen: (type: DialogType, data?: Data) => void;
    onClose: () => void;
}


export const useDialog = create<Store>((set) => ({
    type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
  }));
  