/* eslint-disable no-unused-vars */
"use client";

import { Server } from "@prisma/client";
import { useSidebar } from "@/zustand/use-sidebar";

import { ServerItem , ServerItemSkeleton } from "./server-item";

interface RecommendedProps {
  data: (Server & {

  })[];
};

export const Servers = ({
  data,
}: RecommendedProps) => {
  const { collapsed } = useSidebar((state: any) => state);

  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">
            Servers
          </p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((server) => (
      <ServerItem
                key={server.id}
                id={server.id}
                name={server.name || 'Unknown'}
                imageUrl={server.imageUrl || 'defaultImageURL'} description={""}  
    

    />
     ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <ServerItemSkeleton key={i} />
      ))}
    </ul>
  );
};

