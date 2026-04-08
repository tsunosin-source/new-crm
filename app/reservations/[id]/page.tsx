import { createClient } from "@/lib/supabase/server";
import CancelButton from "./CancelButton";

export default async function ReservationDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = createClient();

  const { data: reservation, error } = await supabase
    .from("reservations2")
    .select("*")
    .eq("uuid", id)
    .maybeSingle();

  if (error || !reservation) {
    return <div className="p-10">予約情報が見つかりませんでした。</div>;
  }
}


  // サービス名取得
  const { data: service } = await supabase
    .from("services")
    .select("name")
    .eq("id", reservation.service_id)
    .single();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">予約詳細</h1>

      <p>
  <span className="font-semibold">予約ID：</span>
  {reservation.uuid}
</p>

      <p className="mt-2">
        <span className="font-semibold">日付：</span>
        {reservation.date}
      </p>

      <p className="mt-1">
        <span className="font-semibold">時間：</span>
        {reservation.start_time} 〜 {reservation.end_time}
      </p>

      <p className="mt-2">
        <span className="font-semibold">お名前：</span>
        {reservation.name}
      </p>

      <p className="mt-2">
        <span className="font-semibold">サービス：</span>
        {service?.name ?? "不明なサービス"}
      </p>

      <p className="mt-2">
        <span className="font-semibold">登録日時：</span>
        {reservation.created_at}
      </p>

      <div className="mt-6 flex gap-4">
        <a
  href={`/reservations/${reservation.uuid}/edit`}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
          予約を編集する
        </a>

<CancelButton id={reservation.uuid} />
 {/* ← 修正 */}

        <a
          href="/reservations"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          予約一覧に戻る
        </a>
      </div>
    </div>
  );
}