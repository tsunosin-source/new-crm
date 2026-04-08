import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  return createServerClient(
    process.env.SUPABASE_URL!,                 // ← これが正しい
    process.env.SUPABASE_SERVICE_ROLE_KEY!,    // ← これが正しい
    {
      cookies: {
        get: async (name: string) => {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        set: async (name: string, value: string, options) => {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
        remove: async (name: string, options) => {
          const cookieStore = await cookies();
          cookieStore.set(name, "", options);
        },
      },
    }
  );
}