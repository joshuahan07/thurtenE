import { Bell, X } from 'lucide-react';

type Props = {
  open: boolean;
  onDismiss: () => void;
  onGoToSignup: () => void;
};

/**
 * First-visit prompt for the Stay Updated flow. Parent sets localStorage when dismissed.
 */
export function StayUpdatedPromoModal({ open, onDismiss, onGoToSignup }: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={onDismiss}
      />
      {/* Full-viewport flex centers the dialog on all screen sizes */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="stay-updated-promo-title"
          className="pointer-events-auto w-full max-w-md mx-auto bg-card border-2 border-border rounded-2xl shadow-2xl p-6 relative"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3 right-3 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 pr-8">
            <div className="carnival-gradient w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Bell className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2
              id="stay-updated-promo-title"
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay Updated
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Get carnival updates and future ThurtenE news
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToSignup}
            className="w-full carnival-gradient text-primary-foreground py-3.5 rounded-xl font-bold text-base shadow-md active:scale-[0.98] transition-transform"
          >
            Stay Updated
          </button>
        </div>
      </div>
    </>
  );
}
