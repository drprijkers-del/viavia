"use client";

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        alert("Link gekopieerd!");
      }}
      className="btn btn-secondary"
    >
      Kopieer
    </button>
  );
}
