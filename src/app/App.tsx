import { useState, useEffect } from 'react';
import { Store, Map, Search, Info } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { InteractiveMapScreen } from './components/InteractiveMapScreen';
import { ScavengerHuntScreen } from './components/ScavengerHuntScreen';
import { EmailSignupScreen } from './components/EmailSignupScreen';
import { InfoFaqScreen } from './components/InfoFaqScreen';

type Screen = 'home' | 'map' | 'scavenger' | 'signup' | 'info';

const HOME_ICON = '/home-icon.png';

const navItems = [
  { id: 'home',      label: 'Home',  icon: null },
  { id: 'map',       label: 'Map',   icon: Map },
  { id: 'scavenger', label: 'Hunt',  icon: Search },
  { id: 'info',      label: 'Info',  icon: Info },
] as const;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // When opened via QR code (e.g. #scavenger-section-A), go to scavenger screen
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#scavenger-section-([A-E])$/i);
    if (match) setCurrentScreen('scavenger');
  }, []);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
    window.scrollTo(0, 0);
  };

  return (
    <div className="size-full bg-background overflow-auto">
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
                <div className="flex flex-col items-center gap-1">
                  {id === 'home' ? (
                    <span
                      className="w-6 h-6 shrink-0 inline-block bg-current"
                      style={{
                        maskImage: `url(${HOME_ICON})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${HOME_ICON})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  ) : (
                    Icon && <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  )}
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
