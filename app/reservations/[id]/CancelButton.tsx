"use client";

export default function CancelButton({ reservationId }: { reservationId: string }) {
  const handleCancel = async () => {
    await fetch(`/api/cancel?id=${reservationId}`, {
      method: "POST",
    });
    alert("キャンセルしました");
  };

  return (
    <button
      onClick={handleCancel}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      キャンセルする
    </button>
  );
}
