import { useState, useEffect, useCallback } from 'react';

export interface LightboxItem {
  id: string;
  imageUrl: string;
  title: string;
  caption?: string;
}

export function useLightbox<T extends LightboxItem>(items: T[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsZoomed(false);
  }, []);

  const next = useCallback(() => {
    if (items.length === 0) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length === 0) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowRight') {
        next();
      } else if (event.key === 'ArrowLeft') {
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close, next, prev]);

  const currentItem = isOpen && items[currentIndex] ? items[currentIndex] : null;

  return {
    isOpen,
    currentIndex,
    currentItem,
    isZoomed,
    openAt,
    close,
    next,
    prev,
    toggleZoom,
  };
}
