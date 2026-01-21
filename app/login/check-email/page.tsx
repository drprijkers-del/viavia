import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

export default function CheckEmailPage() {
  return (
    <div className="app-frame">
      <div className="app-container">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <ViaViaLogo size="lg" href="/" />
          <div className="card max-w-md w-full mt-8">
            <h1 className="text-2xl font-bold text-white mb-3">Check je email</h1>
            <p className="text-secondary mb-4">
              We hebben je een inloglink gestuurd. Klik op de link in de email om in te loggen.
            </p>
            <p className="text-sm text-tertiary mb-6">
              Je kunt dit venster sluiten.
            </p>
            <Link href="/">
              <button className="btn btn-secondary w-full">
                Terug naar home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
