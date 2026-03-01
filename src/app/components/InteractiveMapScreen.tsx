import { useState, useRef, useCallback } from 'react';
import { X, ChevronLeft, List, MapPin, Star } from 'lucide-react';

const MAP_IMAGE = '/image.png';
const STORAGE_KEY = 'thurtene-carnival-map-pins';

/** Load pin positions from localStorage (from when you had locked custom positions). */
function loadSavedPositions(): Record<number, { x: number; y: number }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { positions?: Record<number, { x: number; y: number }> };
      if (data.positions && typeof data.positions === 'object') {
        const merged: Record<number, { x: number; y: number }> = {};
        booths.forEach((b) => {
          merged[b.id] = data.positions![b.id] ?? { x: b.x, y: b.y };
        });
        return merged;
      }
    }
  } catch {
    // ignore
  }
  return Object.fromEntries(booths.map((b) => [b.id, { x: b.x, y: b.y }]));
}

interface Booth {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  section: string;
}

const booths: Booth[] = [
  // Section A – right edge (pins moved left to align with gray boxes)
  { id: 1,  name: 'Little Bit Foundation',           description: 'Community Partner',                                   x: 87.5, y: 37,   section: 'A' },
  { id: 2,  name: 'Thurtene Alumni Tent',            description: 'Carnival Information & T-shirts',                    x: 87.5, y: 41,   section: 'A' },
  { id: 3,  name: 'Partner in East St. Louis',       description: 'Informational',                                      x: 87.5, y: 45,   section: 'A' },
  { id: 4,  name: 'Delta Sigma Pi',                  description: 'Funnel Cakes',                                       x: 87.5, y: 49,   section: 'A' },
  { id: 5,  name: 'Swim & Dive',                     description: 'Cotton candy, Hot dogs',                             x: 87.5, y: 53,   section: 'A' },
  { id: 6,  name: 'Tau Kappa Epsilon & Chi Omega',   description: 'Turkey legs',                                        x: 87.5, y: 57,   section: 'A' },
  { id: 7,  name: 'Zeta Phi Beta & Phi Beta Sigma',  description: 'Smoothies',                                          x: 87.5, y: 61,   section: 'A' },
  // Section B – horizontal middle row (pins shifted right to center over boxes)
  { id: 8,  name: 'TSO/HKSA/JSO/AMPAMSA',           description: 'Taiyaki, shuttlecock, drawing',                      x: 30,   y: 44,   section: 'B' },
  { id: 9,  name: 'TSO/HKSA/JSO/AMPAMSA',           description: 'Taiyaki, shuttlecock, drawing',                      x: 34,   y: 44,   section: 'B' },
  { id: 10, name: 'Alpha Iota Gamma',                description: 'Lemonade',                                           x: 38,   y: 44,   section: 'B' },
  { id: 11, name: 'Alpha Kappa Psi',                 description: 'Mini Donuts',                                        x: 42,   y: 44,   section: 'B' },
  { id: 12, name: 'Relay for Life & Camp Kesem',     description: 'Tropical drinks, Popcorn, and Coffee',               x: 46,   y: 44,   section: 'B' },
  { id: 13, name: 'Phi Gamma Nu',                    description: 'Snow cones',                                         x: 50,   y: 44,   section: 'B' },
  { id: 14, name: 'Heart for the Unhoused',          description: 'Crepes',                                             x: 54,   y: 44,   section: 'B' },
  { id: 15, name: 'Campus Y',                        description: 'Pretzels',                                           x: 58,   y: 44,   section: 'B' },
  { id: 16, name: 'WUPD',                            description: 'WUPD Puppies',                                       x: 62,   y: 44,   section: 'B' },
  // Section C – bottom row (pins shifted right to center over boxes)
  { id: 17, name: 'Sigma Nu & Kappa Kappa Gamma',    description: 'Fried Oreos',                                        x: 42,   y: 80,   section: 'C' },
  { id: 18, name: 'Alpha Delta Phi & Gamma Phi Beta',description: 'Burgers, Grilled cheese',                            x: 46,   y: 80,   section: 'C' },
  { id: 19, name: 'Sigma Phi Epsilon & Kappa Delta', description: 'Waffles',                                            x: 50,   y: 80,   section: 'C' },
  { id: 20, name: 'Sigma Alpha Epsilon & Alpha Phi', description: 'Beignets',                                           x: 54,   y: 80,   section: 'C' },
  { id: 21, name: 'Zeta Beta Tau',                   description: 'Street tacos, Churros, and Quesadillas',             x: 58,   y: 80,   section: 'C' },
  { id: 22, name: 'Alpha Epsilon Pi & Alpha Epsilon Phi', description: 'Italian ice',                                   x: 62,   y: 80,   section: 'C' },
  // Section D – left side (pins moved right to align with gray boxes)
  { id: 23, name: 'Chabad',                          description: 'Deli sandwiches and pickles',                        x: 22,   y: 25,   section: 'D' },
  { id: 24, name: 'China Care Club and BoCo',        description: 'Boba, Egg tarts, Dumplings',                         x: 22,   y: 30,   section: 'D' },
  { id: 25, name: 'Bear-Y-Sweete',                   description: 'Gummy candy with Topping',                           x: 22,   y: 34.5, section: 'D' },
  { id: 26, name: 'Belegarth',                       description: 'Sparring pit',                                       x: 22,   y: 39,   section: 'D' },
  { id: 27, name: 'Belegarth',                       description: 'Sparring pit',                                       x: 22,   y: 43.5, section: 'D' },
  { id: 28, name: "Black Men's Coalition",           description: 'Football throw',                                     x: 22,   y: 48,   section: 'D' },
  { id: 29, name: 'Strike Magazine',                 description: 'Thrift shop',                                        x: 22,   y: 52,   section: 'D' },
  // Section E – vertical stack near E (aligned with numbered boxes)
  { id: 30, name: 'Globe Med',                       description: 'Face painting, Temporary tattoos and Henna',         x: 59,   y: 18,   section: 'E' },
  { id: 31, name: 'Theta Xi',                        description: 'Pie a Xi',                                           x: 59,   y: 22,   section: 'E' },
  { id: 32, name: 'Olin Business Council',           description: 'Cup pong game',                                      x: 59,   y: 26,   section: 'E' },
  { id: 33, name: 'Phi Delta Epsilon',               description: 'Basketball game',                                    x: 59,   y: 30,   section: 'E' },
  { id: 34, name: 'Congress of the South 40',        description: 'Ring toss & Dunk tank',                              x: 59,   y: 34,   section: 'E' },
];

