import { createClient } from "@/lib/supabase/server";

export async function getStore(storeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single();

  if (error) {
    console.error("Store fetch error:", error);
    return null;
  }

  return data;
}