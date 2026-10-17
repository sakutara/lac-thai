import React from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { LightboxItem } from '../../hooks/useLightbox';

export interface LightboxModalProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  isZoomed: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleZoom: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  items,
  currentIndex,
  isZoomed,
  onClose,
  onNext,
  onPrev,
  onToggleZoom,
}) => {
  if (!isOpen || items.length === 0) {
    return null;
  }

  const current = items[currentIndex] ?? items[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#07140F]/95 p-4 text-[#FAF6F0] backdrop-blur-md"
    >
      {/* Top Bar */}
      <div className="flex w-full max-w-6xl items-center justify-between border-b border-[#D4AF37]/20 pb-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#D4AF37]">
            {current.title}
          </h3>
          {current.caption && (
            <p className="text-xs text-[#FAF6F0]/75">{current.caption}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#D4AF37]/40 bg-[#123528] px-3 py-1 text-xs font-medium text-[#D4AF37]">
            {currentIndex + 1} / {items.length}
          </span>

          <button
            type="button"
            aria-label={isZoomed ? 'Thu nhỏ' : 'Phóng to'}
            onClick={onToggleZoom}
            className="rounded-full border border-[#D4AF37]/30 bg-[#123528]/80 p-2 text-[#FAF6F0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="rounded-full border border-[#D4AF37]/30 bg-[#123528]/80 p-2 text-[#FAF6F0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewer */}
      <div className="relative flex flex-1 w-full max-w-6xl items-center justify-center overflow-auto py-4">
        <button
          type="button"
          aria-label="Ảnh trước"
          onClick={onPrev}
          className="absolute left-2 z-20 rounded-full border border-[#D4AF37]/40 bg-[#0B1F17]/90 p-3 text-[#D4AF37] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#0B1F17]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <img
          src={current.imageUrl}
          alt={current.title}
          onClick={onToggleZoom}
          className={`max-h-[78vh] rounded-lg border border-[#D4AF37]/30 object-contain shadow-2xl transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
        />

        <button
          type="button"
          aria-label="Ảnh tiếp theo"
          onClick={onNext}
          className="absolute right-2 z-20 rounded-full border border-[#D4AF37]/40 bg-[#0B1F17]/90 p-3 text-[#D4AF37] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#0B1F17]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
