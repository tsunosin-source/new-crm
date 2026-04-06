"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  function formatTime(date: string, start: string, end: string) {
    return `${date} ${start}〜${end}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: reservationsData } = await supabase
        .from("reservations2")
        .select("*")
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
      className="p-4 rounded-xl shadow-sm border bg-white"
    >
      {/* 日付・時間（Googleカレンダー風に強調） */}
      <p className="text-lg font-bold text-blue-700">
        {formatTime(r.date, r.start_time, r.end_time)}
      </p>

      {/* 名前 */}
      <p className="mt-2 text-gray-800">
        <span className="font-semibold">お名前：</span>
        {r.name}
      </p>

      {/* サービス名（色付きタグ） */}
      <p className="mt-2">
        <span className="inline-block px-2 py-1 text-sm rounded-md bg-green-100 text-green-700">
          {getServiceName(r.service_id)}
        </span>
      </p>

      {/* 詳細ボタン */}
      <div className="mt-4 text-right">
        <Link
          href={`/reservations/${r.id}`}
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