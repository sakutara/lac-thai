import { BRANCHES } from '../data/branches.data';
import {
  ReservationFormInput,
  ReservationRecord,
  ReservationSyncStatus,
} from '../domain/models';
import { validateReservationInput } from '../domain/schemas/reservation.schema';
import { AnalyticsService, defaultAnalyticsService } from './analytics.service';
import {
  defaultReservationTransportService,
  generateReservationIcsCalendar,
  ReservationTransportService,
} from './reservation-transport.service';
import { SecurityGuardService } from './security-guard.service';

const OFFLINE_QUEUE_KEY = 'lacthai_offline_reservation_queue';
const HISTORY_STORAGE_KEY = 'lacthai_reservation_history';
const DRAFT_STORAGE_KEY = 'lacthai_reservation_form_draft';

export class ReservationService {
  private readonly transportService: ReservationTransportService;
  private readonly securityGuard: SecurityGuardService;
  private readonly analyticsService: AnalyticsService;

  constructor(
    transportService: ReservationTransportService = defaultReservationTransportService,
    securityGuard: SecurityGuardService = new SecurityGuardService(),
    analyticsService: AnalyticsService = defaultAnalyticsService
  ) {
    this.transportService = transportService;
    this.securityGuard = securityGuard;
    this.analyticsService = analyticsService;
  }

  public createReservationRecord(
    input: ReservationFormInput,
    idempotencyKey: string,
    status: ReservationSyncStatus,
    now: Date = new Date()
  ): ReservationRecord {
    const matchedBranch =
      BRANCHES.find((b) => b.reservationOptionValue === input.title) ?? BRANCHES[0];
    const randomSixDigits = String(100000 + Math.floor(Math.random() * 900000));
    const id = `#LT-${randomSixDigits}`;

    const baseRecord: ReservationRecord = {
      id,
      branchId: matchedBranch.id,
      branchHotline: matchedBranch.hotline,
      idempotencyKey,
      fullname: input.fullname.trim(),
      email: (input.email ?? '').trim(),
      phone: input.phone,
      title: input.title,
      date: input.date,
      time: input.time,
      quantity: Number(input.quantity),
      message: (input.message ?? '').trim(),
      createdAtIso: now.toISOString(),
      status,
      deliveryReceipts: [],
      calendarIcsContent: '',
    };

    baseRecord.calendarIcsContent = generateReservationIcsCalendar(baseRecord);
    return baseRecord;
  }

  public async submitReservation(
    rawInput: ReservationFormInput,
    options: {
      isOnline?: boolean;
      referenceDate?: Date;
      nowMs?: number;
    } = {}
  ): Promise<ReservationRecord> {
    const referenceDate = options.referenceDate ?? new Date();
    const nowMs = options.nowMs ?? Date.now();
    const isOnline =
      options.isOnline ?? (typeof navigator !== 'undefined' ? navigator.onLine : true);

    // Step 1: Validate fields with Zod/Schema rules
    const validation = validateReservationInput(rawInput, referenceDate);
    if (!validation.success) {
      const firstError =
        Object.values(validation.fieldErrors)[0] ?? 'Dữ liệu đặt bàn không hợp lệ.';
      const err = new Error(firstError) as Error & {
        fieldErrors?: Record<string, string>;
      };
      err.fieldErrors = validation.fieldErrors as Record<string, string>;
      throw err;
    }

    // Step 2: Check 4-Layer Anti-DoS & Bot Protection
    const secCheck = this.securityGuard.verifySubmissionAllowed(
      {
        ...rawInput,
        ...validation.data,
      },
      nowMs
    );
    if (!secCheck.allowed) {
      throw new Error(secCheck.message);
    }

    const record = this.createReservationRecord(
      validation.data,
      secCheck.idempotencyKey,
      isOnline ? 'SUBMITTED_ONLINE' : 'QUEUED_OFFLINE',
      referenceDate
    );

    if (isOnline) {
      const receipts = await this.transportService.dispatchReservation(record);
      record.deliveryReceipts = receipts;
      this.securityGuard.recordSuccessfulSubmission(secCheck.idempotencyKey, nowMs);
      this.appendToHistory(record);
      this.clearDraft();
      this.analyticsService.trackReservationConversion(record.id, record.branchId);
      return record;
    }

    // Offline Mode -> Push to Bounded Offline Queue (max 5 items)
    const queue = this.getOfflineQueue();
    const maxQueue = this.securityGuard.getPolicy().maxOfflineQueueSize;
    if (queue.length >= maxQueue) {
      throw new Error(
        `Hàng đợi đặt bàn ngoại tuyến đã đầy (${maxQueue} yêu cầu). Vui lòng kết nối mạng hoặc gọi Hotline ${record.branchHotline}.`
      );
    }

    queue.push(record);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    this.securityGuard.recordSuccessfulSubmission(secCheck.idempotencyKey, nowMs);
    this.appendToHistory(record);
    this.clearDraft();
    return record;
  }

  public getOfflineQueue(): ReservationRecord[] {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? (JSON.parse(raw) as ReservationRecord[]) : [];
    } catch {
      return [];
    }
  }

  public async flushOfflineQueue(): Promise<ReservationRecord[]> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return [];

    const syncedRecords: ReservationRecord[] = [];
    for (const item of queue) {
      const receipts = await this.transportService.dispatchReservation(item);
      const updated: ReservationRecord = {
        ...item,
        status: 'SYNCED_FROM_OFFLINE',
        deliveryReceipts: receipts,
      };
      syncedRecords.push(updated);
      this.updateHistoryItem(updated);
    }

    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    return syncedRecords;
  }

  public getReservationHistory(): ReservationRecord[] {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ReservationRecord[]) : [];
    } catch {
      return [];
    }
  }

  private appendToHistory(record: ReservationRecord): void {
    const history = this.getReservationHistory();
    const updated = [record, ...history].slice(0, 10);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  }

  private updateHistoryItem(updatedRecord: ReservationRecord): void {
    const history = this.getReservationHistory().map((item) =>
      item.id === updatedRecord.id ? updatedRecord : item
    );
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }

  public saveDraft(draft: Partial<ReservationFormInput>): void {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }

  public loadDraft(): Partial<ReservationFormInput> | null {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Partial<ReservationFormInput>) : null;
    } catch {
      return null;
    }
  }

  public clearDraft(): void {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  }
}

export const defaultReservationService = new ReservationService();
