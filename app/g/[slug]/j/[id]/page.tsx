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
      <div className="app-frame flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold mb-4">
            Opdracht niet gevonden
          </h2>
          <Link href={`/g/${slug}`}>
            <button className="btn btn-primary">
              ← Terug
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <OpdrachtDetailClient opdracht={opdracht} slug={slug} />;
}
