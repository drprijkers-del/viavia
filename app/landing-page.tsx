import Link from "next/link";
import ViaViaLogo from "./components/ViaViaLogo";

export default function LandingPage() {
  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <ViaViaLogo size="md" href="/" />
          <Link href="/login">
            <button className="text-sm text-accent hover:opacity-80">
              Inloggen
            </button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            ViaVia — freelance opdrachten, zonder WhatsApp-scrollen
          </h1>
          <p className="text-lg text-secondary mb-8 leading-relaxed">
            Beheer via-via opdrachten voor al je WhatsApp-groepen op één plek.
            Reageren doe je gewoon via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                Maak een groepsoverzicht
              </button>
            </Link>
            <a href="#download">
              <button className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
                Installeer de app
              </button>
            </a>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
          <div className="card text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-white font-semibold mb-1">Werkt met elke WhatsApp-groep</p>
            <p className="text-sm text-tertiary">Geen koppeling nodig</p>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-white font-semibold mb-1">Privé & veilig</p>
            <p className="text-sm text-tertiary">Alleen toegankelijk via link</p>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-white font-semibold mb-1">Snel reageren</p>
            <p className="text-sm text-tertiary">Direct naar WhatsApp</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Hoe werkt het?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Maak een groepsoverzicht</h3>
                <p className="text-secondary">Eén klik om een overzicht te maken voor je WhatsApp-groep</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Deel de link in WhatsApp</h3>
                <p className="text-secondary">Groepsleden kunnen direct opdrachten bekijken en plaatsen</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Plaats opdrachten en reageer met één tap</h3>
                <p className="text-secondary">Overzicht in ViaVia, communicatie gewoon via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Waarom ViaVia?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ Altijd overzicht per groep</h3>
              <p className="text-sm text-tertiary">Geen scrollen meer door WhatsApp-berichten</p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ Post één keer, deel in meerdere groepen</h3>
              <p className="text-sm text-tertiary">Bespaar tijd bij het verspreiden van opdrachten</p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ Reageren direct via WhatsApp</h3>
              <p className="text-sm text-tertiary">Gesprekken blijven waar ze horen</p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ Zie wat open of ingevuld is</h3>
              <p className="text-sm text-tertiary">Status altijd up-to-date</p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ QR & invite links</h3>
              <p className="text-sm text-tertiary">Makkelijk delen met groepsleden</p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">✓ Installeerbaar als app</h3>
              <p className="text-sm text-tertiary">Werkt als native app op je telefoon</p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div id="download" className="max-w-2xl mx-auto mb-16">
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Gebruik ViaVia als app
            </h2>
            <p className="text-secondary mb-8">
              Installeer ViaVia op je telefoon voor de beste ervaring
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/download">
                <button className="btn btn-primary px-8 py-4 w-full sm:w-auto">
                  Installeer ViaVia
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="btn btn-secondary px-8 py-4 w-full sm:w-auto">
                  Open in browser
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-white font-semibold mb-2">📱 iOS (iPhone/iPad)</h3>
                <p className="text-sm text-tertiary">
                  Open in Safari → Tik op Deel (⬆️) → &apos;Zet op beginscherm&apos;
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">🤖 Android</h3>
                <p className="text-sm text-tertiary">
                  Open in Chrome → Menu → &apos;Installeren&apos; of &apos;App installeren&apos;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Open & transparant
            </h2>
            <p className="text-secondary mb-4">
              ViaVia is gebouwd met open webtechnologie. We overwegen om (delen van) de code open source te maken,
              zodat communities het zelf kunnen hosten of uitbreiden.
            </p>
            <p className="text-sm text-tertiary">
              Mogelijke licentie: MIT • Status: In overweging
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Veelgestelde vragen
          </h2>
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-white font-semibold mb-2">
                Is ViaVia gekoppeld aan WhatsApp?
              </h3>
              <p className="text-secondary text-sm">
                Nee. ViaVia leest of beheert geen WhatsApp-berichten. Het biedt alleen overzicht en gebruikt WhatsApp om te reageren.
              </p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">
                Wie ziet de opdrachten?
              </h3>
              <p className="text-secondary text-sm">
                Alleen mensen met de groepslink of uitnodiging. Opdrachten zijn niet openbaar vindbaar.
              </p>
            </div>
            <div className="card">
              <h3 className="text-white font-semibold mb-2">
                Moet iedereen een account maken?
              </h3>
              <p className="text-secondary text-sm">
                Nee. Opdrachten lezen kan zonder account. Voor beheren en plaatsen is een account nodig.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto">
          <Link href="/dashboard">
            <button className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto">
              Start nu gratis
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-tertiary/20 text-center">
          <div className="flex justify-center gap-8 text-sm text-tertiary mb-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-tertiary">
            © 2026 ViaVia • Gemaakt met ❤️ voor freelancers
          </p>
        </div>
      </div>
    </div>
  );
}
