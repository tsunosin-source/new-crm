import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ← ここが重要
    );

    const { error } = await supabase.from("reservations2").insert([
      {
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        name: body.name,
        service_id: Number(body.service_id),
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}