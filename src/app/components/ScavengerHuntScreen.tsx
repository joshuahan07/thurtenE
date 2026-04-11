import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Check, MapPin, X, Camera, ScanLine } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { upsertScavengerCompletion } from '../../services/keepinContactService';
import { AnalyticsEventType, recordAnalyticsEvent } from '../../services/analyticsEvents';

const SCAVENGER_STORAGE_KEY = 'thurtene-scavenger-tasks';
const RAFFLE_ENTRY_KEY = 'thurtene-scavenger-raffle-entry';
const SCANNER_ELEMENT_ID = 'thurtene-qr-scanner';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  code: string;
  section: string;
}

const initialTasks: Task[] = [
  { id: 1, name: 'Visit a booth in Section A', completed: false, code: 'SECTION-A', section: 'A' },
  { id: 2, name: 'Visit a booth in Section B', completed: false, code: 'SECTION-B', section: 'B' },
  { id: 3, name: 'Visit a booth in Section C', completed: false, code: 'SECTION-C', section: 'C' },
  { id: 4, name: 'Visit a booth in Section D', completed: false, code: 'SECTION-D', section: 'D' },
  { id: 5, name: 'Visit a booth in Section E', completed: false, code: 'SECTION-E', section: 'E' },
];

function loadSavedTasks(): Task[] {
  try {
    const raw = localStorage.getItem(SCAVENGER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed) && parsed.length === 5) {
        return initialTasks.map((def, i) => ({
          ...def,
          completed: parsed[i]?.completed ?? def.completed,
        }));
      }
    }
  } catch {
    // ignore
  }
  return initialTasks;
}

/** Check if raffle was already submitted (no PII stored locally). */
function hasSubmittedRaffle(): boolean {
  try {
    return localStorage.getItem(RAFFLE_ENTRY_KEY) === 'submitted';
  } catch {
    return false;
  }
}

/** Parse section letter from scanned QR (URL/hash) or raw code like SECTION-A. */
function parseSectionFromScannedText(text: string): string | null {
  const hashMatch = text.match(/scavenger-section-([A-E])/i);
  if (hashMatch) return hashMatch[1].toUpperCase();
  const codeMatch = text.match(/section[-_]?([A-E])/i);
  if (codeMatch) return codeMatch[1].toUpperCase();
  return null;
}

