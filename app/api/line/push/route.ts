import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, message } = body;

  const lineToken = process.env.LINE_ACCESS_TOKEN;

  if (!lineToken) {
    return NextResponse.json({ error: "LINE_ACCESS_TOKEN is missing" }, { status: 500 });
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lineToken}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ status: "ok", data });
}