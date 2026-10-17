import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

describe('HomePage — Hero Parallax, Brand Story, Featured Menu Tabs, Space Gallery, Latest Blogs (TDD)', () => {
  it('renders Hero Parallax banner, brand heritage summary, and default signature dishes', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Vị Thái chuẩn cho người sành/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Make food, not war/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Best Thai food in Viet Nam/i).length
    ).toBeGreaterThan(0);

    // Default Featured Menu tab is Món Đặc Sắc (6 signature dishes)
    expect(
      screen.getByText('CÁ TRÊ CHIÊN XÙ VÀ SỐT GỎI XOÀI')
    ).toBeInTheDocument();
    expect(screen.getByText('CANH CHUA TÔM')).toBeInTheDocument();
  });

  it('switches between Món Đặc Sắc and Thức Uống tabs and opens Lightbox when clicking a gallery photo', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Click Thức Uống tab
    const drinksTab = screen.getByRole('button', { name: /Thức uống/i });
    await user.click(drinksTab);

    expect(screen.getByText('THAI TEA')).toBeInTheDocument();
    expect(screen.getByText('GIN KAFFIR TONIC')).toBeInTheDocument();

    // Switch back to Món đặc sắc tab
    const sigTab = screen.getByRole('button', { name: /Món đặc sắc/i });
    await user.click(sigTab);
    expect(
      screen.getByText('CÁ TRÊ CHIÊN XÙ VÀ SỐT GỎI XOÀI')
    ).toBeInTheDocument();

    // Click a Home Gallery photo to open LightboxModal
    const galleryButtons = screen.getAllByTestId('home-gallery-item');
    expect(galleryButtons.length).toBe(6);

    await user.click(galleryButtons[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
