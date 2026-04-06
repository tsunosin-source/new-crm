import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return new Response("OK");
}

export const config = {
  matcher: ["/dashboard/:path*"],
};