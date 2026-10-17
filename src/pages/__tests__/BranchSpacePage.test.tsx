import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BranchSpacePage } from '../BranchSpacePage';

describe('BranchSpacePage — Mạc Thị Bưởi & Xuân Thủy Thảo Điền (TDD)', () => {
  it('renders Mạc Thị Bưởi space gallery (5 photos) and opens Lightbox on click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BranchSpacePage branchId="mac-thi-buoi" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Không gian Chi nhánh Mạc Thị Bưởi - HCM/i,
      })
    ).toBeInTheDocument();

    const photos = screen.getAllByTestId('space-gallery-card');
    expect(photos.length).toBe(5);

    await user.click(photos[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders Xuân Thủy Thảo Điền space gallery (10 HDR photos) with branch highlights', () => {
    render(
      <MemoryRouter>
        <BranchSpacePage branchId="xuan-thuy" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Không gian Chi nhánh Xuân Thuỷ - HCM/i,
      })
    ).toBeInTheDocument();

    const photos = screen.getAllByTestId('space-gallery-card');
    expect(photos.length).toBe(10);
    expect(
      screen.getByText(/sân vườn nhiệt đới lớn nhất tại Thảo Điền/i)
    ).toBeInTheDocument();
  });
});
