import { BRANCHES } from '../../data/branches.data';
import { ReservationFormInput } from '../models';

export interface ValidatedReservationData {
  fullname: string;
  email: string;
  phone: string;
  title: string;
  date: string;
  time: string;
  quantity: number;
  message: string;
}

export type ReservationValidationResult =
  | {
      success: true;
      data: ValidatedReservationData;
    }
  | {
      success: false;
      fieldErrors: Partial<Record<keyof ValidatedReservationData, string>>;
    };

export function normalizeVietnamesePhone(rawPhone: string): string {
  return rawPhone.replace(/[\s.\-()]/g, '').trim();
}

export function formatLocalDateYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateReservationInput(
  input: ReservationFormInput,
  referenceDate: Date = new Date()
): ReservationValidationResult {
  const fieldErrors: Partial<Record<keyof ValidatedReservationData, string>> = {};

  const fullname = input.fullname.trim();
  if (fullname.length < 2 || fullname.length > 100) {
    fieldErrors.fullname = 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự).';
  }

  const email = (input.email ?? '').trim();
  if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Địa chỉ email không đúng định dạng.';
  }

  const phone = normalizeVietnamesePhone(input.phone);
  if (!/^(0|\+84)[0-9]{8,10}$/.test(phone)) {
    fieldErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).';
  }

  const validBranchTitles = BRANCHES.map((b) => b.reservationOptionValue);
  const title = input.title.trim();
  if (!validBranchTitles.includes(title)) {
    fieldErrors.title = 'Vui lòng chọn chi nhánh đặt bàn.';
  }

  const date = input.date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fieldErrors.date = 'Ngày đặt bàn không hợp lệ.';
  } else {
    const todayYmd = formatLocalDateYmd(referenceDate);
    if (date < todayYmd) {
      fieldErrors.date = 'Ngày đặt bàn không được nằm trong quá khứ.';
    }
  }

  const time = input.time.trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    fieldErrors.time = 'Giờ đến không đúng định dạng (HH:mm).';
  } else if (time < '10:00' || time > '22:00') {
    fieldErrors.time = 'Vui lòng chọn giờ đến trong khung phục vụ (10:00 - 22:00).';
  }

  const parsedQty =
    typeof input.quantity === 'number'
      ? input.quantity
      : Number(input.quantity.trim());
  if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 200) {
    fieldErrors.quantity = 'Số lượng khách phải từ 1 đến 200 người.';
  }

  const message = (input.message ?? '').trim();
  if (message.length > 500) {
    fieldErrors.message = 'Ghi chú không được vượt quá 500 ký tự.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      fullname,
      email,
      phone,
      title,
      date,
      time,
      quantity: parsedQty,
      message,
    },
  };
}
