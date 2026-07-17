"use client";

import { Menu } from "lucide-react";
import { AvatarMenu } from "@/components/common/AvatarMenu";
import { NotificationBell } from "@/components/common/NotificationBell";
import { SearchBar } from "@/components/common/SearchBar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Breadcrumb } from "./Breadcrumb";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-[#94a3b8] hover:bg-white/10 hover:text-foreground lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>
        <div className="hidden min-w-0 lg:block">
          <Breadcrumb />
        </div>
        <div className="ml-0 w-full max-w-md lg:ml-4">
          <SearchBar />
        </div>
      </div>
      <div className="ml-3 flex items-center gap-2 sm:gap-3">
        <NotificationBell />
        <ThemeToggle />
        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <AvatarMenu />
      </div>
    </header>
  );
}

export default Header;
