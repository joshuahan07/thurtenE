import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import carnivalMap from '../../assets/thurtene-site-map.jpeg';

interface Booth {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  section: string;
}

const booths: Booth[] = [
  // Section A – right edge
  { id: 1,  name: 'Little Bit Foundation',           description: 'Community Partner',                                   x: 91.5, y: 37,   section: 'A' },
  { id: 2,  name: 'Thurtene Alumni Tent',            description: 'Carnival Information & T-shirts',                    x: 91.5, y: 41,   section: 'A' },
  { id: 3,  name: 'Partner in East St. Louis',       description: 'Informational',                                      x: 91.5, y: 45,   section: 'A' },
  { id: 4,  name: 'Delta Sigma Pi',                  description: 'Funnel Cakes',                                       x: 91.5, y: 49,   section: 'A' },
  { id: 5,  name: 'Swim & Dive',                     description: 'Cotton candy, Hot dogs',                             x: 91.5, y: 53,   section: 'A' },
  { id: 6,  name: 'Tau Kappa Epsilon & Chi Omega',   description: 'Turkey legs',                                        x: 91.5, y: 57,   section: 'A' },
  { id: 7,  name: 'Zeta Phi Beta & Phi Beta Sigma',  description: 'Smoothies',                                          x: 91.5, y: 61,   section: 'A' },
  // Section B – horizontal middle row
  { id: 8,  name: 'TSO/HKSA/JSO/AMPAMSA',           description: 'Taiyaki, shuttlecock, drawing',                      x: 27,   y: 42,   section: 'B' },
  { id: 9,  name: 'TSO/HKSA/JSO/AMPAMSA',           description: 'Taiyaki, shuttlecock, drawing',                      x: 31,   y: 42,   section: 'B' },
  { id: 10, name: 'Alpha Iota Gamma',                description: 'Lemonade',                                           x: 35,   y: 42,   section: 'B' },
  { id: 11, name: 'Alpha Kappa Psi',                 description: 'Mini Donuts',                                        x: 39.5, y: 42,   section: 'B' },
  { id: 12, name: 'Relay for Life & Camp Kesem',     description: 'Tropical drinks, Popcorn, and Coffee',               x: 44,   y: 42,   section: 'B' },
  { id: 13, name: 'Phi Gamma Nu',                    description: 'Snow cones',                                         x: 48,   y: 42,   section: 'B' },
  { id: 14, name: 'Heart for the Unhoused',          description: 'Crepes',                                             x: 52,   y: 42,   section: 'B' },
  { id: 15, name: 'Campus Y',                        description: 'Pretzels',                                           x: 56,   y: 42,   section: 'B' },
  { id: 16, name: 'WUPD',                            description: 'WUPD Puppies',                                       x: 60,   y: 42,   section: 'B' },
  // Section C – bottom row (below Forsyth Blvd)
  { id: 17, name: 'Sigma Nu & Kappa Kappa Gamma',    description: 'Fried Oreos',                                        x: 39,   y: 82,   section: 'C' },
  { id: 18, name: 'Alpha Delta Phi & Gamma Phi Beta',description: 'Burgers, Grilled cheese',                            x: 43,   y: 82,   section: 'C' },
  { id: 19, name: 'Sigma Phi Epsilon & Kappa Delta', description: 'Waffles',                                            x: 47,   y: 82,   section: 'C' },
  { id: 20, name: 'Sigma Alpha Epsilon & Alpha Phi', description: 'Beignets',                                           x: 51,   y: 82,   section: 'C' },
  { id: 21, name: 'Zeta Beta Tau',                   description: 'Street tacos, Churros, and Quesadillas',             x: 55,   y: 82,   section: 'C' },
  { id: 22, name: 'Alpha Epsilon Pi & Alpha Epsilon Phi', description: 'Italian ice',                                   x: 59,   y: 82,   section: 'C' },
  // Section D – left side
  { id: 23, name: 'Chabad',                          description: 'Deli sandwiches and pickles',                        x: 14,   y: 25,   section: 'D' },
  { id: 24, name: 'China Care Club and BoCo',        description: 'Boba, Egg tarts, Dumplings',                         x: 18,   y: 30,   section: 'D' },
  { id: 25, name: 'Bear-Y-Sweete',                   description: 'Gummy candy with Topping',                           x: 18,   y: 34.5, section: 'D' },
  { id: 26, name: 'Belegarth',                       description: 'Sparring pit',                                       x: 18,   y: 39,   section: 'D' },
  { id: 27, name: 'Belegarth',                       description: 'Sparring pit',                                       x: 18,   y: 43.5, section: 'D' },
  { id: 28, name: "Black Men's Coalition",           description: 'Football throw',                                     x: 18,   y: 48,   section: 'D' },
  { id: 29, name: 'Strike Magazine',                 description: 'Thrift shop',                                        x: 18,   y: 52,   section: 'D' },
  // Section E – upper center
  { id: 30, name: 'Globe Med',                       description: 'Face painting, Temporary tattoos and Henna',         x: 42,   y: 14,   section: 'E' },
  { id: 31, name: 'Theta Xi',                        description: 'Pie a Xi',                                           x: 38,   y: 19,   section: 'E' },
  { id: 32, name: 'Olin Business Council',           description: 'Cup pong game',                                      x: 34,   y: 27,   section: 'E' },
  { id: 33, name: 'Phi Delta Epsilon',               description: 'Basketball game',                                    x: 55,   y: 17,   section: 'E' },
  { id: 34, name: 'Congress of the South 40',        description: 'Ring toss & Dunk tank',                              x: 50,   y: 22,   section: 'E' },
];

