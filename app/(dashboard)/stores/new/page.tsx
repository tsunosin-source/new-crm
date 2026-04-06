"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewStorePage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    open_time: "",
    close_time: "",
  });

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  const save = async () => {
    // ▼ 重複チェック（店舗名）
    const { data: dup } = await supabase
      .from("stores")
      .select("*")
      .eq("name", form.name)
      .maybeSingle();

    if (dup) {
      alert("この店舗名はすでに登録されています");
      return;
    }

    // ▼ 新規登録
    const { error } = await supabase.from("stores").insert(form);

    if (error) {
      alert("保存に失敗しました");
      console.error(error);
      return;
    }

    alert("店舗を登録しました！");
    router.push("/stores");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規店舗追加</h1>

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
      </div>
    </div>
  );
}