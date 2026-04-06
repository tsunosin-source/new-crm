"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function NewReservationPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("reservations2").insert([
      {
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        name: form.name,
        service_id: Number(form.service_id),
      },
    ]);

    if (error) {
      alert("登録に失敗しました");
      console.error(error);
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