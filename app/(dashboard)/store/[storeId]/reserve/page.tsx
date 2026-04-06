"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
  created_at: string;
};

export default function StoresPage() {
  const supabase = createClient();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("stores")
        .select("*")
        .order("created_at", { ascending: true });

      setStores(data || []);
    };

    load();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">店舗一覧（本部用）</h1>

      <Link
        href="/stores/new"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        ＋ 新規店舗を追加
      </Link>

      <div className="space-y-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{store.name}</p>
              <p className="text-sm text-gray-600">{store.address}</p>
            </div>

            <Link
              href={`/stores/${store.id}`}
              className="text-blue-600 underline"
            >
              編集
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}