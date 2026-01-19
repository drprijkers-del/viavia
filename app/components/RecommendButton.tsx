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
      className="btn bg-blue-600 hover:bg-blue-500 text-white w-full text-base mt-3"
    >
      👤 Beveel aan iemand aan
    </button>
  );
}
