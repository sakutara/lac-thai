import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Sparkles, UtensilsCrossed } from 'lucide-react';
import { BRANCHES } from '../data/branches.data';
import { GALLERY_IMAGES } from '../data/galleries.data';
import { BranchId } from '../domain/models';
import { ParallaxSection } from '../components/parallax/ParallaxSection';
import { useLightbox } from '../hooks/useLightbox';
import { LightboxModal } from '../components/common/LightboxModal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export interface BranchSpacePageProps {
  branchId: BranchId;
}

export const BranchSpacePage: React.FC<BranchSpacePageProps> = ({ branchId }) => {
  const branch =
    BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];

  const categoryKey =
    branchId === 'mac-thi-buoi' ? 'space-mac-thi-buoi' : 'space-xuan-thuy';
  const spacePhotos = GALLERY_IMAGES.filter(
    (img) => img.category === categoryKey
  );

  useDocumentMeta({
    title: `Không gian ${branch.name} | Nhà hàng Lạc Thái`,
    description: `Chiêm ngưỡng không gian kiến trúc Thái Lan sang trọng tại ${branch.name} (${branch.address}).`,
  });

  const lightbox = useLightbox(spacePhotos);

  return (
    <div className="space-y-0">
      <ParallaxSection
        backgroundImageUrl={spacePhotos[0]?.imageUrl}
        speedFactor={0.25}
        showThaiLeaves
        className="py-24 border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#123528]/90 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Kiến trúc & Không gian
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-bold text-[#FAF6F0]">
            Không gian {branch.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-[#FAF6F0]/85">
            {branch.address}
          </p>
        </div>
      </ParallaxSection>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Highlights & Branch Info Bar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-12">
          <div className="lg:col-span-2 rounded-2xl border border-[#D4AF37]/25 bg-[#123528]/50 p-6 space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#D4AF37]">
              Điểm nhấn Không gian {branch.shortName}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FAF6F0]/85 list-disc list-inside">
              {branch.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#07140F] p-6 space-y-3 text-xs sm:text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{branch.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <span>Hotline: {branch.hotline}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <span>{branch.openingHours}</span>
            </p>
            <div className="pt-3 flex flex-wrap gap-2">
              <Link
                to="/dat-ban"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#07140F]"
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Đặt bàn ngay</span>
              </Link>
              <Link
                to={branch.menuRoute}
                className="rounded-full border border-[#D4AF37]/50 px-4 py-2 text-xs font-semibold text-[#D4AF37]"
              >
                Xem Thực đơn
              </Link>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spacePhotos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              data-testid="space-gallery-card"
              onClick={() => lightbox.openAt(idx)}
              className="group relative h-72 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#07140F] text-left shadow-lg"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-transparent to-transparent flex flex-col justify-end p-5">
                <h3 className="font-serif text-base font-bold text-[#D4AF37]">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="mt-1 text-xs text-[#FAF6F0]/80 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <LightboxModal
        isOpen={lightbox.isOpen}
        items={spacePhotos}
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
