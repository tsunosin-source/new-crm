import { createClient } from "@/lib/supabase/server";

export default async function CustomerDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;


  const supabase = createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <div className="p-10">顧客情報が見つかりませんでした。</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">顧客詳細</h1>

      <p>名前：{data.name}</p>
      <p>電話番号：{data.phone}</p>
      <p>メール：{data.email}</p>
      <p>登録日：{data.created_at}</p>
    </div>
  );
}