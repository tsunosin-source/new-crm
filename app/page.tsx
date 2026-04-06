export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* ヒーローセクション */}
      <section className="text-center py-16 bg-white shadow-sm">
        <h1 className="text-4xl font-bold mb-4">つのだ商店 予約システム</h1>
        <p className="text-lg text-gray-600">
          LINE と連携した、かんたん・便利な予約管理システム
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/reservations"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            予約する
          </a>
          <a
            href="/reservations/cancel"
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          >
            予約をキャンセル
          </a>
        </div>
      </section>

      {/* システムの使い方 */}
      <section className="max-w-3xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold mb-6">システムの使い方</h2>

        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>LINE のメニューから「予約する」をタップします。</li>
          <li>希望の日時・サービスを選択します。</li>
          <li>予約内容を確認して送信します。</li>
          <li>予約完了メッセージが LINE に届きます。</li>
          <li>キャンセルしたい場合は「予約をキャンセル」から可能です。</li>
        </ol>
      </section>

      {/* 料金システム */}
      <section className="max-w-3xl mx-auto py-16 px-6 bg-white shadow-inner rounded-lg">
        <h2 className="text-2xl font-bold mb-6">料金システム</h2>

        <p className="text-gray-700 mb-4">
          現在の料金プランは以下の通りです。（仮設定）
        </p>

        <ul className="space-y-3 text-gray-700">
          <li>・初期費用：0円</li>
          <li>・月額利用料：3,000円</li>
          <li>・予約件数無制限</li>
          <li>・LINE 連携無料</li>
        </ul>
      </section>

      {/* フッター */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        © つのだ商店 予約システム
      </footer>
    </main>
  );
}