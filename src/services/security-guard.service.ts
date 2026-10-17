import { RateLimitPolicy, ReservationFormInput } from '../domain/models';
import { normalizeVietnamesePhone } from '../domain/schemas/reservation.schema';

const STORAGE_KEY = 'lacthai_security_rate_limit_log';

export const DEFAULT_RATE_LIMIT_POLICY: RateLimitPolicy = {
  maxRequestsPerWindow: 3,
  windowDurationMs: 15 * 60 * 1000, // 15 minutes
  cooldownDurationMs: 30 * 1000, // 30 seconds
  dedupWindowMs: 10 * 60 * 1000, // 10 minutes
  minFillTimeMs: 1_500, // 1.5 seconds
  maxOfflineQueueSize: 5,
};

interface SubmissionLogEntry {
  idempotencyKey: string;
  timestampMs: number;
}

export type SecurityVerificationResult =
  | {
      allowed: true;
      idempotencyKey: string;
    }
  | {
      allowed: false;
      reason:
        | 'BOT_HONEYPOT'
        | 'BOT_TOO_FAST'
        | 'COOLDOWN_ACTIVE'
        | 'RATE_LIMIT_EXCEEDED'
        | 'DUPLICATE_SUBMISSION';
      message: string;
      retryAfterSeconds?: number;
    };

export function buildReservationIdempotencyKey(input: ReservationFormInput): string {
  const normalizedPhone = normalizeVietnamesePhone(input.phone ?? '');
  return `${normalizedPhone}|${(input.title ?? '').trim()}|${(input.date ?? '').trim()}|${(
    input.time ?? ''
  ).trim()}`;
}

export class SecurityGuardService {
  private readonly policy: RateLimitPolicy;

  constructor(policy: Partial<RateLimitPolicy> = {}) {
    this.policy = { ...DEFAULT_RATE_LIMIT_POLICY, ...policy };
  }

  public getPolicy(): RateLimitPolicy {
    return this.policy;
  }

  private loadEntries(nowMs: number): SubmissionLogEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SubmissionLogEntry[];
      const maxWindow = Math.max(this.policy.windowDurationMs, this.policy.dedupWindowMs);
      return parsed.filter((entry) => nowMs - entry.timestampMs <= maxWindow);
    } catch {
      return [];
    }
  }

  private saveEntries(entries: SubmissionLogEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  public verifySubmissionAllowed(
    input: ReservationFormInput,
    nowMs: number = Date.now()
  ): SecurityVerificationResult {
    // Layer 1A: Honeypot field check
    if (input.honeypot && input.honeypot.trim().length > 0) {
      return {
        allowed: false,
        reason: 'BOT_HONEYPOT',
        message: 'Yêu cầu không hợp lệ (Phát hiện truy cập tự động).',
      };
    }

    // Layer 1B: Minimum human fill-time check
    if (
      typeof input.formOpenedAtMs === 'number' &&
      nowMs - input.formOpenedAtMs < this.policy.minFillTimeMs
    ) {
      return {
        allowed: false,
        reason: 'BOT_TOO_FAST',
        message: 'Thao tác gửi quá nhanh. Vui lòng kiểm tra lại thông tin trước khi gửi.',
      };
    }

    const entries = this.loadEntries(nowMs);
    const idempotencyKey = buildReservationIdempotencyKey(input);

    // Layer 2: Cooldown check (30 seconds between consecutive requests)
    if (entries.length > 0) {
      const latestEntry = entries[entries.length - 1];
      const elapsedSinceLast = nowMs - latestEntry.timestampMs;
      if (elapsedSinceLast < this.policy.cooldownDurationMs) {
        const retryAfterSeconds = Math.ceil(
          (this.policy.cooldownDurationMs - elapsedSinceLast) / 1000
        );
        return {
          allowed: false,
          reason: 'COOLDOWN_ACTIVE',
          message: `Vui lòng đợi ${retryAfterSeconds} giây trước khi gửi yêu cầu tiếp theo.`,
          retryAfterSeconds,
        };
      }
    }

    // Layer 3: Idempotency / Deduplication within 10 minutes
    const duplicate = entries.find(
      (entry) =>
        entry.idempotencyKey === idempotencyKey &&
        nowMs - entry.timestampMs < this.policy.dedupWindowMs
    );
    if (duplicate) {
      return {
        allowed: false,
        reason: 'DUPLICATE_SUBMISSION',
        message:
          'Yêu cầu đặt bàn với cùng số điện thoại, chi nhánh và ngày giờ này đã được ghi nhận gần đây.',
      };
    }

    // Layer 4: Sliding-window rate limit (max 3 requests per 15 minutes)
    const entriesInWindow = entries.filter(
      (entry) => nowMs - entry.timestampMs < this.policy.windowDurationMs
    );
    if (entriesInWindow.length >= this.policy.maxRequestsPerWindow) {
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        message:
          'Bạn đã gửi tối đa 3 yêu cầu đặt bàn trong 15 phút qua. Vui lòng gọi trực tiếp Hotline 0906 67 82 83 để được hỗ trợ ngay.',
      };
    }

    return {
      allowed: true,
      idempotencyKey,
    };
  }

  public recordSuccessfulSubmission(
    idempotencyKey: string,
    nowMs: number = Date.now()
  ): void {
    const entries = this.loadEntries(nowMs);
    entries.push({ idempotencyKey, timestampMs: nowMs });
    this.saveEntries(entries);
  }
}
