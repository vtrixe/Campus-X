import { create } from "zustand";

interface ServerSidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useServerSidebar = create<ServerSidebarStore>((set) => ({
  collapsed: false,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}));