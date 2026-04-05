import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function NewServicePage() {
  async function createService(formData: FormData) {
    "use server";

    console.log("サーバーアクション動いてます");
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SERVICE ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY);

    const name = formData.get("name") as string;
    const duration = Number(formData.get("duration"));
    const price = Number(formData.get("price"));
    const status = formData.get("status") as string;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("services").insert({
      name,
      duration,
      price,
      status,
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      return;
    }

    redirect("/services");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">新規サービスの追加</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-lg">
        <form action={createService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">サービス名</label>
            <input
              name="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="例：カット、整体、コンサル など"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">所要時間（分）</label>
            <input
              name="duration"
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="60"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">料金（円）</label>
            <input
              name="price"
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="5000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ステータス</label>
            <select name="status" className="w-full border rounded px-3 py-2">
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  );
}