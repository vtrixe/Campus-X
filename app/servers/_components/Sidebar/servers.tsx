/* eslint-disable no-unused-vars */
"use client"
import React from "react";
import { useSidebar } from "@/zustand/use-sidebar";
import { Server } from "@prisma/client";
import { ServerItem, ServerItemSkeleton } from "./server-item";

interface ServersProps {
  data: (Server & {})[];
}

export const Servers = ({ data }: ServersProps) => {
  const { collapsed } = useSidebar((state: any) => state);
  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Servers</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((server) => (
          <ServerItem
            key={server.id}
            id={server.id}
            name={server.name || "Unknown"}
            imageUrl={server.imageUrl || "defaultImageURL"}
            description={""}
          />
        ))}
      </ul>
    </div>
  );
};