const sectionColors: Record<string, string> = {
  A: '#E85B1A',
  B: '#F5A921',
  C: '#1D8A6E',
  D: '#C45EC4',
  E: '#3B82F6',
};

export function InteractiveMapScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  return (
    <div className="min-h-screen bg-[#180C04] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C0E06] border-b-2 border-[#E85B1A] p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          className="text-[#F5E8D8] p-1 rounded-lg flex items-center gap-1 hover:text-[#F5A921] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <h1
          className="text-lg font-bold text-[#F5E8D8]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Carnival Map
        </h1>
        <div className="w-16" />
      </div>

      <p className="text-xs text-center text-[#C8A884] py-2 px-4">
        Tap a numbered badge to see booth details
      </p>

      {/* Map Container */}
      <div className="relative mx-3 rounded-xl overflow-hidden border border-[#4A2010] shadow-xl">
        <img
          src={carnivalMap}
          alt="ThurtenE Carnival Map"
          className="w-full"
        />
        {/* Booth tap zones */}
        {booths.map((booth) => (
          <button
            key={booth.id}
            onClick={() => setSelectedBooth(booth)}
            className="absolute flex items-center justify-center rounded-full text-white text-[9px] font-bold shadow-lg hover:scale-110 active:scale-95 transition-transform"
            style={{
              top: `${booth.y}%`,
              left: `${booth.x}%`,
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              backgroundColor: sectionColors[booth.section] ?? '#E85B1A',
              border: '1.5px solid rgba(255,255,255,0.6)',
            }}
          >
            {booth.id}
          </button>
        ))}
      </div>

      {/* Section Legend */}
      <div className="mx-3 mt-3 mb-4 bg-[#231208] border border-[#4A2010] rounded-xl p-3">
        <p className="text-[10px] text-[#C8A884] uppercase tracking-wider mb-2">Sections</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(sectionColors).map(([section, color]) => (
            <div key={section} className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                style={{ backgroundColor: color }}
              >
                {section}
              </span>
              <span className="text-xs text-[#C8A884]">Section {section}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      {selectedBooth && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSelectedBooth(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-[#231208] border-t-2 z-50 rounded-t-2xl shadow-2xl"
            style={{ borderColor: sectionColors[selectedBooth.section] ?? '#E85B1A' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#4A2010] rounded-full" />
            </div>
            <div className="p-6 pb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: sectionColors[selectedBooth.section] ?? '#E85B1A' }}
                  >
                    {selectedBooth.id}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#C8A884] mb-0.5">
                      Section {selectedBooth.section}
                    </p>
                    <h2
                      className="text-xl font-bold text-[#F5E8D8] leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedBooth.name}
                    </h2>
                    <p className="text-sm text-[#C8A884] mt-1 leading-relaxed">
                      {selectedBooth.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooth(null)}
                  className="ml-3 p-2 rounded-full bg-[#321508] text-[#C8A884] hover:text-[#F5E8D8] transition-colors"
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
