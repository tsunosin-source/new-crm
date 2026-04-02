"use client";

import { BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Header({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
      {/* 左：ページタイトル */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* 右：日付・ユーザー・ログアウト */}
      <div className="flex items-center gap-6">
        <span className="text-gray-600">{today}</span>

        <div className="flex items-center gap-3">
          <BellIcon className="w-6 h-6 text-gray-600" />

          <span className="font-medium">店長</span>

          <button className="flex items-center gap-1 text-red-600 hover:text-red-700">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span className="hidden md:inline">ログアウト</span>
          </button>
        </div>
      </div>
    </header>
  );
}