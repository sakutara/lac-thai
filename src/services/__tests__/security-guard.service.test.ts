import { describe, it, expect, beforeEach } from 'vitest';
import {
  SecurityGuardService,
  buildReservationIdempotencyKey,
} from '../security-guard.service';
import { ReservationFormInput } from '../../domain/models';

describe('SecurityGuardService — 4-Layer Anti-DoS & Bot Protection (TDD)', () => {
  let guard: SecurityGuardService;

  const baseInput: ReservationFormInput = {
    fullname: 'Trần Minh Quân',
    email: 'quan@example.com',
    phone: '0906 67 82 83',
    title: '71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM',
    date: '2026-10-25',
    time: '19:00',
    quantity: 4,
    message: '',
    honeypot: '',
    formOpenedAtMs: 1_000_000,
  };

  beforeEach(() => {
    localStorage.clear();
    guard = new SecurityGuardService();
  });

  it('builds deterministic normalized idempotency key from phone, branch, date, and time', () => {
    const key = buildReservationIdempotencyKey(baseInput);
    expect(key).toBe('0906678283|71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM|2026-10-25|19:00');
  });

  it('blocks submission immediately when honeypot field is filled (BOT_HONEYPOT)', () => {
    const res = guard.verifySubmissionAllowed(
      { ...baseInput, honeypot: 'http://spam-bot.com' },
      1_005_000
    );
    expect(res.allowed).toBe(false);
    if (!res.allowed) {
      expect(res.reason).toBe('BOT_HONEYPOT');
    }
  });

  it('blocks submission when form is submitted faster than minimum fill time (< 1500ms)', () => {
    const res = guard.verifySubmissionAllowed(
      { ...baseInput, formOpenedAtMs: 1_000_000 },
      1_000_800 // only 800ms elapsed
    );
    expect(res.allowed).toBe(false);
    if (!res.allowed) {
      expect(res.reason).toBe('BOT_TOO_FAST');
    }
  });

  it('enforces 30-second cooldown between consecutive submissions (COOLDOWN_ACTIVE)', () => {
    const firstCheck = guard.verifySubmissionAllowed(baseInput, 1_005_000);
    expect(firstCheck.allowed).toBe(true);
    if (firstCheck.allowed) {
      guard.recordSuccessfulSubmission(firstCheck.idempotencyKey, 1_005_000);
    }

    // Different reservation details 10 seconds later -> blocked by 30s cooldown
    const secondCheck = guard.verifySubmissionAllowed(
      { ...baseInput, time: '20:00' },
      1_015_000
    );
    expect(secondCheck.allowed).toBe(false);
    if (!secondCheck.allowed) {
      expect(secondCheck.reason).toBe('COOLDOWN_ACTIVE');
      expect(secondCheck.retryAfterSeconds).toBe(20);
    }
  });

  it('blocks duplicate reservation with identical idempotency key within 10 minutes (DUPLICATE_SUBMISSION)', () => {
    const firstCheck = guard.verifySubmissionAllowed(baseInput, 1_005_000);
    expect(firstCheck.allowed).toBe(true);
    if (firstCheck.allowed) {
      guard.recordSuccessfulSubmission(firstCheck.idempotencyKey, 1_005_000);
    }

    // 45 seconds later (cooldown passed, but same phone+branch+date+time within 10 mins)
    const dupCheck = guard.verifySubmissionAllowed(baseInput, 1_050_000);
    expect(dupCheck.allowed).toBe(false);
    if (!dupCheck.allowed) {
      expect(dupCheck.reason).toBe('DUPLICATE_SUBMISSION');
    }
  });

  it('enforces sliding-window rate limit of max 3 submissions per 15 minutes (RATE_LIMIT_EXCEEDED)', () => {
    const t0 = 2_000_000;
    // Submission 1 at t0
    const c1 = guard.verifySubmissionAllowed({ ...baseInput, date: '2026-10-25' }, t0);
    expect(c1.allowed).toBe(true);
    if (c1.allowed) guard.recordSuccessfulSubmission(c1.idempotencyKey, t0);

    // Submission 2 at t0 + 40s
    const c2 = guard.verifySubmissionAllowed({ ...baseInput, date: '2026-10-26' }, t0 + 40_000);
    expect(c2.allowed).toBe(true);
    if (c2.allowed) guard.recordSuccessfulSubmission(c2.idempotencyKey, t0 + 40_000);

    // Submission 3 at t0 + 80s
    const c3 = guard.verifySubmissionAllowed({ ...baseInput, date: '2026-10-27' }, t0 + 80_000);
    expect(c3.allowed).toBe(true);
    if (c3.allowed) guard.recordSuccessfulSubmission(c3.idempotencyKey, t0 + 80_000);

    // Submission 4 at t0 + 120s -> Exceeds 3 per 15 minutes
    const c4 = guard.verifySubmissionAllowed({ ...baseInput, date: '2026-10-28' }, t0 + 120_000);
    expect(c4.allowed).toBe(false);
    if (!c4.allowed) {
      expect(c4.reason).toBe('RATE_LIMIT_EXCEEDED');
    }

    // After 16 minutes (t0 + 960_000ms), window slides and allows new submission
    const c5 = guard.verifySubmissionAllowed({ ...baseInput, date: '2026-10-28' }, t0 + 960_000);
    expect(c5.allowed).toBe(true);
  });
});
