import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../AboutPage';
import { MenuHubPage } from '../MenuHubPage';
import { BranchMenuPage } from '../BranchMenuPage';

describe('AboutPage, MenuHubPage & BranchMenuPage (TDD)', () => {
  it('renders AboutPage (/ve-chung-toi) with brand story paragraphs and two branches summary', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Câu Chuyện Lạc Thái/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mê ẩm thực Thái Lan là trót mê sự hòa trộn tinh tế/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/71\/1 Mạc Thị Bưởi/i)).toBeInTheDocument();
    expect(screen.getByText(/48bis Xuân Thủy/i)).toBeInTheDocument();
  });

  it('renders MenuHubPage (/thuc-don) with category filter buttons and interactive dish search', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MenuHubPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Thực Đơn Nhà Hàng Lạc Thái/i })
    ).toBeInTheDocument();

    // Filter by Món đặc sắc, Thức uống, and Tất cả
    await user.click(screen.getByRole('button', { name: /Món đặc sắc/i }));
    expect(
      screen.getByText('CÁ TRÊ CHIÊN XÙ VÀ SỐT GỎI XOÀI')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Thức uống/i }));
    expect(screen.getByText('THAI TEA')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Tất cả$/i }));

    // Search for a dish without accents ("ca tre")
    const searchInput = screen.getByPlaceholderText(
      /Tìm món đặc sắc hoặc thức uống/i
    );
    await user.type(searchInput, 'ca tre');

    expect(
      screen.getByText('CÁ TRÊ CHIÊN XÙ VÀ SỐT GỎI XOÀI')
    ).toBeInTheDocument();
    expect(screen.queryByText('XÔI XOÀI')).not.toBeInTheDocument();
  });

  it('renders BranchMenuPage for Mạc Thị Bưởi (42 pages) and Xuân Thủy (53 pages) with section filter and Lightbox', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <MemoryRouter>
        <BranchMenuPage branchId="mac-thi-buoi" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Thực đơn Chi nhánh Mạc Thị Bưởi - HCM/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/42 trang thực đơn/i)).toBeInTheDocument();

    // Filter by "Thức uống & Tráng miệng" section
    const drinksFilterBtn = screen.getByRole('button', {
      name: /Thức uống & Tráng miệng/i,
    });
    await user.click(drinksFilterBtn);

    const foodFilterBtn = screen.getByRole('button', {
      name: /Món ăn chính/i,
    });
    await user.click(foodFilterBtn);

    const allFilterBtn = screen.getByRole('button', {
      name: /Tất cả \(42 trang\)/i,
    });
    await user.click(allFilterBtn);

    const pageCards = screen.getAllByTestId('menu-page-card');
    expect(pageCards.length).toBeGreaterThan(0);

    // Click first menu page to open Lightbox
    await user.click(pageCards[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    unmount();

    // Render Xuan Thuy (53 pages)
    render(
      <MemoryRouter>
        <BranchMenuPage branchId="xuan-thuy" />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', {
        name: /Thực đơn Chi nhánh Xuân Thuỷ - HCM/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/53 trang thực đơn/i)).toBeInTheDocument();
  });
});
