"use client";
import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ClientOnly } from "@/components/ui/ClientOnly";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAuth();

  return (
    <ClientOnly
      fallback={
        <div className="flex items-center gap-3">
          <div className="size-12 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
        </div>
      }
    >
      <UserButton afterSignOutUrl="/" />
    </ClientOnly>
  );
}
