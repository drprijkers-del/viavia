import Link from "next/link";
import ViaViaLogo from "./components/ViaViaLogo";

export default function LandingPage() {
  return (
    <div className="app-frame hero-gradient overflow-hidden">
      <div className="app-container-full pb-24">
        {/* Header */}
        <header className="flex items-center justify-between py-6 animate-fade-in">
          <ViaViaLogo size="md" href="/" />
          <nav className="flex items-center gap-6">
            <a href="#features" className="hidden md:block text-secondary hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hidden md:block text-secondary hover:text-white transition-colors">
              Hoe het werkt
            </a>
            <a href="#download" className="hidden md:block text-secondary hover:text-white transition-colors">
              Download
            </a>
            <Link href="/login">
              <button className="text-sm text-accent hover:opacity-80 transition-opacity md:btn md:btn-secondary md:text-base">
                Inloggen
              </button>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto mb-16 md:mb-24 lg:mb-32 mt-8 md:mt-20 lg:mt-28">
          <div className="animate-slide-up">
            <span className="inline-block glass-accent rounded-full px-5 py-2.5 text-sm text-accent mb-8 md:mb-10">
              Freelance opdrachten georganiseerd
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 md:mb-8 leading-tight">
              ViaVia — freelance opdrachten,{" "}
              <span className="gradient-text">zonder WhatsApp-scrollen</span>
            </h1>
            <p className="text-base md:text-xl text-secondary mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto">
              Beheer via-via opdrachten voor al je WhatsApp-groepen op één plek.
              Reageren doe je gewoon via WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Link href="/dashboard">
              <button className="btn btn-primary btn-glow px-8 py-4 text-lg w-full sm:w-auto">
                Maak een groepsoverzicht
              </button>
            </Link>
            <a href="#download">
              <button className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto mb-4 md:mb-0">
                Installeer de app
              </button>
            </a>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="desktop-grid-3 max-w-5xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <div className="card card-gradient card-hover-lift text-center animate-slide-up py-6 md:py-8" style={{ animationDelay: "150ms" }}>
            <div className="text-4xl md:text-5xl mb-4 animate-float" style={{ animationDelay: "0ms" }}>💬</div>
            <p className="text-white font-semibold mb-2 md:text-lg">Werkt met elke WhatsApp-groep</p>
            <p className="text-sm md:text-base text-tertiary">Geen koppeling nodig</p>
          </div>
          <div className="card card-gradient card-hover-lift text-center animate-slide-up py-6 md:py-8" style={{ animationDelay: "200ms" }}>
            <div className="text-4xl md:text-5xl mb-4 animate-float" style={{ animationDelay: "200ms" }}>🔒</div>
            <p className="text-white font-semibold mb-2 md:text-lg">Privé & veilig</p>
            <p className="text-sm md:text-base text-tertiary">Alleen toegankelijk via link</p>
          </div>
          <div className="card card-gradient card-hover-lift text-center animate-slide-up py-6 md:py-8" style={{ animationDelay: "250ms" }}>
            <div className="text-4xl md:text-5xl mb-4 animate-float" style={{ animationDelay: "400ms" }}>⚡</div>
            <p className="text-white font-semibold mb-2 md:text-lg">Snel reageren</p>
            <p className="text-sm md:text-base text-tertiary">Direct naar WhatsApp</p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-4xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10 md:mb-16">
            Hoe werkt het?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl gradient-accent flex items-center justify-center text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 shadow-lg shadow-[#34C759]/30">
                1
              </div>
              <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Maak een groepsoverzicht</h3>
              <p className="text-secondary text-sm md:text-base">Eén klik om een overzicht te maken voor je WhatsApp-groep</p>
            </div>
            <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl gradient-accent flex items-center justify-center text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 shadow-lg shadow-[#34C759]/30">
                2
              </div>
              <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Deel de link in WhatsApp</h3>
              <p className="text-secondary text-sm md:text-base">Groepsleden kunnen direct opdrachten bekijken en plaatsen</p>
            </div>
            <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl gradient-accent flex items-center justify-center text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 shadow-lg shadow-[#34C759]/30">
                3
              </div>
              <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Reageer met één tap</h3>
              <p className="text-secondary text-sm md:text-base">Overzicht in ViaVia, communicatie gewoon via WhatsApp</p>
            </div>
          </div>
        </section>

        {/* Features / Benefits */}
        <section id="features" className="max-w-5xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10 md:mb-16">
            Waarom ViaVia?
          </h2>
          <div className="desktop-grid-3 stagger-animate">
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">Altijd overzicht per groep</h3>
                <p className="text-sm md:text-base text-tertiary">Geen scrollen meer door WhatsApp-berichten</p>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">Post één keer, deel overal</h3>
                <p className="text-sm md:text-base text-tertiary">Bespaar tijd bij het verspreiden van opdrachten</p>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">Reageren via WhatsApp</h3>
                <p className="text-sm md:text-base text-tertiary">Gesprekken blijven waar ze horen</p>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">Zie wat open of ingevuld is</h3>
                <p className="text-sm md:text-base text-tertiary">Status altijd up-to-date</p>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">QR & invite links</h3>
                <p className="text-sm md:text-base text-tertiary">Makkelijk delen met groepsleden</p>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift flex items-start gap-4 md:flex-col md:items-start md:gap-0">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-[#34C759]/20 flex items-center justify-center text-accent shrink-0 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 md:text-lg">Installeerbaar als app</h3>
                <p className="text-sm md:text-base text-tertiary">Werkt als native app op je telefoon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="max-w-3xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <div className="card card-elevated text-center p-6 md:p-12 lg:p-16">
            <span className="inline-block glass-accent rounded-full px-5 py-2.5 text-sm text-accent mb-6 md:mb-8">
              Progressive Web App
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Gebruik ViaVia als app
            </h2>
            <p className="text-secondary text-sm md:text-base mb-8 md:mb-10 max-w-lg mx-auto">
              Installeer ViaVia op je telefoon voor de beste ervaring
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-10">
              <Link href="/download">
                <button className="btn btn-primary btn-glow px-6 md:px-8 py-3.5 md:py-4 w-full sm:w-auto">
                  Installeer ViaVia
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="btn btn-secondary px-6 md:px-8 py-3.5 md:py-4 w-full sm:w-auto">
                  Open in browser
                </button>
              </Link>
            </div>

            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 text-left">
              <div className="flex items-start gap-4 glass rounded-xl p-4 md:p-5">
                <span className="text-2xl shrink-0">📱</span>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1">iOS (iPhone/iPad)</h3>
                  <p className="text-xs md:text-sm text-tertiary">
                    Safari → Deel (⬆️) → Zet op beginscherm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 glass rounded-xl p-4 md:p-5">
                <span className="text-2xl shrink-0">🤖</span>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1">Android</h3>
                  <p className="text-xs md:text-sm text-tertiary">
                    Chrome → Menu → App installeren
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="max-w-3xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <div className="card card-gradient p-6 md:p-12">
            <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
              <div className="text-3xl md:text-4xl shrink-0 md:mb-4">🔓</div>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">
                  Open & transparant
                </h2>
                <p className="text-secondary text-sm md:text-base md:max-w-lg md:mx-auto">
                  ViaVia is gebouwd met open webtechnologie. We overwegen om de code open source te maken.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-16">
            Veelgestelde vragen
          </h2>
          <div className="space-y-4 md:space-y-6 stagger-animate">
            <div className="card card-gradient card-hover-lift">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold shrink-0">Q</span>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1.5">
                    Is ViaVia gekoppeld aan WhatsApp?
                  </h3>
                  <p className="text-tertiary text-xs md:text-sm">
                    Nee. ViaVia leest geen WhatsApp-berichten. Het biedt alleen overzicht.
                  </p>
                </div>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold shrink-0">Q</span>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1.5">
                    Wie ziet de opdrachten?
                  </h3>
                  <p className="text-tertiary text-xs md:text-sm">
                    Alleen mensen met de groepslink. Niet openbaar vindbaar.
                  </p>
                </div>
              </div>
            </div>
            <div className="card card-gradient card-hover-lift">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold shrink-0">Q</span>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1.5">
                    Moet iedereen een account maken?
                  </h3>
                  <p className="text-tertiary text-xs md:text-sm">
                    Nee. Lezen kan zonder account. Plaatsen vereist een account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-secondary text-sm md:text-base mb-6 md:mb-8">
              Maak gratis je eerste groepsoverzicht
            </p>
            <Link href="/dashboard">
              <button className="btn btn-primary btn-glow px-8 md:px-10 py-3.5 md:py-4 text-base md:text-lg">
                Start nu gratis
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 md:pt-12 border-t border-[#3A3A3C]/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <ViaViaLogo size="sm" />
            <div className="flex justify-center gap-8 text-sm text-tertiary">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
            <p className="text-xs text-tertiary">
              © 2026 ViaVia
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
