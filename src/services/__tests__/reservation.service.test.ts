import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ReservationTransportService,
  formatReservationEmailSubject,
  buildLegacyFormData,
  generateReservationIcsCalendar,
} from '../reservation-transport.service';
import { ReservationService } from '../reservation.service';
import { SecurityGuardService } from '../security-guard.service';
import { AnalyticsService } from '../analytics.service';
import { ReservationFormInput } from '../../domain/models';

describe('ReservationTransportService & ReservationService — End-to-End Delivery, Recipients & Offline Queue (TDD)', () => {
  let transportService: ReservationTransportService;
  let securityGuard: SecurityGuardService;
  let analyticsService: AnalyticsService;
  let reservationService: ReservationService;

  const validInput: ReservationFormInput = {
    fullname: 'Lê Hoàng Nam',
    email: 'nam.le@example.com',
    phone: '0909 89 80 64',
    title: '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM',
    date: '2026-10-28',
    time: '19:30',
    quantity: 6,
    message: 'Khu vực sân vườn, có ghế trẻ em',
    honeypot: '',
    formOpenedAtMs: 1_000_000,
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    transportService = new ReservationTransportService();
    securityGuard = new SecurityGuardService();
    analyticsService = new AnalyticsService();
    reservationService = new ReservationService(
      transportService,
      securityGuard,
      analyticsService
    );
  });

  it('packs exact ContactForm[...] fields for Legacy PHP /dat-ban compatibility', () => {
    const formData = buildLegacyFormData(validInput);
    expect(formData.get('ContactForm[fullname]')).toBe('Lê Hoàng Nam');
    expect(formData.get('ContactForm[email]')).toBe('nam.le@example.com');
    expect(formData.get('ContactForm[phone]')).toBe('0909898064');
    expect(formData.get('ContactForm[title]')).toBe(
      '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM'
    );
    expect(formData.get('ContactForm[date]')).toBe('2026-10-28');
    expect(formData.get('ContactForm[time]')).toBe('19:30');
    expect(formData.get('ContactForm[quantity]')).toBe('6');
    expect(formData.get('ContactForm[message]')).toBe(
      'Khu vực sân vườn, có ghế trẻ em'
    );
  });

  it('formats recipient email subject routed by both branches and generates valid .ics calendar file', () => {
    const xuanThuyRecord = reservationService.createReservationRecord(
      validInput,
      'idemp-key-1',
      'SUBMITTED_ONLINE',
      new Date('2026-10-17T10:00:00Z')
    );

    const subjectXt = formatReservationEmailSubject(xuanThuyRecord);
    expect(subjectXt).toContain('CN XUÂN THỦY');
    expect(subjectXt).toContain('Lê Hoàng Nam');

    const mtbRecord = reservationService.createReservationRecord(
      {
        ...validInput,
        title: '71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM',
      },
      'idemp-key-2',
      'SUBMITTED_ONLINE',
      new Date('2026-10-17T10:00:00Z')
    );
    const subjectMtb = formatReservationEmailSubject(mtbRecord);
    expect(subjectMtb).toContain('CN MẠC THỊ BƯỞI');

    const ics = generateReservationIcsCalendar(xuanThuyRecord);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Đặt bàn Nhà hàng Lạc Thái');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('dispatches online reservation via Composite Multi-Channel Adapter (Google Sheets + Email Relay + Legacy POST) and fires Google Ads Conversion', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    window.gtag = vi.fn();

    const fullTransport = new ReservationTransportService({
      webhookUrl: 'https://script.google.com/macros/s/mock/exec',
      enableLegacyPost: true,
    });
    const serviceWithWebhook = new ReservationService(
      fullTransport,
      securityGuard,
      analyticsService
    );

    const record = await serviceWithWebhook.submitReservation(validInput, {
      isOnline: true,
      referenceDate: new Date('2026-10-17T08:00:00+07:00'),
      nowMs: 1_005_000,
    });

    expect(record.id).toMatch(/^#LT-\d{6}$/);
    expect(record.status).toBe('SUBMITTED_ONLINE');
    expect(record.branchId).toBe('xuan-thuy');
    expect(record.branchHotline).toBe('0909 89 80 64');
    expect(record.deliveryReceipts).toHaveLength(3);
    expect(record.deliveryReceipts.every((r) => r.delivered)).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-11425296834/Z7U8CJ-hi_wYEMLjgMgq',
    });

    const history = serviceWithWebhook.getReservationHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(record.id);
  });

  it('queues reservation in Bounded Offline Queue (max 5) when offline and flushes when back online', async () => {
    // Flushing when queue is empty returns []
    expect(await reservationService.flushOfflineQueue()).toEqual([]);

    const record = await reservationService.submitReservation(validInput, {
      isOnline: false,
      referenceDate: new Date('2026-10-17T08:00:00+07:00'),
      nowMs: 1_005_000,
    });

    expect(record.status).toBe('QUEUED_OFFLINE');
    expect(reservationService.getOfflineQueue()).toHaveLength(1);

    // Flush queue when online
    const synced = await reservationService.flushOfflineQueue();
    expect(synced).toHaveLength(1);
    expect(synced[0].status).toBe('SYNCED_FROM_OFFLINE');
    expect(reservationService.getOfflineQueue()).toHaveLength(0);
  });

  it('auto-saves and restores form draft in sessionStorage', () => {
    reservationService.saveDraft({
      fullname: 'Khách Đang Nhập',
      phone: '0906678283',
    });
    const draft = reservationService.loadDraft();
    expect(draft?.fullname).toBe('Khách Đang Nhập');

    reservationService.clearDraft();
    expect(reservationService.loadDraft()).toBeNull();
  });
});
