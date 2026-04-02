import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { X, ChevronLeft, ChevronDown, List, MapPin, Star, Store } from 'lucide-react';

// Static carnival map image served from public/
const MAP_IMAGE = '/newmap.png';

interface Booth {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  section: string;
}

const booths: Booth[] = [
  // Section A
  { id: 1,  name: 'ALUMNI',                    description: 'Alumni Check-in',                                               x: 0, y: 0, section: 'A' },
  { id: 2,  name: 'STL ARC',                  description: 'Community Partner',                                              x: 0, y: 0, section: 'A' },
  { id: 3,  name: 'LOCAL ON DELMAR',          description: 'Activity',                                                      x: 0, y: 0, section: 'A' },
  { id: 4,  name: 'TKE & CHIO',               description: 'Turkey legs',                                                   x: 0, y: 0, section: 'A' },
  { id: 5,  name: 'RELAY FOR LIFE',           description: 'Mocktails',                                                     x: 0, y: 0, section: 'A' },
  { id: 6,  name: 'PARTNERS IN EAST ST. LOUIS', description: 'Barbeque',                                                   x: 0, y: 0, section: 'A' },
  { id: 7,  name: 'PGN',                      description: 'Snow cones',                                                    x: 0, y: 0, section: 'A' },
  { id: 8,  name: 'CASA',                     description: 'Beef/chicken patties, yaniqueque, coquito, switcha',           x: 0, y: 0, section: 'A' },
  { id: 9,  name: 'ZBT',                      description: 'Tacos, quesadillas',                                            x: 0, y: 0, section: 'A' },

  // Section B
  { id: 10, name: 'DSP',                      description: 'Funnel cakes',                                                  x: 0, y: 0, section: 'B' },
  { id: 11, name: 'KKG & SNU',                description: 'Deep fried oreos',                                              x: 0, y: 0, section: 'B' },
  { id: 12, name: 'SAE & APHI',               description: 'Trickshot challenge, burgers',                                  x: 0, y: 0, section: 'B' },
  { id: 13, name: 'CAMPUS CREAMERY',          description: 'Ice cream, waffles',                                            x: 0, y: 0, section: 'B' },
  { id: 14, name: 'HKSA, TSO, JSO',           description: 'Matcha, taiyaki',                                               x: 0, y: 0, section: 'B' },
  { id: 15, name: 'BOOKS AND BASKETBALL',     description: 'Popcorn',                                                       x: 0, y: 0, section: 'B' },
  { id: 16, name: 'PUSO, VSA, APAMSA, CHINA CARE', description: 'Mango sticky rice, Thai tea, calamansi juice',           x: 0, y: 0, section: 'B' },
  { id: 17, name: 'CAMPUS Y',                 description: 'Pretzels',                                                      x: 0, y: 0, section: 'B' },

  // Section C
  { id: 18, name: 'DANCE MARATHON',           description: 'Hair color/style, photobooth',                                  x: 0, y: 0, section: 'C' },
  { id: 19, name: 'PDP',                      description: 'Spin-a-wheel legal trivia',                                     x: 0, y: 0, section: 'C' },
  { id: 20, name: 'SHPE',                     description: 'Pie a member, face painting',                                   x: 0, y: 0, section: 'C' },
  { id: 21, name: 'GPHI & BETA',              description: 'Mini golf',                                                     x: 0, y: 0, section: 'C' },
  { id: 22, name: 'WUPD',                     description: 'Puppies',                                                       x: 0, y: 0, section: 'C' },

  // Section D
  { id: 23, name: 'SKANDALARIS',              description: 'Candy',                                                         x: 0, y: 0, section: 'D' },
  { id: 24, name: 'THETA XI & KD',            description: 'Italian ice',                                                   x: 0, y: 0, section: 'D' },
  { id: 25, name: 'VARSITY SWIM & DIVE',      description: 'Cotton candy, hot dogs, bratwursts',                           x: 0, y: 0, section: 'D' },
  { id: 26, name: 'KESEM',                    description: 'Energy drinks',                                                 x: 0, y: 0, section: 'D' },
  { id: 27, name: 'AKPSI',                    description: 'Milkshakes',                                                    x: 0, y: 0, section: 'D' },
  { id: 28, name: 'CHABAD',                   description: 'Kosher deli food',                                              x: 0, y: 0, section: 'D' },
  { id: 29, name: 'SAAC',                     description: 'Long drive competition',                                        x: 0, y: 0, section: 'D' },

  // Section E
  { id: 30, name: 'AEPI, & AEPHI',            description: 'Dunk tank',                                                     x: 0, y: 0, section: 'E' },
  { id: 31, name: 'SIGEP',                    description: 'Pancakes',                                                      x: 0, y: 0, section: 'E' },
  { id: 32, name: 'PHIDE',                    description: 'Donuts and mini basketball',                                    x: 0, y: 0, section: 'E' },
  { id: 33, name: 'HABITAT FOR HUMANITY',     description: 'Tanghulu, fruit cups',                                          x: 0, y: 0, section: 'E' },
  { id: 34, name: 'AIR',                      description: 'Frozen lemonade',                                                x: 0, y: 0, section: 'E' },
  { id: 35, name: 'KAPI',                     description: 'Chocolate covered strawberries',                                x: 0, y: 0, section: 'E' },
  { id: 36, name: 'IOTA KAPPA, PHI BETA SIGMA', description: 'Smoothies',                                                   x: 0, y: 0, section: 'E' },
  { id: 37, name: 'HEART FOR THE UNHOUSED',   description: 'Crepes',                                                        x: 0, y: 0, section: 'E' },
  { id: 38, name: 'GLOBEMED',                 description: 'Esquites',                                                      x: 0, y: 0, section: 'E' },
];

