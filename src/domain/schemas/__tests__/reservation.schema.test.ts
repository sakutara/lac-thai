import { describe, it, expect } from 'vitest';
import {
  validateReservationInput,
  normalizeVietnamesePhone,
} from '../reservation.schema';

describe('reservation.schema (TDD)', () => {
  const referenceDate = new Date('2026-10-17T10:00:00+07:00');

  const validPayload = {
    fullname: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    phone: '0906 67 82 83',
    title: '71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM',
    date: '2026-10-20',
    time: '19:00',
    quantity: 4,
    message: 'Bàn sân vườn thoáng mát',
  };

  it('normalizes Vietnamese phone numbers with spaces, dashes, or +84', () => {
    expect(normalizeVietnamesePhone('0906 67 82 83')).toBe('0906678283');
    expect(normalizeVietnamesePhone('+84-909-898-064')).toBe('+84909898064');
  });

  it('validates a complete valid reservation payload for both branches', () => {
    const res1 = validateReservationInput(validPayload, referenceDate);
    expect(res1.success).toBe(true);
    if (res1.success) {
      expect(res1.data.fullname).toBe('Nguyễn Văn An');
      expect(res1.data.phone).toBe('0906678283');
      expect(res1.data.quantity).toBe(4);
    }

    const res2 = validateReservationInput(
      {
        ...validPayload,
        email: '',
        title: '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM',
        quantity: '8',
      },
      referenceDate
    );
    expect(res2.success).toBe(true);
    if (res2.success) {
      expect(res2.data.quantity).toBe(8);
    }
  });

  it('rejects empty or too-short fullname', () => {
    const res = validateReservationInput({ ...validPayload, fullname: 'A' }, referenceDate);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.fieldErrors.fullname).toContain('tối thiểu 2 ký tự');
    }
  });

  it('rejects invalid email when provided, but accepts empty or omitted email', () => {
    const invalidEmail = validateReservationInput(
      { ...validPayload, email: 'not-an-email' },
      referenceDate
    );
    expect(invalidEmail.success).toBe(false);
    if (!invalidEmail.success) {
      expect(invalidEmail.fieldErrors.email).toContain('không đúng định dạng');
    }

    const undefinedEmail = validateReservationInput(
      { ...validPayload, email: undefined },
      referenceDate
    );
    expect(undefinedEmail.success).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    const res = validateReservationInput({ ...validPayload, phone: '12345' }, referenceDate);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.fieldErrors.phone).toContain('số điện thoại hợp lệ');
    }
  });

  it('rejects unknown branch title', () => {
    const res = validateReservationInput(
      { ...validPayload, title: 'Chi nhánh không tồn tại' },
      referenceDate
    );
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.fieldErrors.title).toContain('chọn chi nhánh');
    }
  });

  it('rejects past dates or malformed date strings', () => {
    const pastRes = validateReservationInput(
      { ...validPayload, date: '2026-10-16' },
      referenceDate
    );
    expect(pastRes.success).toBe(false);
    if (!pastRes.success) {
      expect(pastRes.fieldErrors.date).toContain('quá khứ');
    }

    const badDateRes = validateReservationInput(
      { ...validPayload, date: 'invalid-date' },
      referenceDate
    );
    expect(badDateRes.success).toBe(false);
  });

  it('rejects time outside opening hours (10:00 - 22:00) or malformed time', () => {
    const earlyRes = validateReservationInput({ ...validPayload, time: '08:30' }, referenceDate);
    expect(earlyRes.success).toBe(false);
    if (!earlyRes.success) {
      expect(earlyRes.fieldErrors.time).toContain('10:00 - 22:00');
    }

    const lateRes = validateReservationInput({ ...validPayload, time: '22:30' }, referenceDate);
    expect(lateRes.success).toBe(false);

    const malformedTime = validateReservationInput({ ...validPayload, time: '99:99' }, referenceDate);
    expect(malformedTime.success).toBe(false);
  });

  it('rejects quantity < 1, > 200, or non-integer', () => {
    const zeroRes = validateReservationInput({ ...validPayload, quantity: 0 }, referenceDate);
    expect(zeroRes.success).toBe(false);
    if (!zeroRes.success) {
      expect(zeroRes.fieldErrors.quantity).toContain('1 đến 200');
    }

    const tooManyRes = validateReservationInput({ ...validPayload, quantity: 250 }, referenceDate);
    expect(tooManyRes.success).toBe(false);

    const nanRes = validateReservationInput({ ...validPayload, quantity: 'abc' }, referenceDate);
    expect(nanRes.success).toBe(false);
  });

  it('rejects message longer than 500 characters', () => {
    const longMsg = 'a'.repeat(501);
    const res = validateReservationInput({ ...validPayload, message: longMsg }, referenceDate);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.fieldErrors.message).toContain('500 ký tự');
    }
  });
});
