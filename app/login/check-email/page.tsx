import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-5">
      <ViaViaLogo size="lg" href="/" />
      <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-[#2C2C2E] max-w-md w-full mt-8">
        <h1 className="text-2xl font-bold text-white mb-3">Check je email</h1>
        <p className="text-[#8E8E93] mb-4">
          We hebben je een inloglink gestuurd. Klik op de link in de email om in te loggen.
        </p>
        <p className="text-sm text-[#636366] mb-6">
          Je kunt dit venster sluiten.
        </p>
        <Link href="/">
          <button className="w-full bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-medium rounded-full py-3.5 transition-colors">
            Terug naar home
          </button>
        </Link>
      </div>
    </div>
  );
}
