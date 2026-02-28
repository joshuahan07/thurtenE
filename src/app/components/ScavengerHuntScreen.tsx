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
  A: '#E85B1A',
  B: '#F5A921',
  C: '#1D8A6E',
  D: '#C45EC4',
  E: '#3B82F6',
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
          Scavenger Hunt
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto space-y-4">

        {/* Prize Banner */}
        <div className="bg-[#2A1410] border border-[#E85B1A] rounded-xl p-4 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-[#F5A921] shrink-0 mt-0.5" />
          <p className="text-sm text-[#F5E8D8] leading-relaxed">
            Complete all five sections and you'll be entered into a <strong className="text-[#F5A921]">raffle to win a gift card!</strong> Scan the QR code at each booth to unlock it.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-[#231208] border border-[#4A2010] rounded-xl p-4 shadow">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="text-4xl font-extrabold text-[#F5A921]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {completedCount}
            </span>
            <span className="text-xl text-[#C8A884]">/ {totalTasks}</span>
            <span className="text-sm text-[#C8A884] ml-1">sections visited</span>
          </div>
          <div className="h-3 bg-[#321508] rounded-full overflow-hidden border border-[#4A2010]">
            <div
              className="h-full rounded-full carnival-gradient transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-[#C8A884] mt-1 text-right">
            {Math.round(progressPct)}% complete
          </p>
        </div>

        {/* QR / Code Entry */}
        <div className="bg-[#231208] border border-[#4A2010] rounded-xl p-4 shadow">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-[#E85B1A]" />
            <span className="text-xs text-[#F5A921] uppercase tracking-widest font-semibold">
              Mark a Section Complete
            </span>
          </div>
          {!showCodeEntry ? (
            <div className="space-y-2">
              <button
                className="w-full carnival-gradient text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
              >
                <QrCode className="w-5 h-5" />
                Scan QR Code at Booth
              </button>
              <button
                onClick={() => { setShowCodeEntry(true); setCodeError(''); }}
                className="w-full bg-[#321508] text-[#F5E8D8] py-3 rounded-xl border border-[#4A2010] font-semibold hover:bg-[#3A1C10] transition-colors"
              >
                Enter Code Manually
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs text-[#C8A884] mb-1 font-semibold uppercase tracking-wide">
                Booth Code
              </label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setCodeError(''); }}
                placeholder="e.g. SECTION-A"
                className="w-full bg-[#321508] border border-[#4A2010] rounded-xl px-4 py-3 text-[#F5E8D8] placeholder:text-[#6B4A30] focus:outline-none focus:border-[#E85B1A] text-sm"
              />
              {codeError && (
                <p className="text-xs text-red-400">{codeError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitCode}
                  className="flex-1 carnival-gradient text-white py-2.5 rounded-xl font-semibold shadow active:scale-[0.98] transition-transform"
                >
                  Submit
                </button>
                <button
                  onClick={() => { setShowCodeEntry(false); setCodeInput(''); setCodeError(''); }}
                  className="px-4 bg-[#321508] border border-[#4A2010] rounded-xl text-[#C8A884] hover:text-[#F5E8D8] font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Task Checklist */}
        <div className="bg-[#231208] border border-[#4A2010] rounded-xl p-4 shadow">
          <p className="text-xs text-[#F5A921] uppercase tracking-widest font-semibold mb-3">
            Sections Checklist
          </p>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  task.completed
                    ? 'border-[#E85B1A]/40 bg-[#2E1510]'
                    : 'border-[#4A2010] bg-[#1C0E06]'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: sectionColors[task.section] ?? '#E85B1A' }}
                >
                  {task.section}
                </span>
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#E85B1A] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#4A2010] shrink-0" />
                )}
                <span
                  className={`text-sm flex-1 ${
                    task.completed
                      ? 'line-through text-[#6B4A30]'
                      : 'text-[#F5E8D8]'
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
              className="bg-white text-[#E85B1A] py-2.5 px-6 rounded-xl font-bold shadow hover:bg-[#FFF8F0] transition-colors"
            >
              Learn More →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
