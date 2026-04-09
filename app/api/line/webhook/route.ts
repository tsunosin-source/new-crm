export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("LINE Webhook:", body);

  return new Response("OK", { status: 200 });
}