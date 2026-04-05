import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, MapPin, HelpCircle } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { id: 1, question: 'What are the costs to enter?',                       answer: 'Entering Carnival is completely free, however rides and booths do charge money to participate in the activity or for food. Rides typically cost between $2 and $5.' },
  { id: 2, question: 'How much do tickets cost?',                          answer: 'Tickets are $1 each or $20 for a sheet of 24 tickets. If bought through the presale, the price is $18 for a sheet of 24 tickets. All tickets bought are non-refundable. We offer an All-you-can-ride pass for Friday evenings only for $25.' },
  { id: 3, question: 'Will tickets from last year be valid this year?',    answer: 'Yes, tickets purchased last year will be honored this year.' },
  { id: 4, question: 'What can I expect at Carnival?',                     answer: 'You can expect plenty of fun games and rides, alongside booths run by different student groups! The theme this year is \u201cReady, Set, ThurtenE\u201d, so be on the lookout for themed games and activities during Carnival!' },
  { id: 5, question: 'What is a Community Partner?',                       answer: 'Each year the carnival hosts a community partner to connect the WashU and Greater St. Louis community to the work done by numerous organizations to make St. Louis a great place. Through the carnival we hope to provide visibility and promote the important initiatives of our partner. We\u2019re happy to announce that our Community Partner is St. Louis Arc this year!' },
  { id: 6, question: 'What is ThurtenE?',                                  answer: 'ThurtenE is an Honorary consisting of 13 members of WashU\u2019s Junior Class each year. These 13 Juniors are responsible for planning Carnival and making a positive impact on the community.' },
];

export function InfoFaqScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b-2 border-primary p-4 flex items-center justify-between shadow-lg">
        <button
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
          Info & FAQ
        </h1>
        <div className="w-16" />
      </div>

      <div className="p-4 pb-24 space-y-4">
        {/* Quick Info Card */}
        <div className="bg-card border border-border rounded-xl p-4 shadow border-l-4 border-l-[#ea580c]">
          <h2
            className="text-base font-bold text-foreground mb-3 pb-2 border-b border-border"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quick Info
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-0.5">Dates</p>
              <p className="text-sm text-foreground">April 17–19, 2026</p>
            </div>
            <div>
              <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1.5">Carnival Hours</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-foreground">
                <span className="font-semibold">Friday</span>
                <span>4:00 PM – 8:00 PM</span>
                <span className="font-semibold">Saturday</span>
                <span>11:00 AM – 4:30 PM</span>
                <span className="font-semibold">Sunday</span>
                <span>11:00 AM – 4:30 PM</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-0.5">Location</p>
              <p className="text-sm text-foreground">Danforth Campus, Washington University in St. Louis</p>
            </div>
            <div>
              <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-0.5">Admission</p>
              <p className="text-sm text-foreground">Free Entry</p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Washington+University+in+St+Louis"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d] py-3 rounded-xl font-semibold shadow active:scale-[0.98] transition-transform hover:opacity-95"
          >
            <MapPin className="w-4 h-4" />
            Get Directions
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4 shadow border-l-4 border-l-[#ea580c]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <HelpCircle className="w-4 h-4 text-[#ea580c]" strokeWidth={2} />
            <h2 className="text-sm font-bold text-accent uppercase tracking-widest">FAQ</h2>
          </div>
          <div className="space-y-1">
            {faqs.map((item) => (
              <div key={item.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`w-full p-3.5 text-left flex justify-between items-center transition-colors ${
                    expandedId === item.id ? 'bg-muted' : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  <span className="font-medium text-foreground text-sm pr-2">{item.question}</span>
                  {expandedId === item.id
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  }
                </button>
                {expandedId === item.id && (
                  <div className="px-4 py-3 border-t border-border bg-card">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-card border border-border rounded-xl p-4 shadow border-l-4 border-l-[#ea580c]">
          <h3
            className="font-bold text-foreground mb-1 text-base"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-3">Reach out online.</p>
          <a
            href="https://www.thurtene.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center bg-gradient-to-br from-[#fbee08] via-[#ffc14a] to-[#f97316] text-[#0f100d] py-3 rounded-xl font-semibold shadow active:scale-[0.98] transition-transform hover:opacity-95"
          >
            Visit Thurtene.org →
          </a>
        </div>
      </div>
    </div>
  );
}
