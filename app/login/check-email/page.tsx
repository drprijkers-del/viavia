import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

export default function CheckEmailPage() {
  return (
    <div className="app-frame flex flex-col items-center justify-center" style={{ minHeight: "100vh" }}>
      <ViaViaLogo size="lg" href="/" />
      <div className="card w-full mt-8">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">Check je email</h1>
          <p className="text-muted mb-4">
            We hebben je een inloglink gestuurd. Klik op de link in de email om in te loggen.
          </p>
          <p className="text-sm text-tertiary mb-6">
            Je kunt dit venster sluiten.
          </p>
        </div>
        <Link href="/">
          <button className="btn btn-secondary w-full">
            Terug naar home
          </button>
        </Link>
      </div>
    </div>
  );
}
