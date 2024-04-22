import { create } from "zustand";


export type DialogType = "createServerAdmin"


interface Store {
    type : DialogType | null;
    isOpen : boolean;
    onOpen : (type : DialogType) => void
    onClose:  () => void;

}


export const useDialog = create<Store>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type}),
    onClose: () => set({ type: null, isOpen: false })
  }));
  