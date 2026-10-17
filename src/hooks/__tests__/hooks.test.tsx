import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLightbox } from '../useLightbox';
import { useNetworkStatus } from '../useNetworkStatus';
import { useDocumentMeta } from '../useDocumentMeta';
import { useParallax } from '../useParallax';

describe('Custom Hooks — useLightbox, useNetworkStatus, useDocumentMeta, useParallax (TDD)', () => {
  const sampleItems = [
    { id: '1', imageUrl: '/img1.jpg', title: 'Ảnh 1' },
    { id: '2', imageUrl: '/img2.jpg', title: 'Ảnh 2' },
    { id: '3', imageUrl: '/img3.jpg', title: 'Ảnh 3' },
  ];

  beforeEach(() => {
    document.title = '';
  });

  it('useLightbox opens, navigates next/prev with wrap-around, toggles zoom, and closes on Escape', () => {
    const { result } = renderHook(() => useLightbox(sampleItems));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.currentItem).toBeNull();

    act(() => {
      result.current.openAt(0);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem?.title).toBe('Ảnh 1');

    // Prev from index 0 wraps to index 2
    act(() => {
      result.current.prev();
    });
    expect(result.current.currentIndex).toBe(2);

    // Next from index 2 wraps to index 0
    act(() => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(0);

    // Toggle zoom
    act(() => {
      result.current.toggleZoom();
    });
    expect(result.current.isZoomed).toBe(true);

    // Keyboard navigation: ArrowRight -> index 1, Escape -> close
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.isZoomed).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(result.current.currentIndex).toBe(0);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('useNetworkStatus tracks online/offline events in real time', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    const onReconnect = vi.fn();
    const { result } = renderHook(() => useNetworkStatus(onReconnect));
    expect(result.current.isOnline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it('useDocumentMeta updates document.title and meta description tag dynamically', () => {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    renderHook(() =>
      useDocumentMeta({
        title: 'Thực đơn Quận 1 | Nhà hàng Lạc Thái',
        description: 'Khám phá 42 trang thực đơn Thái Lan chuẩn vị tại Quận 1.',
      })
    );

    expect(document.title).toBe('Thực đơn Quận 1 | Nhà hàng Lạc Thái');
    expect(meta.getAttribute('content')).toBe(
      'Khám phá 42 trang thực đơn Thái Lan chuẩn vị tại Quận 1.'
    );
  });

  it('useParallax computes transformStyle and updates on window scroll', () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
    });

    const { result } = renderHook(() =>
      useParallax({ speedFactor: 0.25, elementTop: 0, maxOffsetPx: 150 })
    );

    expect(result.current.transformStyle).toBe('translate3d(0px, 0px, 0px)');

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        value: 200,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.offsetY).toBe(50);
    expect(result.current.transformStyle).toBe('translate3d(0px, 50px, 0px)');
  });
});