const sectionColors: Record<string, string> = {
  A: '#fbee08',
  B: '#e6d906',
  C: '#d1c405',
  D: '#bcaf04',
  E: '#a79a03',
};

/** Day theme sets `--map-booth-fill` / `--map-booth-on-fill` for a single hue + black text. */
function boothMarkerStyle(section: string): CSSProperties {
  const fallbackBg = sectionColors[section] ?? '#fbee08';
  return {
    backgroundColor: `var(--map-booth-fill, ${fallbackBg})`,
    color: `var(--map-booth-on-fill, #0f100d)`,
  };
}

type MapHotspotId = 'A' | 'B' | 'C' | 'D' | 'E';

type MapHotspot = {
  id: MapHotspotId;
  /** Top position as percentage of map height (0–100). */
  top: number;
  /** Left position as percentage of map width (0–100). */
  left: number;
  /** Width as percentage of map width (0–100). */
  width: number;
  /** Height as percentage of map height (0–100). */
  height: number;
};

const HOTSPOT_STORAGE_KEY = 'thurtene-map-hotspots-v1';

function defaultHotspots(): Record<MapHotspotId, MapHotspot> {
  return {
    A: {
      id: 'A',
      top: 53.79194555124246,
      left: 84.34172690702636,
      width: 12.316250770571173,
      height: 2.181378262728664,
    },
    B: {
      id: 'B',
      top: 53.802901936058774,
      left: 64.36638239093438,
      width: 10.317335963447462,
      height: 2.192527005290799,
    },
    C: {
      id: 'C',
      top: 65.53694976986354,
      left: 57.033606885223364,
      width: 1.7572826832124875,
      height: 8.17081072623759,
    },
    D: {
      id: 'D',
      top: 36.762734434077984,
      left: 47.05523186537909,
      width: 1.7148062832498425,
      height: 18.635976345127858,
    },
    E: {
      id: 'E',
      top: 39.01805107378236,
      left: 53.54808215165399,
      width: 1.7306519926564903,
      height: 14.200263227770254,
    },
  };
}

function loadSavedHotspots(): Record<MapHotspotId, MapHotspot> {
  try {
    const raw = localStorage.getItem(HOTSPOT_STORAGE_KEY);
    if (!raw) return defaultHotspots();
    const parsed = JSON.parse(raw) as Partial<Record<MapHotspotId, Partial<MapHotspot>>>;
    const base = defaultHotspots();
    (['A', 'B', 'C', 'D', 'E'] as MapHotspotId[]).forEach((id) => {
      const stored = parsed?.[id];
      if (!stored) return;
      const clamp = (v: unknown, min: number, max: number, fallback: number) => {
        if (typeof v !== 'number' || Number.isNaN(v)) return fallback;
        return Math.min(max, Math.max(min, v));
      };
      base[id] = {
        id,
        top: clamp(stored.top, 0, 100, base[id].top),
        left: clamp(stored.left, 0, 100, base[id].left),
        width: clamp(stored.width, 1, 100, base[id].width),
        height: clamp(stored.height, 1, 100, base[id].height),
      };
    });
    return base;
  } catch {
    return defaultHotspots();
  }
}

