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
            imageUrl={server.imageUrl || "https://imgs.search.brave.com/4ycNyuHKgXwDHzBplPwPQyBukX6eCB0sx2sWc8Qzqbs/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzU0LzE0LzY3/LzM2MF9GXzU1NDE0/NjcyNl9WWmZ5UEw2/TmlOVE1CeFFKNjhU/YmpzWkJDckZDZVZm/UC5qcGc"}
            description={""}
          />
        ))}
      </ul>
    </div>
  );
};
