import { createClient } from "@/lib/supabase/server";

export default async function MenuDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const supabase = createClient();

  // メニュー情報を取得
  const { data: menu, error: menuError } = await supabase
    .from("menus")
    .select("*")
    .eq("id", id)
    .single();

  if (menuError || !menu) {
    return <div className="p-10">メニュー情報が見つかりませんでした。</div>;
  }

  // このメニューを利用した予約履歴を取得
  const { data: reservations, error: reservationError } = await supabase
    .from("reservations")
    .select("id, date, status, customer_name")
    .eq("menu_id", id)
    .order("date", { ascending: false });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">メニュー詳細</h1>

      {/* メニュー情報カード */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <p className="text-lg font-semibold mb-2">{menu.name}</p>
        <p>料金：{menu.price ? `${menu.price}円` : "-"}</p>
        <p>所要時間：{menu.duration ? `${menu.duration}分` : "-"}</p>
        <p className="mt-2">説明：{menu.description || "（説明なし）"}</p>
        <p className="mt-2">
          作成日：{new Date(menu.created_at).toLocaleDateString("ja-JP")}
        </p>
      </div>

      {/* 予約履歴 */}
      <h2 className="text-xl font-bold mb-4">このメニューの予約履歴</h2>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日付
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reservations?.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan={3}>
                  このメニューの予約履歴はありません。
                </td>
              </tr>
            )}

            {reservations?.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => (window.location.href = `/reservations/${r.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(r.date).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {r.customer_name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}