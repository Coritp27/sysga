"use client";

import React from "react";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { UserInfo } from "./user-info";
import { Logo, LogoIcon } from "../../logo";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stroke bg-white px-4 shadow-sm dark:border-stroke-dark dark:bg-gray-dark md:px-6 lg:px-8">
      {/* Left Section - Menu Button & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg border p-2 transition-colors hover:bg-gray-50 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A]"
          aria-label="Toggle Sidebar"
        >
          <MenuIcon />
        </button>

        {/* Logo - Responsive */}
        <div className="flex items-center">
          {isMobile ? (
            <Link href="/admin" className="flex items-center">
              <LogoIcon />
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center">
              <Logo />
            </Link>
          )}
        </div>
      </div>

      {/* Right Section - User */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
