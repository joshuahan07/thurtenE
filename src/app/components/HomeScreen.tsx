import { MapPin, Search, Bell, ExternalLink } from 'lucide-react';
import logo from '../../assets/thurtene-logo.jpeg';
import carnivalBg from '../../assets/carnival-hero.jpg';

export function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
        {/* Background image */}
        <img
          src={carnivalBg}
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
          <img
            src={logo}
            alt="ThurtenE Carnival Logo"
            className="w-28 h-28 object-contain rounded-full shadow-2xl border-2 border-accent mb-4"
          />
          <h1
            className="text-4xl font-extrabold text-center text-white tracking-tight drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ThurtenE Carnival
          </h1>
          <p className="mt-2 text-accent text-sm font-semibold uppercase tracking-widest drop-shadow">
            April 17 – 19, 2026
          </p>
          <a
            href="https://www.thurtene.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Official Website
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">

        {/* Description card */}
        <div className="bg-card border border-border rounded-xl p-5 mb-5 shadow-lg">
          <p className="text-center text-foreground leading-relaxed">
            Three days of carnival games, live entertainment, incredible food, and prizes — right on the Wash U campus. Your pocket guide to everything ThurtenE.
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
              className="bg-card border border-border rounded-xl p-3 flex flex-col items-center shadow"
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
          <button
            onClick={() => onNavigate('map')}
            className="w-full carnival-gradient text-white py-5 px-6 text-lg font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
          >
            <MapPin className="w-6 h-6" />
            View Interactive Map
          </button>

          <button
            onClick={() => onNavigate('scavenger')}
            className="w-full bg-card text-foreground py-5 px-6 text-lg font-bold rounded-xl border-2 border-primary flex items-center justify-center gap-3 shadow hover:bg-muted active:scale-[0.98] transition-all"
          >
            <Search className="w-6 h-6 text-primary" />
            Join Scavenger Hunt
          </button>

          <button
            onClick={() => onNavigate('signup')}
            className="w-full bg-card text-foreground py-5 px-6 text-lg font-bold rounded-xl border border-border flex items-center justify-center gap-3 shadow hover:bg-muted active:scale-[0.98] transition-all"
          >
            <Bell className="w-6 h-6 text-muted-foreground" />
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
