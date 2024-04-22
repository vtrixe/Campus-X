"use client";
import { useIsClient } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useServerSidebar } from "@/zustand/use-server-sidebar";
import { ToggleSkeleton } from "../Sidebar/toggle";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const isClient = useIsClient();
  const { collapsed } = useServerSidebar((state: any) => state);

  if (!isClient) {
    return (
      <aside className="fixed right-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-l border-[#2D2E35] z-50">
        <ToggleSkeleton />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed right-0 flex flex-col h-full bg-background border-l border-[#2D2E35] z-50",
        collapsed ? "w-[70px]" : "w-60"
      )}
    >
      {children}
    </aside>
  );
};