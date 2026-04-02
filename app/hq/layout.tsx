"use client";

import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen">
      {/* 左メニュー */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">本部メニュー</h2>

        <nav className="space-y-3">
          <Link href="/hq/dashboard" className="block hover:text-blue-300">
            ダッシュボード
          </Link>

          <Link href="/stores" className="block hover:text-blue-300">
            店舗一覧
          </Link>

          <Link href="/stores/new" className="block hover:text-blue-300">
            新規店舗追加
          </Link>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-10 bg-gray-50">{children}</main>
    </div>
  );
}