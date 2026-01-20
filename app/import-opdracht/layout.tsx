import { Suspense } from "react";

export default function ImportOpdrachtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Laden...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
