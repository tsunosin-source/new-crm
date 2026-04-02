"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";

export default function EditStorePage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const storeId = params.id;

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    open_time: "",
    close_time: "",
  });

  // ▼ 入力変更
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  // ▼ 初期データ読み込み
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single();

      if (data) setForm(data);
    };

    load();
  }, [storeId]);

  // ▼ 保存処理（更新）
  const save = async () => {
    // ▼ 重複チェック（店舗名）
    const { data: dup } = await supabase
      .from("stores")
      .select("*")
      .eq("name", form.name)
      .neq("id", storeId)
      .maybeSingle();

    if (dup) {
      alert("この店舗名はすでに登録されています");
      return;
    }

    const { error } = await supabase
      .from("stores")
      .update(form)
      .eq("id", storeId);

    if (error) {
      alert("保存に失敗しました");
      console.error(error);
      return;
    }

    alert("保存しました！");
    router.push("/stores");
  };

  // ▼ 削除処理
  const remove = async () => {
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase
      .from("stores")
      .delete()
      .eq("id", storeId);

    if (error) {
      alert("削除に失敗しました");
      console.error(error);
      return;
    }

    alert("削除しました！");
    router.push("/stores");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">店舗編集</h1>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="店舗名"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          placeholder="住所"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="電話番号"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="open_time"
          placeholder="09:00"
          value={form.open_time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="close_time"
          placeholder="18:00"
          value={form.close_time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          保存する
        </button>

        <button
          onClick={remove}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          削除する
        </button>
      </div>
    </div>
  );
}