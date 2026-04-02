"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);

  // 日付を日本時間に変換する関数
function formatJST(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

  useEffect(() => {
    const fetchReservations = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("reservations_with_details")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("data:", data);
      console.log("error:", error);

      if (error) {
        console.error("Error:", error);
      } else {
        setReservations(data);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-10">
  <h1 className="text-2xl font-bold mb-6">予約一覧</h1>

  {reservations.length === 0 ? (
    <p className="text-gray-700">予約データがありません。</p>
  ) : (
    <ul className="space-y-4">
      {reservations.map((r) => (
        <li
  key={r.id}
  className="p-4 border rounded bg-white even:bg-gray-50"
>
  <p>予約日時：{formatJST(r.created_at)}</p>

  <p className="mt-1">
  <Link
    href={`/reservations/${r.id}`}
    className="text-blue-600 underline hover:text-blue-800"
  >
    予約詳細を見る
  </Link>
</p>

  {/* ステータス（日本語 + バッジ + 色分け） */}
<p className="mt-1">
  <span
    className={
      "px-2 py-1 rounded text-white " +
      (r.status === "confirmed"
        ? "bg-green-600"
        : r.status === "pending"
        ? "bg-yellow-500"
        : r.status === "canceled"
        ? "bg-red-500"
        : "bg-gray-500")
    }
  >
    {r.status === "confirmed"
      ? "確認済み"
      : r.status === "pending"
      ? "保留"
      : r.status === "canceled"
      ? "キャンセル"
      : "不明"}
  </span>
</p>

  <p className="mt-1">
  顧客名：
  <a
    href={`/customers/${r.customer_id}`}
    className="text-blue-600 underline hover:text-blue-800"
  >
    {r.customer_name}
  </a>
</p>

<p className="mt-1">
  メニュー：
  <Link
    href={`/menus/${r.menu_id}`}
    className="text-blue-600 underline hover:text-blue-800"
  >
    {r.menu_name}
  </Link>
</p>


</li>
      ))}
    </ul>
  )}
</div>
  );
}