import { createClient } from "@supabase/supabase-js";

export default async function ServicesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("サービス取得エラー:", error);
    return <div className="p-6">データ取得に失敗しました。</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">サービス一覧</h1>

        <a
          href="/services/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ＋ 新規サービス
        </a>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">サービス名</th>
              <th className="py-2">所要時間</th>
              <th className="py-2">料金</th>
              <th className="py-2">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{s.name}</td>
                <td className="py-2">{s.duration} 分</td>
                <td className="py-2">¥{s.price.toLocaleString()}</td>
                <td className="py-2">
                  {s.status === "active" ? (
                    <span className="text-green-600 font-semibold">有効</span>
                  ) : (
                    <span className="text-gray-400">無効</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}