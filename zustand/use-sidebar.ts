import { create } from "zustand";

interface SidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  collapsed: typeof window !== "undefined" ? localStorage.getItem("sidebarCollapsed") === "true" : true,
  onExpand: () => {
    set(() => ({ collapsed: false }));
    localStorage.setItem("sidebarCollapsed", "false");
  },
  onCollapse: () => {
    set(() => ({ collapsed: true }));
    localStorage.setItem("sidebarCollapsed", "true");
  },
}));
