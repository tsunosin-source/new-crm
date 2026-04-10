import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { id } = await req.json(); // ← uuid を受け取る

  const { error } = await supabase
    .from("reservations2")
    .update({ status: "cancelled" })
    .eq("uuid", id); // ← uuid で検索するのが正しい

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}