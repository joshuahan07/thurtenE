import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, QrCode, CheckCircle2, Circle, Trophy, Printer, X, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { upsertScavengerCompletion } from '../../services/keepinContactService';

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
  { id: 1, name: 'Visit a booth in Section A',       completed: false, code: 'SECTION-A', section: 'A' },
  { id: 2, name: 'Visit a booth in Section B',       completed: false, code: 'SECTION-B', section: 'B' },
  { id: 3, name: 'Visit a booth in Section C',       completed: false, code: 'SECTION-C', section: 'C' },
  { id: 4, name: 'Visit a booth in Section D',       completed: false, code: 'SECTION-D', section: 'D' },
  { id: 5, name: 'Visit a booth in Section E',       completed: false, code: 'SECTION-E', section: 'E' },
];

const sectionColors: Record<string, string> = {
  A: '#fbee08',
  B: '#e6d906',
  C: '#d1c405',
  D: '#bcaf04',
  E: '#a79a03',
};

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

/** Progress is stored in localStorage: per device/browser only. Other phones do not see your checkmarks. */
function getSavedRaffleEntry(): { name: string; phone: string } | null {
  try {
    const raw = localStorage.getItem(RAFFLE_ENTRY_KEY);
    if (raw) {
      const o = JSON.parse(raw) as { name?: string; phone?: string };
      if (o && typeof o.name === 'string' && typeof o.phone === 'string') return o;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Parse section letter from scanned QR (URL or hash like #scavenger-section-A). */
function parseSectionFromScannedText(text: string): string | null {
  const match = text.match(/scavenger-section-([A-E])/i);
  return match ? match[1].toUpperCase() : null;
}

export function ScavengerHuntScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>(loadSavedTasks);
  const [codeInput, setCodeInput] = useState('');
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [showQrPrint, setShowQrPrint] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryName, setEntryName] = useState('');
  const [entryPhone, setEntryPhone] = useState('');
  const [raffleSubmitting, setRaffleSubmitting] = useState(false);
  const [raffleSubmitError, setRaffleSubmitError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Persist tasks whenever they change (per device only – localStorage)
  useEffect(() => {
    localStorage.setItem(SCAVENGER_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // On mount: if URL hash is #scavenger-section-X, mark that section complete (opened from QR)
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#scavenger-section-([A-E])$/i);
    if (!match) return;
    const section = match[1].toUpperCase();
    setTasks((prev) =>
      prev.map((t) => (t.section === section ? { ...t, completed: true } : t))
    );
    window.location.hash = '#scavenger';
  }, []);

  // When all sections done, show raffle entry modal once if not already submitted
  useEffect(() => {
    const allDone = tasks.every((t) => t.completed);
    if (allDone && !getSavedRaffleEntry()) setShowEntryModal(true);
  }, [tasks]);

  // Camera scanner: start when showScanner true, cleanup when false
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
            scanner.stop().then(() => {
              qrScannerRef.current = null;
              setTasks((prev) =>
                prev.map((t) => (t.section === section ? { ...t, completed: true } : t))
              );
              setShowScanner(false);
            }).catch(() => {
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

  const handleSubmitCode = () => {
    const match = tasks.find(
      (t) => t.code.toLowerCase() === codeInput.trim().toLowerCase() && !t.completed
    );
    if (match) {
      setTasks(tasks.map((t) => (t.id === match.id ? { ...t, completed: true } : t)));
      setCodeInput('');
      setShowCodeEntry(false);
      setCodeError('');
    } else {
      setCodeError('Code not recognised or already used. Try again!');
    }
  };

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname || ''}`.replace(/\/$/, '') || window.location.origin
      : '';
  const sectionQrUrls = (['A', 'B', 'C', 'D', 'E'] as const).map(
    (s) => `${baseUrl}#scavenger-section-${s}`
  );
  const qrImageUrl = (url: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const handleRaffleEntrySubmit = async () => {
    const name = entryName.trim();
    const phone = entryPhone.trim();
    if (!name || !phone) return;
    setRaffleSubmitting(true);
    setRaffleSubmitError(null);
    try {
      localStorage.setItem(RAFFLE_ENTRY_KEY, JSON.stringify({ name, phone }));
      await upsertScavengerCompletion({ name, phone });
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

      <div className="flex-1 p-4 pb-24 overflow-y-auto space-y-4">

        {/* Prize Banner */}
        <div className="bg-card border border-primary rounded-xl p-4 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">
            Complete all five sections and you'll be entered into a <strong className="text-accent">raffle to win a gift card!</strong> Scan the QR code at each booth to unlock it.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-card border border-border rounded-xl p-4 shadow">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="text-4xl font-extrabold text-accent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {completedCount}
            </span>
            <span className="text-xl text-muted-foreground">/ {totalTasks}</span>
            <span className="text-sm text-muted-foreground ml-1">sections visited</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full rounded-full carnival-gradient transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progressPct)}% complete
          </p>
        </div>

        {/* QR / Code Entry */}
        <div className="bg-card border border-border rounded-xl p-4 shadow">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-primary" />
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">
              Mark a Section Complete
            </span>
          </div>
          {!showCodeEntry ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="w-full carnival-gradient text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
              >
                <Camera className="w-5 h-5" />
                Scan QR Code at Booth
              </button>
              <button
                onClick={() => { setShowCodeEntry(true); setCodeError(''); }}
                className="w-full bg-muted text-foreground py-3 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
              >
                Enter Code Manually
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">
                Booth Code
              </label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setCodeError(''); }}
                placeholder="e.g. SECTION-A"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
              {codeError && (
                <p className="text-xs text-destructive">{codeError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitCode}
                  className="flex-1 carnival-gradient text-primary-foreground py-2.5 rounded-xl font-semibold shadow active:scale-[0.98] transition-transform"
                >
                  Submit
                </button>
                <button
                  onClick={() => { setShowCodeEntry(false); setCodeInput(''); setCodeError(''); }}
                  className="px-4 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Task Checklist */}
        <div className="bg-card border border-border rounded-xl p-4 shadow">
          <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">
            Sections Checklist
          </p>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  task.completed
                    ? 'border-primary/40 bg-muted'
                    : 'border-border bg-card'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-background shrink-0"
                  style={{ backgroundColor: sectionColors[task.section] ?? '#fbee08' }}
                >
                  {task.section}
                </span>
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-border shrink-0" />
                )}
                <span
                  className={`text-sm flex-1 ${
                    task.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {task.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Print QR codes for booths */}
        <div className="bg-card border border-border rounded-xl p-4 shadow">
          <button
            type="button"
            onClick={() => setShowQrPrint(!showQrPrint)}
            className="w-full flex items-center justify-center gap-2 text-foreground font-semibold text-sm"
          >
            <Printer className="w-4 h-4 text-primary" />
            {showQrPrint ? 'Hide QR codes' : 'Get QR codes to print for each section'}
          </button>
          {showQrPrint && baseUrl && (
            <div className="mt-4 space-y-4 print:block">
              <p className="text-xs text-muted-foreground">
                Print this page or screenshot. Place each QR code in Section A, B, C, D, and E. When visitors scan a code, the app opens and checks off that section.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {(['A', 'B', 'C', 'D', 'E'] as const).map((section, i) => (
                  <div key={section} className="flex flex-col items-center gap-2">
                    <div className="bg-white p-2 rounded-lg">
                      <img
                        src={qrImageUrl(sectionQrUrls[i])}
                        alt={`Section ${section} QR code`}
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px]"
                      />
                    </div>
                    <span className="text-xs font-bold text-accent">Section {section}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">URLs (for manual entry or custom QR tools)</p>
                {sectionQrUrls.map((url, i) => (
                  <p key={i} className="text-[10px] text-foreground break-all font-mono">{url}</p>
                ))}
              </div>
            </div>
          )}
          {showQrPrint && !baseUrl && (
            <p className="mt-2 text-xs text-muted-foreground">Load this page in a browser to see QR codes.</p>
          )}
        </div>

        {/* Completion Banner */}
        {allDone && (
          <div className="carnival-gradient rounded-xl p-5 text-center shadow-2xl">
            <div
              className="text-4xl font-extrabold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              🎉 You Did It!
            </div>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              You've visited all five sections. {getSavedRaffleEntry() ? "You're entered in our raffle—we'll notify you if you win!" : 'Enter your details below to be entered for the gift card raffle.'}
            </p>
            <button
              onClick={() => onNavigate('info')}
              className="bg-foreground text-background py-2.5 px-6 rounded-xl font-bold shadow hover:opacity-90 transition-colors"
            >
              Learn More →
            </button>
          </div>
        )}
      </div>

      {/* Camera QR scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <span className="text-sm font-semibold text-foreground">Scan booth QR code</span>
            <button
              type="button"
              onClick={() => setShowScanner(false)}
              className="p-2 rounded-full bg-muted text-foreground hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {scannerError && (
            <div className="px-4 py-3 bg-destructive/10 text-destructive text-sm">
              {scannerError}
              <br />
              <span className="text-muted-foreground">Use &quot;Enter Code Manually&quot; or open the QR link on this phone instead.</span>
            </div>
          )}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <div id={SCANNER_ELEMENT_ID} className="w-full max-w-[280px] rounded-xl overflow-hidden" />
          </div>
          <p className="text-center text-xs text-muted-foreground pb-6 px-4">
            Point your camera at the section QR code at the booth
          </p>
        </div>
      )}

      {/* Raffle entry modal – when they finish all 5 sections */}
      {showEntryModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowEntryModal(false)} />
          <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 bg-card border-2 border-primary rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              You&apos;re in! Enter to win
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leave your name and phone number so we can contact you if you win the gift card raffle.
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
