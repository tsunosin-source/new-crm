import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ① 予約データを保存
    const { data, error } = await supabase
      .from("reservations2")
      .insert([
        {
          date: body.date,
          start_time: body.start_time,
          end_time: body.end_time,
          name: body.name,
          service_id: Number(body.service_id),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // ② LINE通知を送信（ユーザーIDは body.lineUserId として送られてくる想定）
    if (body.lineUserId) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/line/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: body.lineUserId,
          message: `ご予約ありがとうございます！
以下の内容で予約を受け付けました。

・日付：${body.date}
・時間：${body.start_time}〜${body.end_time}
・メニュー：${body.serviceName}

またのご利用をお待ちしております。`,
        }),
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}