function saveHotspots(next: Record<MapHotspotId, MapHotspot>): void {
  try {
    localStorage.setItem(HOTSPOT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore – hotspots are a UX nicety, not critical state
  }
}

type ViewMode = 'list' | 'map';

export function InteractiveMapScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [hotspots, setHotspots] = useState<Record<MapHotspotId, MapHotspot>>(() =>
    loadSavedHotspots()
  );
  // Editing mode is now internal-only; end users always see the locked button view.
  const [editingHotspots] = useState<boolean>(false);
  const [activeSectionPopup, setActiveSectionPopup] = useState<MapHotspotId | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openSections, setOpenSections] = useState<Record<MapHotspotId, boolean>>({
    A: true,
    B: true,
    C: true,
    D: true,
    E: true,
  });
  const mapRef = useRef<HTMLDivElement | null>(null);

  type ActiveHotspotDrag = {
    id: MapHotspotId;
    mode: 'move' | 'resize';
    /** For resize, which handle is being dragged. */
    handle: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
    startX: number;
    startY: number;
    start: MapHotspot;
  };

  const [activeDrag, setActiveDrag] = useState<ActiveHotspotDrag | null>(null);

  const beginDrag = (
    id: MapHotspotId,
    mode: 'move' | 'resize',
    handle: ActiveHotspotDrag['handle'],
    clientX: number,
    clientY: number
  ) => {
    const current = hotspots[id];
    setActiveDrag({
      id,
      mode,
      handle,
      startX: clientX,
      startY: clientY,
      start: { ...current },
    });
  };

  const updateDrag = (clientX: number, clientY: number) => {
    if (!activeDrag || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dx = clientX - activeDrag.startX;
    const dy = clientY - activeDrag.startY;
    const dxPct = (dx / rect.width) * 100;
    const dyPct = (dy / rect.height) * 100;

    setHotspots((prev) => {
      const current = prev[activeDrag.id] ?? activeDrag.start;
      let next: MapHotspot = { ...current };

      if (activeDrag.mode === 'move' || activeDrag.handle === 'move') {
        next.top = Math.min(100, Math.max(0, activeDrag.start.top + dyPct));
        next.left = Math.min(100, Math.max(0, activeDrag.start.left + dxPct));
      } else {
        const minSize = 1;

        // Work with edges so the opposite corner stays fixed.
        const start = activeDrag.start;
        const halfW = start.width / 2;
        const halfH = start.height / 2;
        const startLeftEdge = start.left - halfW;
        const startRightEdge = start.left + halfW;
        const startTopEdge = start.top - halfH;
        const startBottomEdge = start.top + halfH;

        let leftEdge = startLeftEdge;
        let rightEdge = startRightEdge;
        let topEdge = startTopEdge;
        let bottomEdge = startBottomEdge;

        switch (activeDrag.handle) {
          case 'se':
            rightEdge = startRightEdge + dxPct;
            bottomEdge = startBottomEdge + dyPct;
            break;
          case 'sw':
            leftEdge = startLeftEdge + dxPct;
            bottomEdge = startBottomEdge + dyPct;
            break;
          case 'ne':
            rightEdge = startRightEdge + dxPct;
            topEdge = startTopEdge + dyPct;
            break;
          case 'nw':
            leftEdge = startLeftEdge + dxPct;
            topEdge = startTopEdge + dyPct;
            break;
          case 'n':
            topEdge = startTopEdge + dyPct;
            break;
          case 's':
            bottomEdge = startBottomEdge + dyPct;
            break;
          case 'e':
            rightEdge = startRightEdge + dxPct;
            break;
          case 'w':
            leftEdge = startLeftEdge + dxPct;
            break;
          default:
            break;
        }

        // Clamp edges within [0,100]
        leftEdge = Math.max(0, Math.min(100, leftEdge));
        rightEdge = Math.max(0, Math.min(100, rightEdge));
        topEdge = Math.max(0, Math.min(100, topEdge));
        bottomEdge = Math.max(0, Math.min(100, bottomEdge));

        let newWidth = rightEdge - leftEdge;
        let newHeight = bottomEdge - topEdge;

        if (newWidth < minSize) {
          // Expand back out keeping opposite edge fixed.
          if (activeDrag.handle === 'se' || activeDrag.handle === 'ne') {
            rightEdge = leftEdge + minSize;
          } else {
            leftEdge = rightEdge - minSize;
          }
          newWidth = minSize;
        }
        if (newHeight < minSize) {
          if (activeDrag.handle === 'se' || activeDrag.handle === 'sw') {
            bottomEdge = topEdge + minSize;
          } else {
            topEdge = bottomEdge - minSize;
          }
          newHeight = minSize;
        }

        next.width = Math.min(100, Math.max(minSize, newWidth));
        next.height = Math.min(100, Math.max(minSize, newHeight));
        next.left = leftEdge + next.width / 2;
        next.top = topEdge + next.height / 2;
      }

      return { ...prev, [activeDrag.id]: next };
    });
  };

  const endDrag = () => {
    setActiveDrag(null);
  };

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
      <div className="px-4 pt-3 pb-2 w-full">
        <div className="flex w-full min-w-0 rounded-xl overflow-hidden border-2 border-border shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-base font-bold transition-colors ${
              viewMode === 'list'
                ? 'bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d]'
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
                ? 'bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d]'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <MapPin className="w-5 h-5 shrink-0" />
            Map
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List view: all booths by section, no map — styled like Kimi's list but keep background + yellow circles */
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          {/* Search bar */}
          <div className="pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, activity, or food"
                className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>

          {(['A', 'B', 'C', 'D', 'E'] as const).map((section) => {
            const sectionBooths = booths.filter((b) => b.section === section);
            if (sectionBooths.length === 0) return null;

            const normalizedQuery = searchQuery.trim().toLowerCase();
            const filteredBooths =
              normalizedQuery.length === 0
                ? sectionBooths
                : sectionBooths.filter((b) => {
                    const haystack = `${b.name} ${b.description}`.toLowerCase();
                    return haystack.includes(normalizedQuery);
                  });

            if (filteredBooths.length === 0) {
              return null;
            }

            const open = openSections[section];

            return (
              <div key={section} id={`map-section-${section}`} className="mb-4">
                {/* Section header with arrow collapse */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
                  }
                  className="w-full flex items-center justify-between py-2"
                >
                  <span
                    className="text-base font-bold text-accent uppercase tracking-[0.18em]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Section {section}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      open ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {open && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {filteredBooths.map((booth, index) => (
                      <div
                        key={booth.id}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 border-border ${
                          index > 0 ? 'border-t' : ''
                        }`}
                      >
                        {/* Keep existing yellow circled numbers */}
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={boothMarkerStyle(booth.section)}
                        >
                          {booth.id}
                        </span>
                        {/* Text block styled like Kimi's row, but not clickable */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {booth.name}
                            </p>
                            <div className="flex items-center gap-1 shrink-0 text-[11px] text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>Sec {booth.section}</span>
                            </div>
                          </div>
                          <div className="mt-0.5 flex items-start gap-1.5">
                            {/* Tiny bullet icon for description – match Kimi's small storefront icon */}
                            <Store className="mt-[1px] w-3.5 h-3.5 shrink-0 text-[#b49a75]" strokeWidth={2} />
                            <p className="text-xs text-muted-foreground leading-snug break-words">
                              {booth.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 pb-24">
          {/* Map key – matches visual legend on the printed map */}
          <div className="mb-3 bg-card border-2 border-[#fb923c] rounded-xl p-3 w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star
                  className="w-4 h-4 shrink-0"
                  style={{ fill: '#16a34a', color: '#16a34a' }}
                />
                <span className="text-xs font-semibold text-foreground">Entrance</span>
              </div>
              <div className="flex items-center gap-2">
                <Star
                  className="w-4 h-4 shrink-0"
                  style={{ fill: '#d4183d', color: '#d4183d' }}
                />
                <span className="text-xs font-semibold text-foreground">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-none shrink-0"
                  style={{ backgroundColor: '#ed70b0' }}
                />
                <span className="text-xs font-semibold text-foreground">
                  DR. G&apos;s Fun House Stage
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-none shrink-0"
                  style={{ backgroundColor: '#4f975c' }}
                />
                <span className="text-xs font-semibold text-foreground">ATM</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-none shrink-0"
                  style={{ backgroundColor: '#374c78' }}
                />
                <span className="text-xs font-semibold text-foreground">Water Station</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-none shrink-0"
                  style={{ backgroundColor: '#684b29' }}
                />
                <span className="text-xs font-semibold text-foreground">Waste Station</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-none shrink-0"
                  style={{ backgroundColor: '#864286' }}
                />
                <span className="text-xs font-semibold text-foreground">Porta-Potties</span>
              </div>
            </div>
          </div>

          {/* Map – static image with optional editable hotspot overlays */}
          <div
            ref={mapRef}
            className="relative mb-6 w-full rounded-xl border-2 border-[#fb923c] shadow-xl"
            onPointerMove={(e) => {
              if (activeDrag) {
                updateDrag(e.clientX, e.clientY);
              }
            }}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <div className="relative rounded-xl overflow-hidden">
            <img
              src={MAP_IMAGE}
              alt="ThurtenE Carnival Map"
              className="w-full block"
            />
            {/* Hotspot overlays (editable / invisible modes) */}
            {editingHotspots
              ? (['A', 'B', 'C', 'D', 'E'] as MapHotspotId[]).map((id) => {
                  const hs = hotspots[id];
                  return (
                    <div
                      key={id}
                      className="absolute cursor-move border-2 border-[#f97316] bg-transparent"
                      style={{
                        top: `${hs.top}%`,
                        left: `${hs.left}%`,
                        width: `${hs.width}%`,
                        height: `${hs.height}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                        beginDrag(id, 'move', 'move', e.clientX, e.clientY);
                      }}
                    >
                      {/* Resize handles on all sides/corners – visually invisible but still draggable */}
                      <div
                        className="absolute -top-1 -left-1 w-3 h-3 bg-transparent cursor-nwse-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'nw', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-transparent cursor-n-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'n', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-transparent cursor-nesw-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'ne', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute -bottom-1 -left-1 w-3 h-3 bg-transparent cursor-nesw-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'sw', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-transparent cursor-s-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 's', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-transparent cursor-w-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'w', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-transparent cursor-e-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'e', e.clientX, e.clientY);
                        }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-transparent cursor-nwse-resize"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          beginDrag(id, 'resize', 'se', e.clientX, e.clientY);
                        }}
                      />
                    </div>
                  );
                })
              : (['A', 'B', 'C', 'D', 'E'] as MapHotspotId[]).map((id) => {
                  const hs = hotspots[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={`Go to Section ${id}`}
                      className="absolute flex items-center justify-center transition-transform transition-colors"
                      style={{
                        top: `${hs.top}%`,
                        left: `${hs.left}%`,
                        width: `${hs.width}%`,
                        height: `${hs.height}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => {
                        setActiveSectionPopup((current) => (current === id ? null : id));
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316]">
                        <span
                          className="font-bold tracking-[0.05em] text-black"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: '2vw' }}
                        >
                          {id}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
            {/* Section popup anchored near the hotspot button */}
            {!editingHotspots &&
              activeSectionPopup &&
              (() => {
                const hs = hotspots[activeSectionPopup];
                if (!hs) return null;

                const pad = 2; // % padding from map edges

                let style: CSSProperties;

                if (activeSectionPopup === 'A' || activeSectionPopup === 'B') {
                  // Above the button, horizontally centered on it
                  const availableHeight = hs.top - hs.height / 2 - pad * 2;
                  style = {
                    maxHeight: `${availableHeight}%`,
                    bottom: `${100 - hs.top + hs.height / 2 + 1}%`,
                    left: `${Math.max(pad, Math.min(100 - pad, hs.left))}%`,
                    transform: 'translateX(-50%)',
                  };
                } else if (activeSectionPopup === 'C' || activeSectionPopup === 'D') {
                  // To the left of the button, vertically centered
                  const clampedTop = Math.max(pad, Math.min(100 - pad, hs.top));
                  style = {
                    maxHeight: `${100 - pad * 2}%`,
                    right: `${100 - hs.left + hs.width / 2 + 1}%`,
                    top: `${clampedTop}%`,
                    transform: 'translateY(-50%)',
                  };
                } else {
                  // E: to the right of the button, vertically centered
                  const clampedTop = Math.max(pad, Math.min(100 - pad, hs.top));
                  style = {
                    maxHeight: `${100 - pad * 2}%`,
                    left: `${hs.left + hs.width / 2 + 1}%`,
                    top: `${clampedTop}%`,
                    transform: 'translateY(-50%)',
                  };
                }

                return (
                  <div className="absolute z-20" style={style}>
                    <div className="relative border-2 border-[#f97316] rounded-none shadow-lg">
                      <button
                        type="button"
                        onClick={() => setActiveSectionPopup(null)}
                        className="absolute top-1 right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-black/80 text-white hover:bg-black/90 shadow-md border border-white/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <img
                        src={`/${activeSectionPopup}.png`}
                        alt={`Section ${activeSectionPopup}`}
                        className="block h-auto"
                        style={{ maxHeight: 'inherit', width: 'auto' }}
                      />
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Hotspot editing controls previously rendered here – intentionally hidden now to keep map UI clean. */}
        </div>
      )}

      {/* Bottom Sheet Modal */}
      {selectedBooth && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSelectedBooth(null)}
          />
          {/* Bottom sheet sits just above the fixed nav bar so it isn't hidden behind it. */}
          <div className="fixed bottom-16 left-0 right-0 bg-card border-t-2 z-50 rounded-t-2xl shadow-2xl"
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
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                    style={boothMarkerStyle(selectedBooth.section)}
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
