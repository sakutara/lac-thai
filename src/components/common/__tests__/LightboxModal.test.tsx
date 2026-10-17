import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LightboxModal } from '../LightboxModal';

describe('LightboxModal Component (TDD)', () => {
  const items = [
    {
      id: '1',
      title: 'Gỏi Cá Trê Chiên Xù',
      caption: 'Món Signature Lạc Thái',
      imageUrl: 'https://lacthai.vn/www/uploads/images/Goi%20Ca%20Tre.jpg',
    },
    {
      id: '2',
      title: 'Pad Thai Tôm Tươi',
      imageUrl: 'https://lacthai.vn/www/uploads/images/Pad%20Thai.jpg',
    },
  ];

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <LightboxModal
        isOpen={false}
        items={items}
        currentIndex={0}
        isZoomed={false}
        onClose={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        onToggleZoom={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders current image, counter (1 / 2), triggers zoom, next, prev, close callbacks, and zoomed state', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const onToggleZoom = vi.fn();

    const { rerender } = render(
      <LightboxModal
        isOpen={true}
        items={items}
        currentIndex={0}
        isZoomed={false}
        onClose={onClose}
        onNext={onNext}
        onPrev={onPrev}
        onToggleZoom={onToggleZoom}
      />
    );

    expect(screen.getByText('Gỏi Cá Trê Chiên Xù')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Phóng to/i }));
    expect(onToggleZoom).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Ảnh tiếp theo/i }));
    expect(onNext).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Ảnh trước/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Đóng/i }));
    expect(onClose).toHaveBeenCalledTimes(1);

    // Rerender in zoomed state on item 2 (without caption)
    rerender(
      <LightboxModal
        isOpen={true}
        items={items}
        currentIndex={1}
        isZoomed={true}
        onClose={onClose}
        onNext={onNext}
        onPrev={onPrev}
        onToggleZoom={onToggleZoom}
      />
    );

    expect(
      screen.getByRole('button', { name: /Thu nhỏ/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Pad Thai Tôm Tươi')).toBeInTheDocument();
  });
});