export function ScavengerHuntScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>(loadSavedTasks);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryName, setEntryName] = useState('');
  const [entryPhone, setEntryPhone] = useState('');
  const [raffleSubmitting, setRaffleSubmitting] = useState(false);
  const [raffleSubmitError, setRaffleSubmitError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    localStorage.setItem(SCAVENGER_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#scavenger-section-([A-E])$/i);
    if (!match) return;
    const section = match[1].toUpperCase();
    void recordAnalyticsEvent(AnalyticsEventType.QR_SECTION_COMPLETE, {
      section,
      source: 'hash_link',
    });
    setTasks((prev) =>
      prev.map((t) => (t.section === section ? { ...t, completed: true } : t))
    );
    window.location.hash = '#scavenger';
  }, []);

  useEffect(() => {
    const allDone = tasks.every((t) => t.completed);
    if (allDone && !hasSubmittedRaffle()) setShowEntryModal(true);
  }, [tasks]);

  useEffect(() => {
    if (!showScanner) return;
    setScannerError(null);
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        qrScannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 8, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            const section = parseSectionFromScannedText(decodedText);
            if (!section) return;
            scanner
              .stop()
              .then(() => {
                qrScannerRef.current = null;
                void recordAnalyticsEvent(AnalyticsEventType.QR_SECTION_COMPLETE, {
                  section,
                  source: 'camera',
                });
                setTasks((prev) =>
                  prev.map((t) => (t.section === section ? { ...t, completed: true } : t))
                );
                setShowScanner(false);
              })
              .catch(() => {
                qrScannerRef.current = null;
                setShowScanner(false);
              });
          },
          () => {}
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not start camera';
        setScannerError(msg);
        qrScannerRef.current = null;
      }
    };
    startScanner();
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(() => {});
        qrScannerRef.current.clear();
        qrScannerRef.current = null;
      }
    };
  }, [showScanner]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPct = (completedCount / totalTasks) * 100;
  const allDone = completedCount === totalTasks;
  const isZeroComplete = completedCount === 0;

  const handleRaffleEntrySubmit = async () => {
    const name = entryName.trim();
    const phone = entryPhone.trim();
    if (!name || !phone) return;

    // Validate name length
    if (name.length > 100) {
      setRaffleSubmitError('Name is too long.');
      return;
    }

    // Validate phone format (digits, spaces, dashes, parens, plus — 7-15 digits)
    const phoneDigits = phone.replace(/[\s\-().+]/g, '');
    if (!/^\d{7,15}$/.test(phoneDigits)) {
      setRaffleSubmitError('Please enter a valid phone number.');
      return;
    }

    setRaffleSubmitting(true);
    setRaffleSubmitError(null);
    try {
      await upsertScavengerCompletion({ name, phone });
      // Only store a flag — no PII in localStorage
      localStorage.setItem(RAFFLE_ENTRY_KEY, 'submitted');
      setShowEntryModal(false);
    } catch {
      setRaffleSubmitError('Could not submit your raffle info. Please try again.');
    }
    setRaffleSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b-2 border-primary p-4 flex items-center justify-between shadow-lg">
        <button
          type="button"
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
          Scavenger Hunt
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 px-4 py-4 pb-28 space-y-4 overflow-y-auto">
        <p className="text-sm text-muted-foreground mt-1 text-center font-bold">
          Complete the hunt to enter the raffle!
        </p>
        {/* Progress — card like reference */}
        <div
          className={`rounded-xl border-2 bg-card p-4 shadow-sm ${
            isZeroComplete ? 'border-[#d4183d]' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-foreground">
              {completedCount} of {totalTasks} completed
            </span>
            <span className="font-semibold text-foreground tabular-nums">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Single scan CTA — simple */}
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#ea580c]/40 bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d] font-semibold text-sm shadow-sm active:scale-[0.99] transition-transform"
        >
          <Camera className="w-5 h-5 text-[#0f100d]" />
          Scan QR code at booth
        </button>

        {/* Task list */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border-2 border-[#fb923c] p-4 transition-colors ${
                task.completed ? 'bg-primary/25' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-snug ${
                      task.completed ? 'text-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('map')}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:text-foreground underline-offset-2 hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    View on map
                  </button>
                </div>
                <div className="shrink-0 pt-0.5">
                  {task.completed ? (
                    <div
                      className="flex size-9 items-center justify-center rounded-full bg-primary/40"
                      aria-hidden
                    >
                      <Check className="w-6 h-6 text-foreground stroke-[2.5]" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="flex size-9 items-center justify-center rounded-full bg-foreground/8 hover:bg-foreground/15 transition-colors"
                      aria-label={`Scan to complete: ${task.name}`}
                    >
                      <ScanLine className="w-6 h-6 text-foreground stroke-[2]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {allDone && (
          <div className="rounded-xl border-2 border-primary/60 bg-primary/20 p-5 text-center">
            <p className="text-lg font-bold text-foreground mb-2">You did it!</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {hasSubmittedRaffle()
                ? "You're entered in our raffle. We'll notify you if you win."
                : 'Enter your details in the popup to join the gift card raffle.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('info')}
              className="text-sm font-semibold text-foreground underline underline-offset-2 hover:no-underline"
            >
              Learn more
            </button>
          </div>
        )}
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <span className="text-sm font-semibold text-foreground">Scan booth QR code</span>
            <button
              type="button"
              onClick={() => setShowScanner(false)}
              className="p-2 rounded-full bg-muted text-foreground hover:bg-secondary"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {scannerError && (
            <div className="px-4 py-3 bg-destructive/10 text-destructive text-sm">
              {scannerError}
              <br />
              <span className="text-muted-foreground">
                Open the QR link on this phone, or ask a volunteer for help.
              </span>
            </div>
          )}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <div id={SCANNER_ELEMENT_ID} className="w-full max-w-[280px] rounded-xl overflow-hidden" />
          </div>
          <p className="text-center text-xs text-muted-foreground pb-6 px-4">
            Point your camera at the section QR code
          </p>
        </div>
      )}

      {showEntryModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowEntryModal(false)} aria-hidden />
          <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 bg-card border border-border rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-bold text-foreground mb-1">You&apos;re in! Enter to win</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leave your name and phone so we can contact you if you win the gift card raffle.
            </p>
            <label className="block text-xs font-semibold text-foreground mb-1">Name</label>
            <input
              type="text"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm mb-3"
            />
            <label className="block text-xs font-semibold text-foreground mb-1">Phone number</label>
            <input
              type="tel"
              value={entryPhone}
              onChange={(e) => setEntryPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm mb-4"
            />
            {raffleSubmitError && (
              <p className="text-xs text-destructive mb-3">{raffleSubmitError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRaffleEntrySubmit}
                disabled={!entryName.trim() || !entryPhone.trim() || raffleSubmitting}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {raffleSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowEntryModal(false)}
                className="px-4 py-3 rounded-xl border border-border text-muted-foreground font-semibold"
              >
                Later
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
