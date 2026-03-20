import { Map, Bell, ExternalLink } from 'lucide-react';
import { SCAVENGER_HUNT_ICON_URL } from '../publicAssets';
import heroMark from '../../assets/thurtene-hero-mark.png';
import homeHeroBackground from '../../assets/home-hero-background.png';

/** Yellow-to-orange gradient CTAs (shared home actions). */
const HOME_ACTION_CLASS =
  'w-full bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d] py-5 px-6 text-lg font-bold rounded-xl flex items-center justify-center gap-3 shadow-sm hover:brightness-[1.03] active:scale-[0.98] transition-transform';

export function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
        {/* Background image */}
        <img
          src={homeHeroBackground}
          alt="ThurtenE Carnival"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />
        {/* Subtle diagonal stripe overlay for carnival feel */}
        <div
          className="absolute inset-0 carnival-stripe opacity-40"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-10 pb-8">
          {/* Full circular yellow ring completes the mark; artwork sits on white inside the circle */}
          <div className="mb-4 inline-flex rounded-full p-[3px] bg-primary shadow-2xl ring-2 ring-white/35">
            <div className="rounded-full bg-white p-0.5 sm:p-1 overflow-hidden">
              <img
                src={heroMark}
                alt="ThurtenE Carnival"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain block mx-auto scale-[1.34] origin-center"
              />
            </div>
          </div>
          <h1
            className="text-4xl font-extrabold text-center text-white tracking-tight drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ThurtenE Carnival
          </h1>
          <p className="mt-2 text-white text-sm font-bold uppercase tracking-widest drop-shadow">
            April 17 – 19, 2026
          </p>
          <a
            href="https://www.thurtene.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 bg-[#ea580c] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-[#c2410c] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            Official Website
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">

        {/* Description card */}
        <div className="rounded-xl border-2 border-[#d4183d] bg-[#f7f2e8] p-5 mb-5 shadow-lg">
          <p className="text-center text-[#0f100d] leading-relaxed font-medium">
            Three days of carnival games, live entertainment, incredible food, and prizes on the WashU campus.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: '34', label: 'Booths' },
            { value: '3',  label: 'Days' },
            { value: 'Free', label: 'Entry' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card border-2 border-[#fb923c] rounded-xl p-3 flex flex-col items-center shadow-sm"
            >
              <span
                className="text-2xl font-bold text-accent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 mt-auto">
          <button type="button" onClick={() => onNavigate('map')} className={HOME_ACTION_CLASS}>
            <Map className="w-6 h-6 shrink-0" strokeWidth={2} />
            View Interactive Map
          </button>

          <button type="button" onClick={() => onNavigate('scavenger')} className={HOME_ACTION_CLASS}>
            <span
              className="w-7 h-7 shrink-0 inline-block bg-current text-[#0f100d]"
              aria-hidden
              style={{
                maskImage: `url(${SCAVENGER_HUNT_ICON_URL})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: `url(${SCAVENGER_HUNT_ICON_URL})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
            Join Scavenger Hunt
          </button>

          <button type="button" onClick={() => onNavigate('signup')} className={HOME_ACTION_CLASS}>
            <Bell className="w-6 h-6 shrink-0" strokeWidth={2} />
            Stay Updated
          </button>
        </div>

        {/* Secondary link */}
        <div className="mt-5 text-center">
          <button
            onClick={() => onNavigate('info')}
            className="text-accent underline underline-offset-2 text-sm font-semibold hover:opacity-90 transition-colors"
          >
            View Info &amp; FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
