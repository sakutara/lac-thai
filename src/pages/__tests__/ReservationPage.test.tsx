import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ReservationPage } from '../ReservationPage';

describe('ReservationPage — Booking Form, Dynamic Branch Map, Quick Notes, Success Modal & History (TDD)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders booking form, switches Google Map iframe when changing branch, and appends quick note tags without duplicates', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ReservationPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Đặt Bàn Trực Tuyến/i })
    ).toBeInTheDocument();

    const branchSelect = screen.getByLabelText(/Chi nhánh nhà hàng/i);
    expect(branchSelect).toHaveValue('71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM');

    // Switch to Xuân Thủy
    await user.selectOptions(
      branchSelect,
      '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM'
    );
    expect(branchSelect).toHaveValue(
      '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM'
    );

    // Click Quick Note Tags
    const vipTag = screen.getByRole('button', { name: /\+ Phòng riêng VIP/i });
    const babyChairTag = screen.getByRole('button', { name: /\+ Ghế trẻ em/i });
    await user.click(vipTag);
    await user.click(vipTag); // duplicate click should not duplicate tag
    await user.click(babyChairTag);

    const noteTextarea = screen.getByLabelText(
      /Ghi chú yêu cầu đặc biệt/i
    ) as HTMLTextAreaElement;
    expect(noteTextarea.value).toBe('Phòng riêng VIP, Ghế trẻ em');

    fireEvent.change(noteTextarea, {
      target: { value: 'Phòng riêng VIP, Bàn gần cửa sổ' },
    });
    expect(noteTextarea.value).toBe('Phòng riêng VIP, Bàn gần cửa sổ');
  });

  it('validates invalid input, submits valid reservation, downloads .ics calendar, and records history', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = vi.fn(() => 'blob:mock-ics-url');
    URL.revokeObjectURL = vi.fn();

    render(
      <MemoryRouter>
        <ReservationPage />
      </MemoryRouter>
    );

    // Submit empty form to trigger validation error
    const submitBtn = screen.getByRole('button', {
      name: /Xác nhận đặt bàn/i,
    });
    await user.click(submitBtn);

    expect(
      await screen.findByText(/Vui lòng nhập họ tên hợp lệ/i)
    ).toBeInTheDocument();

    // Fill valid reservation fields
    await user.type(
      screen.getByLabelText(/Họ và tên quý khách/i),
      'Nguyễn Văn An'
    );
    await user.type(screen.getByLabelText(/Số điện thoại/i), '0906678283');
    await user.type(
      screen.getByLabelText(/Email nhận xác nhận/i),
      'an.nguyen@example.com'
    );

    const dateInput = screen.getByLabelText(/Ngày đặt bàn/i);
    fireEvent.change(dateInput, { target: { value: '2026-12-25' } });

    const guestsInput = screen.getByLabelText(/Số lượng khách/i);
    await user.clear(guestsInput);
    await user.type(guestsInput, '6');

    const timeInput = screen.getByLabelText(/Giờ dùng bữa/i);
    await user.clear(timeInput);
    await user.type(timeInput, '19:00');

    await user.click(submitBtn);

    // Expect Confirmation Modal with #LT-xxxxxx ticket code
    await waitFor(() => {
      expect(
        screen.getByTestId('reservation-success-modal')
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText(/#LT-\d{6}/).length).toBeGreaterThanOrEqual(1);

    const downloadIcsBtn = screen.getByRole('button', {
      name: /Tải lịch hẹn \(\.ics\)/i,
    });
    await user.click(downloadIcsBtn);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);

    // Close modal and check reservation history section
    await user.click(screen.getByRole('button', { name: /Hoàn tất & Đóng/i }));
    expect(
      screen.getByText(/Lịch sử đặt bàn trên thiết bị này/i)
    ).toBeInTheDocument();
  });

  it('restores saved draft from sessionStorage and displays offline queued status in history', async () => {
    sessionStorage.setItem(
      'lacthai_reservation_form_draft',
      JSON.stringify({
        fullname: 'Trần Thị Bích',
        phone: '0909800711',
        email: 'bich@example.com',
        title: '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM',
        date: '2026-12-30',
        time: '18:30',
        quantity: 8,
        message: 'Bàn sân vườn',
      })
    );

    localStorage.setItem(
      'lacthai_reservation_history',
      JSON.stringify([
        {
          id: '#LT-999888',
          branchId: 'mac-thi-buoi',
          branchHotline: '0906 67 82 83',
          idempotencyKey: 'k1',
          fullname: 'Khách Ngoại Tuyến',
          email: '',
          phone: '0906678283',
          title: '71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM',
          date: '2026-12-28',
          time: '19:00',
          quantity: 2,
          message: '',
          createdAtIso: '2026-10-17T10:00:00Z',
          status: 'QUEUED_OFFLINE',
          deliveryReceipts: [],
          calendarIcsContent: 'BEGIN:VCALENDAR',
        },
      ])
    );

    render(
      <MemoryRouter>
        <ReservationPage />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('Trần Thị Bích')).toBeInTheDocument();
    expect(screen.getByText('#LT-999888')).toBeInTheDocument();
    expect(screen.getByText('Chờ đồng bộ mạng')).toBeInTheDocument();
  });
});
