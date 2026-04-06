export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CustomersPage() {
  const supabase = createClient();

  // 顧客データ取得
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-10">顧客データの取得に失敗しました。</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">顧客一覧</h1>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                電話番号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メール
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終来店日
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.phone || "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.email || "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.last_visit
                    ? new Date(customer.last_visit).toLocaleDateString("ja-JP")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}