"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // JST形式に整形
  function formatTime(date: string, start: string, end: string) {
    return `${date} ${start}〜${end}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // 予約データ
      const { data: reservationsData } = await supabase
        .from("reservations2")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      // サービス名取得
      const { data: servicesData } = await supabase
        .from("services")
        .select("id, name");

      setReservations(reservationsData || []);
      setServices(servicesData || []);
    };

    fetchData();
  }, []);

  // service_id → サービス名に変換
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
              className="p-4 border rounded bg-white even:bg-gray-50"
            >
              <p className="font-bold">
                {formatTime(r.date, r.start_time, r.end_time)}
              </p>

              <p className="mt-1">お名前：{r.name}</p>

              <p className="mt-1">サービス：{getServiceName(r.service_id)}</p>

              <p className="mt-2">
                <Link
                  href={`/reservations/${r.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  予約詳細を見る
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}