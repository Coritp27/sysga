"use client";

import React from "react";
import { SearchIcon } from "../../../assets/icons";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
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
          className="rounded-lg border p-2 transition-colors hover:bg-gray-50 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
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

      {/* Center Section - Search (Desktop only) */}
      <div className="hidden flex-1 max-w-md lg:block lg:mx-8">
        <div className="relative">
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:focus:bg-dark-3"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Button (Mobile only) */}
        <button className="rounded-lg border p-2 transition-colors hover:bg-gray-50 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden">
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggleSwitch />

        {/* Notifications */}
        <Notification />

        {/* User Info */}
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
