export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MenusPage() {
  const supabase = createClient();

  // メニュー一覧を取得
  const { data: menus, error } = await supabase
    .from("menus")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-10">メニューの取得に失敗しました。</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">メニュー一覧</h1>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メニュー名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                料金
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所要時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作成日
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {menus?.map((menu) => (
              <tr
                key={menu.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => (window.location.href = `/menus/${menu.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-blue-600 hover:underline">
                    {menu.name}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {menu.price ? `${menu.price}円` : "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {menu.duration ? `${menu.duration}分` : "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(menu.created_at).toLocaleDateString("ja-JP")}
                </td>
              </tr>
            ))}

            {menus?.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan={4}>
                  メニューが登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}