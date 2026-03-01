import { useState } from 'react';
import { ChevronLeft, QrCode, CheckCircle2, Circle, Trophy } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  code: string;
  section: string;
}

const initialTasks: Task[] = [
  { id: 1, name: 'Visit a booth in Section A (East Side)',       completed: false, code: 'SECTION-A', section: 'A' },
  { id: 2, name: 'Visit a booth in Section B (Middle Row)',      completed: false, code: 'SECTION-B', section: 'B' },
  { id: 3, name: 'Visit a booth in Section C (South Row)',       completed: false, code: 'SECTION-C', section: 'C' },
  { id: 4, name: 'Visit a booth in Section D (West Side)',       completed: false, code: 'SECTION-D', section: 'D' },
  { id: 5, name: 'Visit a booth in Section E (North Center)',    completed: false, code: 'SECTION-E', section: 'E' },
];

const sectionColors: Record<string, string> = {
  A: '#fbee08',
  B: '#e6d906',
  C: '#d1c405',
  D: '#bcaf04',
  E: '#a79a03',
};

export function ScavengerHuntScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [codeInput, setCodeInput] = useState('');
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [codeError, setCodeError] = useState('');

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
                className="w-full carnival-gradient text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
              >
                <QrCode className="w-5 h-5" />
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
              You've visited all five sections. You've been automatically entered into our <strong>raffle to win a gift card!</strong> Winners will be announced at the end of the carnival.
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
    </div>
  );
}
