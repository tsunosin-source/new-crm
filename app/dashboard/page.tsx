export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "../components/Header";

import {
  CalendarIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default async function Dashboard() {
  const supabase = createClient();

  // ▼▼▼ 今日の予約数 ▼▼▼
  const today = new Date();
  const startJST = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endJST = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const startUTC = new Date(startJST.getTime() - 9 * 60 * 60 * 1000).toISOString();
  const endUTC = new Date(endJST.getTime() - 9 * 60 * 60 * 1000).toISOString();

  const { data: todayReservations } = await supabase
    .from("reservations")
    .select("id")
    .gte("created_at", startUTC)
    .lt("created_at", endUTC);

  const todayCount = todayReservations?.length ?? 0;

  // ▼▼▼ 今日のキャンセル ▼▼▼
  const { data: todayCancelled } = await supabase
    .from("reservations")
    .select("id")
    .eq("status", "cancelled")
    .gte("created_at", startUTC)
    .lt("created_at", endUTC);

  const todayCancelledCount = todayCancelled?.length ?? 0;

  // ▼▼▼ 今週の予約 ▼▼▼
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startOfWeekJST = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + diffToMonday
  );

  const endOfWeekJST = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + diffToMonday + 7
  );

  const startOfWeekUTC = new Date(startOfWeekJST.getTime() - 9 * 60 * 60 * 1000).toISOString();
  const endOfWeekUTC = new Date(endOfWeekJST.getTime() - 9 * 60 * 60 * 1000).toISOString();

  const { data: weeklyReservations } = await supabase
    .from("reservations")
    .select("id")
    .gte("created_at", startOfWeekUTC)
    .lt("created_at", endOfWeekUTC);

  const weeklyCount = weeklyReservations?.length ?? 0;

  // ▼▼▼ 今日の新規顧客 ▼▼▼
  const { data: newCustomersToday } = await supabase
    .from("customers")
    .select("id")
    .gte("created_at", startUTC)
    .lt("created_at", endUTC);

  const newCustomersTodayCount = newCustomersToday?.length ?? 0;

  // ▼▼▼ 今週の新規顧客 ▼▼▼
  const { data: newCustomersThisWeek } = await supabase
    .from("customers")
    .select("id")
    .gte("created_at", startOfWeekUTC)
    .lt("created_at", endOfWeekUTC);

  const newCustomersThisWeekCount = newCustomersThisWeek?.length ?? 0;

  // ▼▼▼ 直近の予約 ▼▼▼
  const { data: recentReservations } = await supabase
    .from("reservations")
    .select(`
      id,
      reserved_at,
      status,
      customers:customer_id ( name ),
      menus:menu_id ( name )
    `)
    .order("reserved_at", { ascending: false })
    .limit(5);

  // ▼▼▼ UI ▼▼▼
  return (
    <div>
      <Header title="ダッシュボード" />

      <div className="p-10 min-w-0">

        {/* ▼▼▼ カード5つ ▼▼▼ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* 今日の予約 */}
          <Link href="/reservations" className="block">
            <div className="bg-white shadow-md rounded-xl p-6 h-32 hover:shadow-lg hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">今日の予約</p>
                  <p className="text-4xl font-extrabold">{todayCount}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 今日のキャンセル */}
          <Link href="/reservations" className="block">
            <div className="bg-white shadow-md rounded-xl p-6 h-32 hover:shadow-lg hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XMarkIcon className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">今日のキャンセル</p>
                  <p className="text-4xl font-extrabold">{todayCancelledCount}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 今週の予約 */}
          <Link href="/reservations" className="block">
            <div className="bg-white shadow-md rounded-xl p-6 h-32 hover:shadow-lg hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDaysIcon className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">今週の予約</p>
                  <p className="text-4xl font-extrabold">{weeklyCount}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 今日の新規顧客 */}
          <Link href="/customers" className="block">
            <div className="bg-white shadow-md rounded-xl p-6 h-32 hover:shadow-lg hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserPlusIcon className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">今日の新規顧客</p>
                  <p className="text-4xl font-extrabold">{newCustomersTodayCount}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 今週の新規顧客 */}
          <Link href="/customers" className="block">
            <div className="bg-white shadow-md rounded-xl p-6 h-32 hover:shadow-lg hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UsersIcon className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">今週の新規顧客</p>
                  <p className="text-4xl font-extrabold">{newCustomersThisWeekCount}</p>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* ▼▼▼ 直近の予約 ▼▼▼ */}
        <h2 className="text-2xl font-bold mt-10 mb-4">直近の予約</h2>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-2">顧客名</th>
                <th className="py-3 px-2">メニュー</th>
                <th className="py-3 px-2">予約日時</th>
                <th className="py-3 px-2">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations?.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{r.customers?.[0]?.name ?? "（未設定）"}</td>
<td className="py-3 px-2">{r.menus?.[0]?.name ?? "（未設定）"}</td>
                  <td className="py-3 px-2">
                    {new Date(r.reserved_at).toLocaleString("ja-JP")}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        r.status === "confirmed"
                          ? "bg-green-500"
                          : r.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {r.status === "confirmed"
                        ? "確定"
                        : r.status === "cancelled"
                        ? "キャンセル"
                        : "不明"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}