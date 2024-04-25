/* eslint-disable no-unused-vars */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/zustand/use-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ServerItemProps {
  name: string;
  imageUrl: string;
  description: string;
  id: string;
}

export const ServerItem = ({ name, imageUrl, id, description }: ServerItemProps) => {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state: any) => state);
  const href = `/servers/${id}`;
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full h-auto",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}
    >
      <Link href={href}>
        <div className={cn("flex items-center w-full", collapsed ? "gap-x-0" : "gap-x-4")}>
          <div
            className={cn(
              "relative",
              collapsed ? "w-12 h-12" : "w-8 h-8",
              isActive && "ring-2 ring-accent"
            )}
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes={collapsed ? "(max-width: 640px) 100vw, 48px" : "32px"}
              className={cn("rounded-full")}
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <p className="truncate max-w-[140px]">{name}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
        </div>
      </Link>
    </Button>
  );
};
export const ServerItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6" />
      </div>
    </li>
  );
};
