"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createClient();

  // ▼ フォームの状態
  const [form, setForm] = useState<{
  id?: string;
  store_name: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
}>({
  id: undefined,
  store_name: "",
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
      const { data: rows } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1);

      if (rows && rows.length > 0) {
        setForm(rows[0]);
      }
    };

    load();
  }, []);

  // ▼ 保存処理
  const save = async () => {
    // ▼ 重複チェック（店舗名）
    const { data: dup } = await supabase
      .from("store_settings")
      .select("*")
      .eq("store_name", form.store_name)
      .neq("id", form.id ?? "")
      .maybeSingle();

    if (dup) {
      alert("この店舗名はすでに登録されています");
      return;
    }

    // ▼ 既存レコードを1件だけ取得
    const { data: rows } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1);

    const existing = rows?.[0] ?? null;

    let payload = { ...form };

    if (existing) {
      payload.id = existing.id;
    } else {
      // id を除外して新規作成
      const { id, ...rest } = payload;
      payload = rest;
    }

    const { data, error } = await supabase
      .from("store_settings")
      .upsert(payload)
      .select()
      .single();

    if (error) {
      alert("保存に失敗しました");
      console.error(error);
      return;
    }

    setForm(data);
    alert("保存しました！");
  };

  return (
    <div>
      <Header title="設定" />

      <div className="p-10 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">店舗情報</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">店舗名</label>
            <input
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">住所</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">電話番号</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">開店時間</label>
              <input
                name="open_time"
                value={form.open_time}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="09:00"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">閉店時間</label>
              <input
                name="close_time"
                value={form.close_time}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="18:00"
              />
            </div>
          </div>

          <button
            onClick={save}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}