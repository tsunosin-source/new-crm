import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// メニュー名 → service_id を取得する関数
async function getServiceId(menu: string) {
  const { data, error } = await supabase
    .from("services")
    .select("id")
    .eq("name", menu)
    .single();

  if (error || !data) return null;
  return data.id;
}

// 時間 +1時間 を作る関数
function addOneHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  const endH = (h + 1) % 24;
  return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

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

    // 必須カラムを生成
    const start_time = time;
    const end_time = addOneHour(time);
    const service_id = await getServiceId(menu);

    if (!service_id) {
      return NextResponse.json(
        { error: "Invalid menu (service not found)" },
        { status: 400 }
      );
    }

    // Supabase に保存
    const { data, error } = await supabase
      .from("reservations2")
      .insert({
        date,
        start_time,
        end_time,
        name,
        service_id,
        status: "pending",
        uuid: crypto.randomUUID(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // LINE 通知
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            text: `予約を受け付けました。\n${date} ${time}\nメニュー: ${menu}`,
          },
        ],
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}