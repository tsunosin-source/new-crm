export const dynamic = "force-dynamic";

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // 日付＋時間フォーマット（Googleカレンダー風）
  function formatTime(date: string, start: string, end: string) {
    const startClean = start.slice(0, 5);
    const endClean = end.slice(0, 5);

    const d = new Date(`${date}T${startClean}`);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const w = weekdays[d.getDay()];

    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(d.getDate()).padStart(2, "0")}（${w}） ${startClean}〜${endClean}`;
  }

  // ステータスの日本語ラベル
  const statusLabel: any = {
    reserved: "予約済み",
    cancelled: "キャンセル済み",
    completed: "来店済み",
  };

  // ステータスの色
  const statusColor: any = {
    reserved: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  // サービスタグの色
  function getServiceColor(id: number) {
    const colors = [
      "bg-green-100 text-green-700",
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-yellow-100 text-yellow-700",
      "bg-pink-100 text-pink-700",
    ];
    return colors[id % colors.length];
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: reservationsData } = await supabase
  .from("reservations2")
  .select("*")
  .neq("status", "cancelled")   // ← これを追加！
  .order("date", { ascending: true })
  .order("start_time", { ascending: true });

      const { data: servicesData } = await supabase
        .from("services")
        .select("id, name");

      setReservations(reservationsData || []);
      setServices(servicesData || []);
    };

    fetchData();
  }, []);

  const getServiceName = (id: number) => {
    const s = services.find((x) => x.id === id);
    return s ? s.name : "不明なサービス";
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">予約一覧</h1>

      <Link
        href="/reservations/new"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        ＋ 新規予約
      </Link>

      {reservations.length === 0 ? (
        <p className="text-gray-700">予約データがありません。</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li
              key={r.id}
              className="p-4 rounded-xl shadow-sm border bg-white odd:bg-gray-50"
            >
              {/* 日付・時間 */}
              <p className="text-lg font-bold text-blue-700">
                {formatTime(r.date, r.start_time, r.end_time)}
              </p>

              {/* 名前 */}
              <p className="mt-2 text-gray-800">
                <span className="font-semibold">お名前：</span>
                {r.name}
              </p>

              {/* サービスタグ */}
<p className="mt-2">
  <span
    className={`inline-block px-2 py-1 text-sm rounded-md ${getServiceColor(
      r.service_id
    )}`}
  >
    {getServiceName(r.service_id)}
  </span>
</p>

{/* ステータスバッジ ← ここに追加！ */}
<p className="mt-2">
  <span
    className={`inline-block px-2 py-1 text-xs rounded-md ${statusColor[r.status]}`}
  >
    {statusLabel[r.status]}
  </span>
</p>


              {/* 詳細ボタン */}
              <div className="mt-4 text-right">
                <Link
                  href={`/reservations/${r.uuid}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow hover:bg-blue-700"
                >
                  予約詳細を見る
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}