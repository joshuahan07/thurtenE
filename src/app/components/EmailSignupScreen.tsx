import { useState } from 'react';
import { Bell, ChevronLeft, CheckCircle2 } from 'lucide-react';

export function EmailSignupScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#180C04] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C0E06] border-b-2 border-[#E85B1A] p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          className="text-[#F5E8D8] p-1 flex items-center gap-1 hover:text-[#F5A921] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <h1
          className="text-lg font-bold text-[#F5E8D8]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Stay Updated
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        {!submitted ? (
          <>
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="carnival-gradient w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl mb-4">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h2
                className="text-2xl font-bold text-[#F5E8D8]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Get Carnival Updates
              </h2>
              <p className="text-[#C8A884] mt-2 text-sm leading-relaxed">
                Sign up for exclusive updates, prize announcements, and future carnival news.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-[#231208] border border-[#4A2010] rounded-xl p-4 mb-6 shadow space-y-3">
              {[
                { title: 'Event Updates',  body: 'Stay informed about schedule changes and new attractions' },
                { title: 'Prize Alerts',   body: 'Get notified about raffle draws and special giveaways' },
                { title: 'Early Access',   body: 'Be first to hear about future ThurtenE Carnival dates' },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 carnival-gradient rounded-md shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                  <p className="text-sm text-[#F5E8D8]">
                    <strong>{b.title}:</strong>{' '}
                    <span className="text-[#C8A884]">{b.body}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="mt-auto space-y-4">
              <div>
                <label className="block text-sm text-[#F5E8D8] font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full bg-[#321508] border border-[#4A2010] rounded-xl px-4 py-3.5 text-[#F5E8D8] placeholder:text-[#6B4A30] focus:outline-none focus:border-[#E85B1A] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[#F5E8D8] font-semibold mb-1.5">
                  Phone Number{' '}
                  <span className="text-[#C8A884] font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#321508] border border-[#4A2010] rounded-xl px-4 py-3.5 text-[#F5E8D8] placeholder:text-[#6B4A30] focus:outline-none focus:border-[#E85B1A] text-sm"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full carnival-gradient text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
              >
                Sign Me Up
              </button>
              <p className="text-xs text-[#6B4A30] text-center">
                We'll never spam you. Unsubscribe anytime.
              </p>
            </div>
          </>
        ) : (
          /* Success */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="carnival-gradient w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl mb-5">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2
              className="text-2xl font-bold text-[#F5E8D8] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              You're In!
            </h2>
            <p className="text-[#C8A884] text-sm mb-8 max-w-xs leading-relaxed">
              We'll send carnival updates to <strong className="text-[#F5E8D8]">{email}</strong>
              {phone && (
                <> and texts to <strong className="text-[#F5E8D8]">{phone}</strong></>
              )}.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="carnival-gradient text-white py-3 px-8 rounded-xl font-bold shadow-lg"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
