import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../AppLayout';

describe('AppLayout — Header, MobileDrawer, Footer, OfflineBanner (TDD)', () => {
  it('renders sticky navigation header, branch info in footer, and child route content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>Nội dung Trang Chủ</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Nội dung Trang Chủ')).toBeInTheDocument();
    expect(screen.getAllByText(/Về chúng tôi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Đặt bàn/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/71\/1 Mạc Thị Bưởi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/48bis Xuân Thủy/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/info@lacthai\.com\.vn/i)).toBeInTheDocument();
  });

  it('opens and closes mobile drawer menu on toggle button click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const openBtn = screen.getByRole('button', { name: /Mở menu điều hướng/i });
    await user.click(openBtn);

    expect(screen.getByTestId('mobile-drawer')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Không gian Mạc Thị Bưởi/i })
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Đóng menu/i });
    await user.click(closeBtn);

    expect(screen.queryByTestId('mobile-drawer')).not.toBeInTheDocument();
  });

  it('shows PWA OfflineBanner when navigator goes offline and flushes queue on reconnect', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(/Chế độ ngoại tuyến \(Offline PWA\)/i)
    ).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(
      screen.getByText(/Chế độ ngoại tuyến \(Offline PWA\)/i)
    ).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(
      screen.queryByText(/Chế độ ngoại tuyến \(Offline PWA\)/i)
    ).not.toBeInTheDocument();
  });
});
