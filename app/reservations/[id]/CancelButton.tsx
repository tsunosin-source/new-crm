"use client";

export default function CancelButton({ id }: { id: string }) {
  const handleCancel = async () => {
    const res = await fetch("/api/reservations/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // ← reservation.id を送る
    });

    if (res.ok) {
      alert("予約をキャンセルしました");
      window.location.href = "/reservations";
    } else {
      alert("キャンセルに失敗しました");
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      予約をキャンセルする
    </button>
  );
}