import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../AppRouter';
import { App } from '../../App';

describe('AppRouter & App — Full SPA Route Table Verification (TDD)', () => {
  it('renders root App component with BrowserRouter at default / route', () => {
    render(<App />);
    expect(
      screen.getAllByText(/Vị Thái chuẩn cho người sành/i).length
    ).toBeGreaterThan(0);
  });

  const routesToVerify: Array<{ path: string; expectedText: RegExp }> = [
    { path: '/', expectedText: /Vị Thái chuẩn cho người sành/i },
    { path: '/ve-chung-toi', expectedText: /Câu Chuyện Lạc Thái/i },
    { path: '/thuc-don', expectedText: /Thực Đơn Nhà Hàng Lạc Thái/i },
    {
      path: '/thuc-don-lac-thai-mac-thi-buoi',
      expectedText: /Thực đơn Chi nhánh Mạc Thị Bưởi - HCM/i,
    },
    {
      path: '/thuc-don-lac-thai-xuan-thuy',
      expectedText: /Thực đơn Chi nhánh Xuân Thuỷ - HCM/i,
    },
    {
      path: '/khong-gian-lac-thai-mac-thi-buoi',
      expectedText: /Không gian Chi nhánh Mạc Thị Bưởi - HCM/i,
    },
    {
      path: '/khong-gian-lac-thai-xuan-thuy-thao-dien',
      expectedText: /Không gian Chi nhánh Xuân Thuỷ - HCM/i,
    },
    { path: '/dat-ban', expectedText: /Đặt Bàn Trực Tuyến/i },
    { path: '/blog', expectedText: /Blog & Cẩm Nang Ẩm Thực Thái/i },
    {
      path: '/tin-tuc/nha-hang-thai-nao-co-khong-khi-le-hoi-songkran-tot-nhat-o-sai-gon',
      expectedText: /Nhà hàng Thái nào có không khí lễ hội Songkran tốt nhất ở Sài Gòn/i,
    },
    { path: '/lien-he', expectedText: /Liên Hệ & Hệ Thống Chi Nhánh/i },
    { path: '/chinh-sach', expectedText: /Chính Sách Bảo Mật/i },
    { path: '/quy-dinh', expectedText: /Quy Định Chung/i },
    { path: '/duong-dan-khong-ton-tai', expectedText: /404/i },
  ];

  it.each(routesToVerify)(
    'renders route $path accurately inside AppLayout',
    ({ path, expectedText }) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      );

      expect(screen.getAllByText(expectedText).length).toBeGreaterThan(0);
    }
  );
});
