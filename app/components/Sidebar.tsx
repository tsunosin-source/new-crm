"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClipboardIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

function SidebarItem({
  href,
  icon: Icon,
  label,
  isOpen,
}: {
  href: string;
  icon: any;
  label: string;
  isOpen: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        flex items-center
        rounded-lg transition-colors
        ${active ? "bg-blue-600 text-white" : "hover:bg-gray-200"}
      `}
    >
      <div
        className={`flex items-center h-12 w-full
        ${isOpen ? "gap-3 pl-5 pr-3 justify-start" : "gap-0 px-1 justify-center"}
      `}
      >
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7" />
        </div>

        {isOpen && (
          <span className="text-sm shrink-0 leading-none">{label}</span>
        )}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        h-screen flex flex-col p-4 shrink-0
        bg-white/70 backdrop-blur-sm text-gray-800 border-r border-gray-200 shadow-sm
        transition-[width] duration-300
        ${isOpen ? "w-[192px]" : "w-[80px]"}
      `}
    >
      {/* 上部：開閉ボタン */}
      <div className="flex items-center justify-between mb-8">
        {isOpen && <h1 className="text-xl font-bold">CRM</h1>}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-700"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* メニュー */}
     <nav className="flex flex-col gap-2">
  <SidebarItem
    href="/dashboard"
    icon={HomeIcon}
    label="ダッシュボード"
    isOpen={isOpen}
  />

  {/* 全業種対応：サービス一覧 */}
  <SidebarItem
    href="/services"
    icon={ClipboardIcon}
    label="サービス"
    isOpen={isOpen}
  />

  <SidebarItem
    href="/reservations"
    icon={CalendarDaysIcon}
    label="予約一覧"
    isOpen={isOpen}
  />

  {/* ★ カレンダーを追加 ★ */}
  <SidebarItem
    href="/calendar"
    icon={CalendarDaysIcon}
    label="カレンダー"
    isOpen={isOpen}
  />

  <SidebarItem
    href="/customers"
    icon={UsersIcon}
    label="顧客一覧"
    isOpen={isOpen}
  />

  <SidebarItem
    href="/settings"
    icon={Cog6ToothIcon}
    label="設定"
    isOpen={isOpen}
  />
</nav>
    </aside>
  );
}