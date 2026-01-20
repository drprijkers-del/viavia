"use client";

export default function RecommendButton({
  opdrachtId,
  titel,
}: {
  opdrachtId: string;
  titel: string;
}) {
  const handleRecommend = () => {
    const url = `${window.location.origin}/opdracht/${opdrachtId}`;
    const text = `Hey! Ik dacht dat deze opdracht perfect voor je is:\n\n${titel}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <button
      onClick={handleRecommend}
      className="btn w-full py-4 text-base bg-stone-700 hover:bg-stone-600 text-white shadow-lg"
    >
      👤 Beveel aan iemand aan
    </button>
  );
}
