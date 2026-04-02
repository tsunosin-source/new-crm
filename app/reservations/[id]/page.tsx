import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ステータスバッジ（色付き）
function StatusBadge({ status }: { status: string }) {
  console.log("BADGE STATUS:", JSON.stringify(status));  // ← ここに置く！

  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const labels: Record<string, string> = {
    pending: "未確認",
    confirmed: "確認済み",
    cancelled: "キャンセル",
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-semibold ${colors[status]}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default async function ReservationDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const supabase = createClient();

  // ★ 配列で返ってくるので maybeSingle を使わず select のまま
  const { data, error } = await supabase
    .from("reservations_with_details")
    .select("*")
    .eq("id", id);

  if (error || !data || data.length === 0) {
    return <div className="p-10">予約情報が見つかりませんでした。</div>;
  }

  // ★ 配列の 0 番目を取り出す
  const row = data[0];
  console.log("STATUS:", row.status);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">予約詳細</h1>

      <p><span className="font-semibold">予約ID：</span>{row.id}</p>
      <p><span className="font-semibold">予約日時：</span>{row.created_at}</p>

      <p className="mt-4">
        <span className="font-semibold">顧客名：</span>
        <a
          href={`/customers/${row.customer_id}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {row.customer_name}
        </a>
      </p>

      <p className="mt-1">
        <span className="font-semibold">メニュー：</span>
        {row.menu_name}
      </p>

      <p className="mt-3">
  <span className="font-semibold">ステータス：</span>
  <StatusBadge status={row.status} />
</p>
      {/* ▼▼▼ ステータス変更フォーム ▼▼▼ */}
      <form
        action={async (formData) => {
          "use server";

          const newStatus = formData.get("status");

          const supabase = createClient();
          await supabase
            .from("reservations")
            .update({ status: newStatus })
            .eq("id", id);

          return redirect(`/reservations/${id}`);
        }}
        className="mt-6"
      >
        <label className="block mb-2 font-semibold">ステータスを変更：</label>

        <select
          name="status"
          defaultValue={row.status}
          className="border p-2 rounded"
        >
          <option value="pending">保留</option>
          <option value="confirmed">確認済み</option>
          <option value="cancelled">キャンセル</option>
        </select>

        <button
          type="submit"
          className="ml-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          更新
        </button>
      </form>
      {/* ▲▲▲ ステータス変更フォームここまで ▲▲▲ */}
    </div>
  );
}

