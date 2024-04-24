// useSidebar.tsx
import { create } from "zustand";

interface SidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  collapsed: true, // Set the default state to collapsed
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}));