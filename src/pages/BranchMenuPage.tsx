import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ZoomIn, UtensilsCrossed } from 'lucide-react';
import { BRANCHES } from '../data/branches.data';
import { defaultMenuService } from '../services/menu.service';
import { BranchId, MenuBookSection } from '../domain/models';
import { useLightbox } from '../hooks/useLightbox';
import { LightboxModal } from '../components/common/LightboxModal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export interface BranchMenuPageProps {
  branchId: BranchId;
}

export const BranchMenuPage: React.FC<BranchMenuPageProps> = ({ branchId }) => {
  const branch =
    BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
  const allPages = defaultMenuService.getBranchMenuPages(branchId, 'all');

  const [section, setSection] = useState<MenuBookSection | 'all'>('all');
  const filteredPages = defaultMenuService.getBranchMenuPages(branchId, section);

  useDocumentMeta({
    title: `Thực đơn ${branch.name} (${allPages.length} trang) | Nhà hàng Lạc Thái`,
    description: `Xem chi tiết ${allPages.length} trang thực đơn món ăn và thức uống tại ${branch.name} (${branch.address}).`,
  });

  const lightboxItems = filteredPages.map((p) => ({
    id: p.id,
    imageUrl: p.imageUrl,
    title: `${branch.shortName} — Trang ${p.pageNumber}`,
    caption: p.title,
  }));

  const lightbox = useLightbox(lightboxItems);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      {/* Header & Branch Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-8">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <BookOpen className="h-4 w-4" />
            {allPages.length} trang thực đơn • Phiên bản {defaultMenuService.getMenuVersion(branchId)}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-[#FAF6F0]">
            Thực đơn {branch.name}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FAF6F0]/75">
            Địa chỉ: {branch.address} • Hotline: {branch.hotline}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {BRANCHES.map((b) => (
            <Link
              key={b.id}
              to={b.menuRoute}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                b.id === branchId
                  ? 'bg-[#D4AF37] text-[#07140F]'
                  : 'border border-[#D4AF37]/40 text-[#FAF6F0] hover:border-[#D4AF37]'
              }`}
            >
              {b.shortName}
            </Link>
          ))}
          <Link
            to="/dat-ban"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#B8332A] px-5 py-2 text-xs font-semibold text-[#FAF6F0] hover:brightness-110 transition"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Đặt bàn tại chi nhánh này</span>
          </Link>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSection('all')}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
              section === 'all'
                ? 'bg-[#D4AF37] text-[#07140F]'
                : 'bg-[#123528] text-[#FAF6F0]/80 hover:text-[#D4AF37]'
            }`}
          >
            Tất cả ({allPages.length} trang)
          </button>
          <button
            type="button"
            onClick={() => setSection('food')}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
              section === 'food'
                ? 'bg-[#D4AF37] text-[#07140F]'
                : 'bg-[#123528] text-[#FAF6F0]/80 hover:text-[#D4AF37]'
            }`}
          >
            Món ăn chính
          </button>
          <button
            type="button"
            onClick={() => setSection('drinks')}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
              section === 'drinks'
                ? 'bg-[#D4AF37] text-[#07140F]'
                : 'bg-[#123528] text-[#FAF6F0]/80 hover:text-[#D4AF37]'
            }`}
          >
            Thức uống & Tráng miệng
          </button>
        </div>

        <p className="text-xs text-[#FAF6F0]/65">
          Nhấn vào bất kỳ trang thực đơn nào để phóng to độ phân giải cao (Zoom HD).
        </p>
      </div>

      {/* Menu Pages Grid (3:4 ratio) */}
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {filteredPages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            data-testid="menu-page-card"
            onClick={() => lightbox.openAt(index)}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-[#07140F] text-left shadow-lg transition hover:border-[#D4AF37]"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#123528]/40">
              <img
                src={page.thumbnailUrl}
                alt={page.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#07140F]/0 group-hover:bg-[#07140F]/40 transition flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3.5 py-1.5 text-xs font-bold text-[#07140F] shadow-lg">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Xem lớn
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 text-xs">
              <span className="font-semibold text-[#D4AF37]">
                Trang {page.pageNumber}
              </span>
              <span className="text-[#FAF6F0]/60">
                {page.section === 'food' ? 'Món ăn' : 'Thức uống'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <LightboxModal
        isOpen={lightbox.isOpen}
        items={lightboxItems}
        currentIndex={lightbox.currentIndex}
        isZoomed={lightbox.isZoomed}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
        onToggleZoom={lightbox.toggleZoom}
      />
    </div>
  );
};
