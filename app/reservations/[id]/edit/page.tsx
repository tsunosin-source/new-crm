import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ReservationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  // 予約データ取得
  const { data: reservation } = await supabase
    .from("reservations2")
    .select("*")
    .eq("id", id)
    .single();

  if (!reservation) {
    return <div className="p-10">予約情報が見つかりませんでした。</div>;
  }

  // サービス一覧取得
  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .order("id");

  // 更新処理（Server Action）
  async function updateReservation(formData: FormData) {
    "use server";

    const supabase = createClient();

    const updated = {
      date: formData.get("date"),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
      name: formData.get("name"),
      service_id: Number(formData.get("service_id")),
    };

    await supabase.from("reservations2").update(updated).eq("id", id);

    redirect(`/reservations/${id}`);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">予約編集</h1>

      <form action={updateReservation} className="space-y-4">
        <div>
          <label className="block font-semibold">日付</label>
          <input
            type="date"
            name="date"
            defaultValue={reservation.date}
            className="border p-2 rounded w-60"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">開始時間</label>
          <input
            type="time"
            name="start_time"
            defaultValue={reservation.start_time}
            className="border p-2 rounded w-40"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">終了時間</label>
          <input
            type="time"
            name="end_time"
            defaultValue={reservation.end_time}
            className="border p-2 rounded w-40"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">お名前</label>
          <input
            type="text"
            name="name"
            defaultValue={reservation.name}
            className="border p-2 rounded w-80"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">サービス</label>
          <select
            name="service_id"
            defaultValue={reservation.service_id}
            className="border p-2 rounded w-80"
            required
          >
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          更新する
        </button>
      </form>

      <div className="mt-6">
        <a
          href={`/reservations/${id}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← 詳細ページに戻る
        </a>
      </div>
    </div>
  );
}