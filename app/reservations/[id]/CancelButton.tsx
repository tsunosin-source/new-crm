"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CancelButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleCancel = async () => {
    await supabase
      .from("reservations2")
      .update({ status: "cancelled" })
      .eq("uuid", id)

    router.push("/reservations");
  };

  return (
    <button
      onClick={handleCancel}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      予約をキャンセルする
    </button>
  );
}