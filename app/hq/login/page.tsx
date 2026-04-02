"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HqLoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/hq/dashboard`,
      },
    });

    if (error) {
      alert("ログインに失敗しました");
      console.error(error);
      return;
    }

    alert("ログインリンクを送信しました！");
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">本部ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        ログインリンクを送信
      </button>
    </div>
  );
}