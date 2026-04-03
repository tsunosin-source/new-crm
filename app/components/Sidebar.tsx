"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  ScissorsIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

function SidebarItem(
  { href, icon: Icon, label, isOpen }: 
  { href: string; icon: any; label: string; isOpen: boolean }
) {

  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${active ? "bg-blue-600 text-white" : "hover:bg-gray-700"}
      `}
    >
      <Icon className="w-6 h-6" />
      {isOpen && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
  className={`h-screen flex flex-col p-4 transition-all duration-300
    bg-white/70 backdrop-blur-sm text-gray-800 border-r border-gray-200 shadow-sm
    ${isOpen ? "w-48" : "w-16"}
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
        <SidebarItem href="/dashboard" icon={HomeIcon} label="ダッシュボード" isOpen={isOpen} />
        <SidebarItem href="/reservations" icon={CalendarDaysIcon} label="予約一覧" isOpen={isOpen} />
        <SidebarItem href="/customers" icon={UsersIcon} label="顧客一覧" isOpen={isOpen} />
        <SidebarItem href="/menus" icon={ScissorsIcon} label="メニュー一覧" isOpen={isOpen} />
        <SidebarItem href="/settings" icon={Cog6ToothIcon} label="設定" isOpen={isOpen} />
      </nav>
    </aside>
  );
}