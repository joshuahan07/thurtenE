import { ChevronLeft } from 'lucide-react';

type ScheduleRow = {
  time: string;
  title: string;
  subtitle: string;
  /** Optional second line (muted), e.g. wrap-up note under location */
  subtitle2?: string;
  badge: string;
};

const SCHEDULE_ROWS: ScheduleRow[] = [
  {
    time: '10:00 AM',
    title: 'Gates Open',
    subtitle: 'Main Entrance, Brookings Quad',
    badge: 'All Day',
  },
  {
    time: '11:30 AM',
    title: 'Opening Ceremony',
    subtitle: 'Live Stage, Section D',
    badge: 'Live',
  },
  {
    time: '1:00 PM',
    title: 'Scavenger Hunt Kickoff',
    subtitle: 'All Sections — app required',
    badge: 'Hunt',
  },
  {
    time: '3:30 PM',
    title: 'Student Band Showcase',
    subtitle: 'Live Stage, Section D',
    badge: 'Live',
  },
  {
    time: '6:00 PM',
    title: 'Prize Ceremony',
    subtitle: 'Scavenger Hunt winners announced',
    badge: 'Hunt',
  },
  {
    time: '9:00 PM',
    title: 'Wrap up',
    subtitle: 'Clean up begins',
    badge: 'End',
  },
];

const pillClass =
  'inline-flex items-center justify-center rounded-full bg-[rgba(232,91,26,0.12)] px-2.5 py-1 min-h-[1.75rem] text-[#E85B1A]';

/** Event schedule — white column; times = Bebas Neue, body = DM Sans (matches reference). */
export function EventScheduleScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div
      className="min-h-screen bg-white text-[#1A0E04] antialiased"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Same width as card below so title lines up with the schedule */}
      <div className="max-w-lg mx-auto w-full min-h-screen flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b-2 border-primary p-4 flex items-center justify-between shadow-lg">
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
          <div className="w-16" aria-hidden />
        </div>

        <div className="flex-1 px-4 pt-4 pb-28 w-full">
          <div className="rounded-[24px] border border-[#D4C4A8] bg-white overflow-hidden shadow-[0_2px_24px_rgba(26,14,4,0.07)]">
          {SCHEDULE_ROWS.map((row, i) => (
            <div
              key={`${row.time}-${row.title}`}
              className={`grid grid-cols-[minmax(5rem,5.25rem)_1fr_auto] sm:grid-cols-[90px_1fr_auto] gap-x-4 sm:gap-x-6 items-center px-4 py-5 sm:px-6 sm:py-6 ${
                i > 0 ? 'border-t border-[#D4C4A8]' : ''
              }`}
            >
              <div
                className="text-[1.05rem] sm:text-[1.1rem] text-[#E85B1A] leading-[1.15] tracking-[0.05em]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {row.time.toUpperCase()}
              </div>
              <div className="min-w-0 pr-1 py-0.5">
                <p className="font-semibold text-[0.95rem] text-[#1A0E04] leading-snug tracking-tight">
                  {row.title}
                </p>
                <p className="text-[0.82rem] font-normal text-[#7A5C3A] mt-1 leading-relaxed">
                  {row.subtitle}
                </p>
                {row.subtitle2 ? (
                  <p className="text-[0.82rem] font-normal text-[#7A5C3A] mt-1 leading-relaxed">
                    {row.subtitle2}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 flex justify-end self-center">
                <span
                  className={`${pillClass} text-[0.72rem] font-bold tracking-[0.06em] uppercase whitespace-nowrap`}
                >
                  {row.badge}
                </span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
