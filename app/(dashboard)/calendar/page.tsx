"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Reservation = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  name: string;
};

export default function CalendarPage() {
  const supabase = createClient();

  // 週ビュー or 月ビュー
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // 週移動
  const [weekOffset, setWeekOffset] = useState(0);

  // 月移動
  const [monthOffset, setMonthOffset] = useState(0);

  // 週ビュー用予約
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // 月ビュー用予約
  const [monthReservations, setMonthReservations] = useState<Reservation[]>([]);

  // 24時間
  const hours = Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, "0")}:00`
  );

  // 曜日
  const days = ["月", "火", "水", "木", "金", "土", "日"];

  // 今日
  const today = new Date();

  /* ------------------------------
      週ビュー用の日付計算
  ------------------------------ */
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  /* ------------------------------
      Supabase から予約取得（週ビュー）
  ------------------------------ */
  useEffect(() => {
    const fetchReservations = async () => {
      const start = monday.toISOString().split("T")[0];
      const end = new Date(monday);
      end.setDate(monday.getDate() + 6);
      const endStr = end.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("reservations2")
        .select("*")
        .gte("date", start)
        .lte("date", endStr)
        .order("start_time", { ascending: true });

      if (!error && data) {
        setReservations(data as Reservation[]);
      }
    };

    fetchReservations();
  }, [weekOffset, monday, supabase]);

  /* ------------------------------
      月ビュー用の日付計算
  ------------------------------ */
  const baseMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  );
  const year = baseMonth.getFullYear();
  const month = baseMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthCells: (number | null)[] = [];
  for (let i = 0; i < (firstDay + 6) % 7; i++) monthCells.push(null);
  for (let d = 1; d <= lastDate; d++) monthCells.push(d);

  /* ------------------------------
      Supabase から予約取得（月ビュー）
  ------------------------------ */
  useEffect(() => {
    const fetchMonthReservations = async () => {
      const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        lastDate
      ).padStart(2, "0")}`;

      const { data, error } = await supabase
        .from("reservations2")
        .select("*")
        .gte("date", start)
        .lte("date", end)
        .order("start_time", { ascending: true });

      if (!error && data) {
        setMonthReservations(data as Reservation[]);
      }
    };

    fetchMonthReservations();
  }, [monthOffset, year, month, lastDate, supabase]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">カレンダー</h1>

      {/* ▼▼ ビュー切替タブ ▼▼ */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("week")}
          className={`px-4 py-2 rounded ${
            viewMode === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          週ビュー
        </button>

        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded ${
            viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          月ビュー
        </button>
      </div>

      {/* ▼▼ WEEK VIEW ▼▼ */}
      {viewMode === "week" && (
        <>
          {/* 週移動 */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ＜ 前の週
            </button>

            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              今週
            </button>

            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              次の週 ＞
            </button>
          </div>

          {/* 週ビュー本体 */}
          <div className="grid grid-cols-8 border border-gray-300">
            {/* 左上の「時間」 */}
            <div className="border-r border-gray-300 bg-gray-100 p-2 font-semibold text-center">
              時間
            </div>

            {/* 日付ヘッダー */}
            {weekDates.map((date, index) => (
              <div
                key={index}
                className="border-r border-gray-300 bg-gray-100 p-2 font-semibold text-center"
              >
                {`${date.getMonth() + 1}/${date.getDate()} (${days[index]})`}
              </div>
            ))}

            {/* 時間 × 曜日 */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* 左側の時間 */}
                <div className="border-t border-r border-gray-300 p-2 text-center bg-gray-50">
                  {hour}
                </div>

                {/* 7日分のマス（予約表示） */}
                {days.map((_, index) => {
                  const cellDate = weekDates[index]
                    .toISOString()
                    .split("T")[0];

                  const dayReservations = reservations.filter(
                    (r) => r.date === cellDate
                  );

                  return (
                    <div
                      key={`${hour}-${index}`}
                      className="relative border-t border-r border-gray-300 h-20"
                    >
                      {dayReservations.map((r) => {
                        const [startH, startM] = r.start_time
                          .split(":")
                          .map(Number);
                        const [endH, endM] = r.end_time
                          .split(":")
                          .map(Number);
                        const [cellH] = hour.split(":").map(Number);

                        const startTotal = startH * 60 + startM;
                        const endTotal = endH * 60 + endM;
                        const cellStartTotal = cellH * 60;

                        const pxPerMin = 80 / 60;

                        const top = (startTotal - cellStartTotal) * pxPerMin;
                        const height = (endTotal - startTotal) * pxPerMin;

                        if (top < 0 || top >= 80) return null;

                        return (
                          <div
                            key={r.id}
                            onClick={() =>
                              (window.location.href = `/reservations/detail/${r.id}`)
                            }
                            className="absolute left-1 right-1 bg-gray-300 rounded p-1 text-xs cursor-pointer"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                          >
                            <div className="font-bold">{r.name}</div>
                            <div className="text-[10px]">
                              {r.start_time} - {r.end_time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      {/* ▼▼ MONTH VIEW ▼▼ */}
      {viewMode === "month" && (
        <>
          {/* 月移動 */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setMonthOffset(monthOffset - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ＜ 前の月
            </button>

            <button
              onClick={() => setMonthOffset(0)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              今月
            </button>

            <button
              onClick={() => setMonthOffset(monthOffset + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              次の月 ＞
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">
            {year}年 {month + 1}月
          </h2>

          <div className="grid grid-cols-7 border border-gray-300">
            {days.map((d) => (
              <div
                key={d}
                className="border-r border-gray-300 bg-gray-100 p-2 font-semibold text-center"
              >
                {d}
              </div>
            ))}

            {monthCells.map((d, i) => {
              const cellDate = d
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    d
                  ).padStart(2, "0")}`
                : null;

              const dayReservations = cellDate
                ? monthReservations.filter((r) => r.date === cellDate)
                : [];

              return (
                <div
                  key={i}
                  className="border-t border-r border-gray-300 h-28 p-2 text-xs overflow-hidden"
                >
                  {d && <div className="font-semibold mb-1">{d}</div>}

                  {dayReservations.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() =>
                        (window.location.href = `/reservations/detail/${r.id}`)
                      }
                      className="bg-gray-200 rounded px-1 py-[2px] mb-[2px] cursor-pointer hover:bg-gray-300"
                    >
                      {r.start_time.slice(0, 5)} {r.name}
                    </div>
                  ))}

                  {dayReservations.length > 3 && (
                    <div className="text-gray-500 text-[10px]">
                      +{dayReservations.length - 3}件
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}