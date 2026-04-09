export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("LINE Webhook:", body);

  const userId = body.events?.[0]?.source?.userId;
  console.log("LINE User ID:", userId);

  return new Response("OK", { status: 200 });
}