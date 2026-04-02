import { ChevronLeft } from 'lucide-react';

type StageSlot = {
  time: string;
  act: string;
  note?: string;
};

type DaySchedule = {
  id: string;
  label: string;
  slots: StageSlot[];
};

// Stage schedule based on provided sheet (by day).
const DAY_SCHEDULES: DaySchedule[] = [
  {
    id: 'friday',
    label: 'Friday, April 17',
    slots: [
      { time: '4:15 – 4:30 PM', act: 'THE MIC' },
    ],
  },
  {
    id: 'saturday',
    label: 'Saturday, April 18',
    slots: [
      { time: '11:15 – 11:30 AM', act: 'Ghost Lights' },
      { time: '12:15 – 1:00 PM', act: 'TKE + Chio' },
      { time: '2:00 – 2:15 PM', act: 'Bear Nation Varsity Band' },
      { time: '3:00 – 3:45 PM', act: 'Poetic Sounds' },
    ],
  },
  {
    id: 'sunday',
    label: 'Sunday, April 19',
    slots: [
      { time: '11:15 AM', act: 'Amateurs' },
      { time: '11:45 AM', act: 'After Dark' },
      { time: '1:00 – 1:30 PM', act: 'Jeff Lefton' },
      { time: '2:00 – 2:15 PM', act: 'Alex + Dahlia' },
      { time: '3:00 PM', act: 'WUSUCC' },
      { time: '4:00 PM', act: "Rafe's Standup" },
    ],
  },
];

/** Event schedule — header matches Map / Info / Scavenger; DM Sans only on list rows. */
export function EventScheduleScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — same structure as InteractiveMapScreen / InfoFaqScreen / ScavengerHuntScreen */}
      <div className="bg-card border-b-2 border-primary p-4 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-foreground p-1 flex items-center gap-1 hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <h1
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Event Schedule
        </h1>
        <div className="w-16" />
      </div>

      <div
        className="flex-1 px-4 py-4 pb-28 w-full text-[#1A0E04] antialiased space-y-4"
        style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        {DAY_SCHEDULES.map((day) => (
          <section
            key={day.id}
            className="rounded-[24px] border border-border bg-card overflow-hidden shadow border-l-4 border-l-[#ea580c]"
          >
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-black bg-[#f7f2e8]">
              <h2
                className="text-sm sm:text-base font-bold text-[#E85B1A]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontVariantNumeric: 'lining-nums tabular-nums',
                }}
              >
                {day.label}
              </h2>
            </header>
            {day.slots.map((slot, index) => (
              <div
                key={`${day.id}-${slot.time}-${slot.act}-${index}`}
                className={`grid grid-cols-[minmax(6.5rem,7rem)_1fr] sm:grid-cols-[100px_1fr] gap-x-4 sm:gap-x-6 items-center px-4 py-3.5 sm:px-6 sm:py-4 ${
                  index > 0 ? 'border-t border-border' : ''
                }`}
              >
                <div
                  className="text-[1.05rem] sm:text-[1.1rem] text-[#E85B1A] leading-[1.15] tracking-[0.05em] whitespace-nowrap"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {slot.time.toUpperCase()}
                </div>
                <div className="min-w-0 pr-1">
                  <p
                    className="font-semibold text-[0.98rem] text-[#1A0E04] leading-snug tracking-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontVariantNumeric: 'lining-nums tabular-nums',
                    }}
                  >
                    {slot.act}
                  </p>
                  {slot.note ? (
                    <p className="text-[0.82rem] font-normal text-[#7A5C3A] mt-0.5 leading-relaxed">
                      {slot.note}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
