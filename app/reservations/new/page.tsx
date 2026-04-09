"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewReservationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    name: "",
    service_id: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("*");
      setServices(data || []);
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ① 名前から line_user_id を取得
    const { data: customer } = await supabase
      .from("customers")
      .select("line_user_id")
      .eq("name", form.name)
      .single();

    const lineUserId = customer?.line_user_id || null;

    // ② 予約APIに送る
    const res = await fetch("/api/reservations/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        name: form.name,
        service_id: form.service_id,
        serviceName: services.find((s) => s.id == form.service_id)?.name || "",
        lineUserId, // ← これが通知に使われる
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert("登録に失敗しました");
      console.error(result);
      return;
    }

    router.push("/reservations");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">新規予約</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>日付</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label>開始時間</label>
          <input
            type="time"
            className="border p-2 w-full"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
          />
        </div>

        <div>
          <label>終了時間</label>
          <input
            type="time"
            className="border p-2 w-full"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
          />
        </div>

        <div>
          <label>お名前</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>サービス</label>
          <select
            className="border p-2 w-full"
            value={form.service_id}
            onChange={(e) => setForm({ ...form, service_id: e.target.value })}
            required
          >
            <option value="">選択してください</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          登録する
        </button>
      </form>
    </div>
  );
}