const sectionColors: Record<string, string> = {
  A: '#fbee08',
  B: '#e6d906',
  C: '#d1c405',
  D: '#bcaf04',
  E: '#a79a03',
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

type ViewMode = 'list' | 'map';

export function InteractiveMapScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [positions] = useState<Record<number, { x: number; y: number }>>(loadSavedPositions);
  const viewportRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStartRef = useRef({ panX: 0, panY: 0, clientX: 0, clientY: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const handleMapPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      panStartRef.current = { panX: pan.x, panY: pan.y, clientX: e.clientX, clientY: e.clientY };
      setIsPanning(true);
    },
    [pan.x, pan.y]
  );

  const handleMapPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    const { panX, panY, clientX, clientY } = panStartRef.current;
    setPan({ x: panX + e.clientX - clientX, y: panY + e.clientY - clientY });
  }, [isPanning]);

  const handleMapPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (!viewportRef.current || !innerRef.current) return;
      const vp = viewportRef.current.getBoundingClientRect();
      const vx = e.clientX - vp.left;
      const vy = e.clientY - vp.top;
      const contentX = (vx - pan.x) / scale;
      const contentY = (vy - pan.y) / scale;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
      const newPanX = vx - contentX * newScale;
      const newPanY = vy - contentY * newScale;
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    },
    [pan.x, pan.y, scale]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b-2 border-primary p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          className="text-foreground p-1 rounded-lg flex items-center gap-1 hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <h1
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Carnival Map
        </h1>
        <div className="w-16" />
      </div>

      {/* List / Map toggle – prominent */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex rounded-xl overflow-hidden border-2 border-border shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-base font-bold transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <List className="w-5 h-5 shrink-0" />
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-base font-bold transition-colors ${
              viewMode === 'map'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <MapPin className="w-5 h-5 shrink-0" />
            Map
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List view: all booths by section, no map */
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          <p className="text-xs text-center text-muted-foreground py-2 px-4">
            Tap a booth to see details
          </p>
          {(['A', 'B', 'C', 'D', 'E'] as const).map((section) => {
            const sectionBooths = booths.filter((b) => b.section === section);
            if (sectionBooths.length === 0) return null;
            return (
              <div key={section} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-background shrink-0"
                    style={{ backgroundColor: sectionColors[section] }}
                  >
                    {section}
                  </span>
                  <h2
                    className="text-sm font-bold text-accent uppercase tracking-widest"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Section {section}
                  </h2>
                </div>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {sectionBooths.map((booth) => (
                    <button
                      key={booth.id}
                      type="button"
                      onClick={() => setSelectedBooth(booth)}
                      className="w-full flex items-center gap-3 p-3.5 text-left border-b border-border last:border-b-0 hover:bg-muted/50 active:bg-muted transition-colors"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background shrink-0"
                        style={{ backgroundColor: sectionColors[booth.section] ?? '#fbee08' }}
                      >
                        {booth.id}
                      </span>
                      <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                        {booth.name}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase shrink-0">
                        #{booth.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <p className="text-xs text-center text-muted-foreground py-2 px-4">
            Tap a numbered badge to see booth details
          </p>
          <p className="text-[10px] text-center text-muted-foreground/80 px-4 -mt-1">
            Pinch or scroll to zoom · Drag map to pan
          </p>

          {/* Map viewport: zoom/pan stays inside this box */}
          <div
            ref={viewportRef}
            className="relative mx-3 rounded-xl overflow-hidden border border-border shadow-xl select-none h-[55vh] min-h-[280px] max-h-[500px] touch-none"
            onWheel={handleWheel}
            style={{ touchAction: 'none' }}
          >
            <div
              ref={innerRef}
              className="relative w-full origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              }}
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerCancel={handleMapPointerUp}
            >
              <img
                src={MAP_IMAGE}
                alt="ThurtenE Carnival Map"
                className="w-full block pointer-events-none"
              />
              {/* Booth tap zones – positions from your saved layout when you had locked it */}
              {booths.map((booth) => {
                const pos = positions[booth.id] ?? { x: booth.x, y: booth.y };
                return (
                  <button
                    key={booth.id}
                    type="button"
                    onClick={() => setSelectedBooth(booth)}
                    className={`absolute flex items-center justify-center rounded-full text-[9px] font-bold shadow-lg transition-transform touch-none cursor-pointer hover:scale-110 active:scale-95 ${isPanning ? 'pointer-events-none' : ''}`}
                    style={{
                      top: `${pos.y}%`,
                      left: `${pos.x}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '18px',
                      height: '18px',
                      color: '#0f100d',
                      backgroundColor: sectionColors[booth.section] ?? '#fbee08',
                      border: '1.5px solid rgba(255,255,255,0.6)',
                    }}
                  >
                    {booth.id}
                  </button>
                );
              })}
            </div>
          </div>

      {/* Map key: DR. G's Fun House Stage */}
          <div className="mx-3 mt-3 mb-4 bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/dr-g-ship.png"
                alt=""
                className="w-8 h-8 object-contain shrink-0"
              />
              <p
                className="text-sm font-bold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                DR. G&apos;s Fun House Stage
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-black text-black shrink-0" />
                <span className="text-xs text-foreground">Entrance</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-red-500 text-red-500 shrink-0" />
                <span className="text-xs text-foreground">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm shrink-0 bg-[#c45ec4]" />
                <span className="text-xs text-foreground">ATM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm shrink-0 bg-blue-500" />
                <span className="text-xs text-foreground">Water Station</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm shrink-0 bg-green-600" />
                <span className="text-xs text-foreground">Waste Station</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm shrink-0 bg-amber-800" />
                <span className="text-xs text-foreground">Porta-Potties</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Sheet Modal */}
      {selectedBooth && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSelectedBooth(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 z-50 rounded-t-2xl shadow-2xl"
            style={{ borderColor: sectionColors[selectedBooth.section] ?? '#fbee08' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="p-6 pb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-background shrink-0 mt-0.5"
                    style={{ backgroundColor: sectionColors[selectedBooth.section] ?? '#fbee08' }}
                  >
                    {selectedBooth.id}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                      Section {selectedBooth.section}
                    </p>
                    <h2
                      className="text-xl font-bold text-foreground leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedBooth.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {selectedBooth.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooth(null)}
                  className="ml-3 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
