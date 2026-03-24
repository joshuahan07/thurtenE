import { supabase } from './supabaseClient';

/** Event names stored in `analytics_events.event_type` */
export const AnalyticsEventType = {
  /** Once per browser tab (sessionStorage); survives reload in the same tab. */
  APP_SESSION: 'app_session',
  /** Every full load of the app (including reload); use for “how many loads” totals. */
  PAGE_LOAD: 'page_load',
  SCREEN_VIEW: 'screen_view',
  QR_SECTION_COMPLETE: 'qr_section_complete',
} as const;

export type AnalyticsEventTypeName = (typeof AnalyticsEventType)[keyof typeof AnalyticsEventType];

const TABLE = 'analytics_events';
const VISITOR_STORAGE_KEY = 'thurtene-analytics-visitor-id';

/** Stable per-browser id (localStorage). Not a person: new device/incognito/clear storage = new id. */
function getOrCreateVisitorId(): string | undefined {
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing && existing.length > 0) return existing;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Fire-and-forget insert for Supabase analytics.
 * Fails silently if env/table missing (never blocks UX).
 */
export async function recordAnalyticsEvent(
  eventType: AnalyticsEventTypeName,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId();
    const payloadMeta =
      visitorId !== undefined ? { ...metadata, visitor_id: visitorId } : { ...metadata };
    const { error } = await supabase.from(TABLE).insert({
      event_type: eventType,
      metadata: payloadMeta,
    });
    if (error) {
      console.warn('analytics insert failed:', error.message);
    }
  } catch {
    // ignore
  }
}
