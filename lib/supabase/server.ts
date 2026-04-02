import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
