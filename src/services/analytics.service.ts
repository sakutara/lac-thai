import { BRAND_INFO } from '../data/branches.data';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export class AnalyticsService {
  public trackPageView(path: string, title: string): void {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'spa_page_view',
      page_path: path,
      page_title: title,
      gtm_id: BRAND_INFO.gtmId,
    });
  }

  public trackReservationConversion(reservationId: string, branchId: string): void {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'conversion',
      send_to: BRAND_INFO.googleAdsConversionSendTo,
      reservation_id: reservationId,
      branch_id: branchId,
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: BRAND_INFO.googleAdsConversionSendTo,
      });
    }
  }
}

export const defaultAnalyticsService = new AnalyticsService();
