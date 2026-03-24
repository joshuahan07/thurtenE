import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, MapPin, HelpCircle } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqSections = [
  {
    title: 'Dates & Times',
    icon: Clock,
    items: [
      { id: 1,  question: 'When is the carnival?',                   answer: 'April 17–19, 2026. Three incredible days on the Wash U campus!' },
      { id: 2,  question: 'What are the hours?',                     answer: 'Thursday & Friday: 11 AM – 10 PM. Saturday: 11 AM – 9 PM.' },
      { id: 3,  question: 'Is there a performance schedule?',        answer: 'Yes! Check the Main Stage area on the map for the full lineup each day.' },
    ],
  },
  {
    title: 'Location & Directions',
    icon: MapPin,
    items: [
      { id: 4,  question: 'Where is the carnival held?',             answer: 'On the Danforth Campus of Washington University in St. Louis, along Brookings and Forsyth Blvd.' },
      { id: 5,  question: 'Is parking available?',                   answer: 'Yes, campus parking lots are available. Check the Wash U parking website for details.' },
      { id: 6,  question: 'How do I get there by public transit?',   answer: 'Metro Blue Line stops at Forsyth station, a short walk to campus.' },
    ],
  },
  {
    title: 'General Questions',
    icon: HelpCircle,
    items: [
      { id: 7,  question: 'Is the carnival free?',                   answer: 'Entry is completely free! Individual food and game booths may charge separately.' },
      { id: 8,  question: 'Can I bring outside food?',               answer: 'Outside food is allowed, but we strongly recommend trying the amazing student group vendors!' },
      { id: 9,  question: 'Are pets allowed?',                       answer: 'Only service animals are permitted on the carnival grounds.' },
      { id: 10, question: 'What payment methods are accepted?',      answer: 'Cash is widely accepted. Many booths accept Venmo or credit cards — check with individual groups.' },
      { id: 11, question: 'Is the carnival wheelchair accessible?',  answer: 'Yes! All main pathways are accessible. ADA-compliant restrooms are available.' },
      { id: 12, question: 'How does the scavenger hunt raffle work?', answer: 'Visit all five booth sections and scan/enter each QR code in the app. All winners are automatically entered into a raffle to win a gift card. Winners are announced at the close of the carnival.' },
    ],
  },
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
              <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-0.5">Hours</p>
              <p className="text-sm text-foreground">Thu & Fri: 11 AM – 10 PM &nbsp;·&nbsp; Sat: 11 AM – 9 PM</p>
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

        {/* FAQ Sections */}
        {faqSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="bg-card border border-border rounded-xl p-4 shadow border-l-4 border-l-[#ea580c]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <SectionIcon className="w-4 h-4 text-[#ea580c]" strokeWidth={2} />
                <h2
                  className="text-sm font-bold text-accent uppercase tracking-widest"
                >
                  {section.title}
                </h2>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className={`w-full p-3.5 text-left flex justify-between items-center transition-colors ${
                        expandedId === item.id ? 'bg-muted' : 'bg-card hover:bg-secondary'
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
          );
        })}

        {/* Contact CTA */}
        <div className="bg-card border border-border rounded-xl p-4 shadow border-l-4 border-l-[#ea580c]">
          <h3
            className="font-bold text-foreground mb-1 text-base"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-3">Visit the Thurtene Alumni Tent on-site, or reach out online.</p>
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
