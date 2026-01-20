import { getOpdracht } from "@/app/actions/queries";
import Link from "next/link";
import OpdrachtDetailClient from "./opdracht-detail-client";

export default async function OpdrachtDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const opdracht = await getOpdracht(id);

  if (!opdracht) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Opdracht niet gevonden
          </h2>
          <Link href={`/g/${slug}`}>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors">
              ← Terug
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <OpdrachtDetailClient opdracht={opdracht} slug={slug} />;
}
