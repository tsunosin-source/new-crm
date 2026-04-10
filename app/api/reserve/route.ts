import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ← ここを require に変更
const line = require("@line/bot-sdk");

const lineClient = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

// Supabase（Service Role）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, name, date, time, menu } = body;

    if (!userId || !date || !time || !menu) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 予約データを保存
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          user_id: userId,
          name,
          date,
          time,
          menu,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save reservation" },
        { status: 500 }
      );
    }

    const reservationId = data.id;

    // LINEへ push メッセージ送信
    await lineClient.pushMessage(userId, {
      type: "text",
      text: `ご予約ありがとうございます！

【予約内容】
日付：${date}
時間：${time}
メニュー：${menu}

ご予約が確定しました。
変更・キャンセルはこちら：
${process.env.NEXT_PUBLIC_CANCEL_URL}?id=${reservationId}
`,
    });

    return NextResponse.json(
      { message: "Reservation saved and message sent", reservationId },
      { status: 200 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}