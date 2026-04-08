import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { id } = await req.json(); // ← uuid が送られてくる

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // uuid で予約をキャンセルに更新
  const { error } = await supabase
    .from("reservations2")
    .update({ status: "cancelled" })
    .eq("uuid", id); // ← ここが正しい

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}