import { useState, useEffect } from 'react';
import { Map, Info, Palette } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { InteractiveMapScreen } from './components/InteractiveMapScreen';
import { ScavengerHuntScreen } from './components/ScavengerHuntScreen';
import { EmailSignupScreen } from './components/EmailSignupScreen';
import { InfoFaqScreen } from './components/InfoFaqScreen';
import { StayUpdatedPromoModal } from './components/StayUpdatedPromoModal';
import { HOME_ICON_URL, SCAVENGER_HUNT_ICON_URL } from './publicAssets';
import { AnalyticsEventType, recordAnalyticsEvent } from '../services/analyticsEvents';

const ANALYTICS_SESSION_KEY = 'thurtene-analytics-session';
const ANALYTICS_INITIAL_SCREEN_KEY = 'thurtene-analytics-initial-screen';

type Screen = 'home' | 'map' | 'scavenger' | 'signup' | 'info';

const STAY_UPDATED_PROMO_KEY = 'thurtene-stay-updated-promo-dismissed';
const THEME_STORAGE_KEY = 'thurtene-theme';
const THEMES = [
  { id: 'day', label: 'Day', swatch1: '#fbee08', swatch2: '#0f100d' },
  { id: 'night', label: 'Night', swatch1: '#0f100d', swatch2: '#fbee08' },
] as const;

const navItems = [
  { id: 'home',      label: 'Home',  icon: null },
  { id: 'map',       label: 'Map',   icon: Map },
  { id: 'scavenger', label: 'Hunt',  icon: null },
  { id: 'info',      label: 'Info',  icon: Info },
] as const;

function markStayUpdatedPromoDismissed() {
  try {
    localStorage.setItem(STAY_UPDATED_PROMO_KEY, '1');
  } catch {
    // ignore
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [themeId, setThemeId] = useState<(typeof THEMES)[number]['id']>('day');
  const [themeOpen, setThemeOpen] = useState(false);
  const [showStayUpdatedPromo, setShowStayUpdatedPromo] = useState(false);

  // One “tab session” per browser tab (survives reload); see PAGE_LOAD for every load.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ANALYTICS_SESSION_KEY)) return;
      sessionStorage.setItem(ANALYTICS_SESSION_KEY, '1');
    } catch {
      return;
    }
    void recordAnalyticsEvent(AnalyticsEventType.APP_SESSION, {
      path: window.location.pathname,
    });
  }, []);

  // Every full page load (first open + reload); increments when you refresh.
  useEffect(() => {
    let navigationType: string | undefined;
    try {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      navigationType = nav?.type;
    } catch {
      // ignore
    }
    void recordAnalyticsEvent(AnalyticsEventType.PAGE_LOAD, {
      path: window.location.pathname,
      ...(navigationType ? { navigation_type: navigationType } : {}),
    });
  }, []);

  // QR deep link → scavenger + one landing screen_view per tab (dedupes Strict Mode / refresh noise)
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#scavenger-section-([A-E])$/i);
    if (match) {
      setCurrentScreen('scavenger');
    }
    try {
      if (sessionStorage.getItem(ANALYTICS_INITIAL_SCREEN_KEY)) return;
      sessionStorage.setItem(ANALYTICS_INITIAL_SCREEN_KEY, '1');
    } catch {
      return;
    }
    if (match) {
      void recordAnalyticsEvent(AnalyticsEventType.SCREEN_VIEW, {
        screen: 'scavenger',
        via: 'qr_hash',
      });
    } else {
      void recordAnalyticsEvent(AnalyticsEventType.SCREEN_VIEW, { screen: 'home' });
    }
  }, []);

  /** First visit: Stay Updated promo (skipped for scavenger QR links; persists per device after dismiss). */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.match(/^#scavenger-section-[A-E]$/i)) return;
    try {
      if (localStorage.getItem(STAY_UPDATED_PROMO_KEY) !== '1') {
        setShowStayUpdatedPromo(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load + apply theme (stored per browser/device)
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const validIds = new Set(THEMES.map((t) => t.id));
    const next = saved && validIds.has(saved) ? (saved as (typeof THEMES)[number]['id']) : 'day';
    setThemeId(next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  const applyTheme = (next: (typeof THEMES)[number]['id']) => {
    setThemeId(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
    window.scrollTo(0, 0);
    void recordAnalyticsEvent(AnalyticsEventType.SCREEN_VIEW, { screen });
  };

  const dismissStayUpdatedPromo = () => {
    markStayUpdatedPromoDismissed();
    setShowStayUpdatedPromo(false);
  };

  const goToSignupFromPromo = () => {
    markStayUpdatedPromoDismissed();
    setShowStayUpdatedPromo(false);
    handleNavigate('signup');
  };

  return (
    <div className="size-full bg-background overflow-auto">
      {/* Theme picker (top-right) */}
      <div className="fixed top-2 right-2 z-[60]">
        <button
          type="button"
          onClick={() => setThemeOpen((v) => !v)}
          className="p-2 rounded-xl bg-card border border-border shadow-lg text-foreground"
          aria-label="Choose color theme"
          title="Choose color theme"
        >
          <Palette className="w-5 h-5" />
        </button>
        {themeOpen && (
          <>
            <div
              className="fixed inset-0 z-[50]"
              onClick={() => setThemeOpen(false)}
              aria-hidden="true"
            />
            <div className="relative mt-2 z-[60] bg-card border border-border rounded-xl shadow-2xl p-2">
              <div className="flex flex-col gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      applyTheme(t.id);
                      setThemeOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                      themeId === t.id ? 'border-primary' : 'border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full shrink-0 border border-border"
                      style={{ background: `linear-gradient(135deg, ${t.swatch1}, ${t.swatch2})` }}
                    />
                    <span className="text-sm font-semibold text-foreground">{t.label}</span>
                    {themeId === t.id && (
                      <span className="ml-auto text-xs font-bold text-accent">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <StayUpdatedPromoModal
        open={showStayUpdatedPromo}
        onDismiss={dismissStayUpdatedPromo}
        onGoToSignup={goToSignupFromPromo}
      />

      {/* Screen Content */}
      <div className="pb-24">
        {currentScreen === 'home'      && <HomeScreen      onNavigate={handleNavigate} />}
        {currentScreen === 'map'       && <InteractiveMapScreen onNavigate={handleNavigate} />}
        {currentScreen === 'scavenger' && <ScavengerHuntScreen  onNavigate={handleNavigate} />}
        {currentScreen === 'signup'    && <EmailSignupScreen    onNavigate={handleNavigate} />}
        {currentScreen === 'info'      && <InfoFaqScreen        onNavigate={handleNavigate} />}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-primary z-50 shadow-2xl safe-bottom">
        <div className="flex">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentScreen === id || (id === 'info' && currentScreen === 'signup');
            return (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={`flex-1 py-3 px-1 transition-all ${
                  isActive
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground active:text-accent'
                }`}
              >
                <div className="flex flex-col items-center gap-1 w-full min-w-0">
                  <div className="flex h-11 w-full items-center justify-center shrink-0">
                    {id === 'home' ? (
                      <span
                        className="w-8 h-8 shrink-0 inline-block bg-current"
                        style={{
                          maskImage: `url(${HOME_ICON_URL})`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskImage: `url(${HOME_ICON_URL})`,
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                        }}
                      />
                    ) : id === 'scavenger' ? (
                      <span
                        className="w-7 h-7 shrink-0 inline-block bg-current"
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
                    ) : (
                      Icon && <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-accent block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
