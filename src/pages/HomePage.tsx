import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  ArrowRight,
  Utensils,
  Wine,
  MapPin,
  Calendar,
} from 'lucide-react';
import { BRAND_INFO, BRANCHES } from '../data/branches.data';
import { defaultMenuService } from '../services/menu.service';
import { defaultBlogService } from '../services/blog.service';
import { GALLERY_IMAGES } from '../data/galleries.data';
import { FeaturedItemCategory } from '../domain/models';
import {
  ParallaxSection,
  ParallaxLayer,
  ParallaxTiltCard,
} from '../components/parallax/ParallaxSection';
import { useLightbox } from '../hooks/useLightbox';
import { LightboxModal } from '../components/common/LightboxModal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const HomePage: React.FC = () => {
  useDocumentMeta({
    title: 'Nhà hàng Lạc Thái | Vị Thái Chuẩn Cho Người Sành - Ẩm Thực Thái Lan Từ 1999',
    description:
      'Nhà hàng Lạc Thái phục vụ ẩm thực Thái Lan chính thống tại TP.HCM. Khám phá thực đơn đặc sắc và đặt bàn trực tuyến tại Quận 1 & Thảo Điền.',
  });

  const [activeCategory, setActiveCategory] =
    useState<FeaturedItemCategory>('signature');
  const featuredItems = defaultMenuService.getFeaturedItems(activeCategory);
  const latestPosts = defaultBlogService.getPaginatedPosts(1, 3).items;
  const homeGalleryItems = GALLERY_IMAGES.filter(
    (img) => img.category === 'home-featured'
  );
  const lightbox = useLightbox(homeGalleryItems);

  return (
    <div className="space-y-0">
      {/* 1. Hero Multi-Layer Parallax Banner */}
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/Cover%20website.jpg"
        speedFactor={0.28}
        showThaiLeaves
        className="min-h-[82vh] flex items-center justify-center border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <ParallaxLayer speedFactor={-0.08}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#123528]/90 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {BRAND_INFO.heritageBadge}
            </span>
          </ParallaxLayer>

          <h1 className="mt-6 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF6F0]">
            {BRAND_INFO.taglineVi}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#FAF6F0]/85 leading-relaxed">
            {BRAND_INFO.heroQuoteVi} — <em className="text-[#D4AF37]">{BRAND_INFO.taglineEn}</em>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dat-ban"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] px-8 py-4 text-sm font-bold text-[#07140F] shadow-xl transition hover:scale-105"
            >
              <span>Đặt bàn ngay</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/thuc-don"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#0B1F17]/80 px-8 py-4 text-sm font-semibold text-[#D4AF37] backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-[#07140F]"
            >
              <span>Khám phá Thực đơn</span>
            </Link>
          </div>
        </div>
      </ParallaxSection>

      {/* 2. Brand Heritage & Story Split-Screen Parallax */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Di sản Ẩm thực — {BRAND_INFO.philosophyQuote}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6F0]">
              Hành trình đánh thức ngũ vị Thái Lan giữa lòng Sài Gòn
            </h2>
            {BRAND_INFO.aboutParagraphs.slice(0, 2).map((paragraph, idx) => (
              <p key={idx} className="text-sm sm:text-base leading-relaxed text-[#FAF6F0]/80">
                {paragraph}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/25 bg-[#123528]/60 p-4">
                <Award className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <span className="text-xs font-medium text-[#FAF6F0]">
                  Đầu bếp Thái bản xứ giàu kinh nghiệm
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/25 bg-[#123528]/60 p-4">
                <Award className="h-5 w-5 shrink-0 text-[#D4AF37]" />
                <span className="text-xs font-medium text-[#FAF6F0]">
                  Best Thai food in Viet Nam — Hơn 25 năm danh tiếng
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/ve-chung-toi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:underline"
              >
                <span>Tìm hiểu câu chuyện Lạc Thái</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <ParallaxLayer speedFactor={-0.1} className="grid grid-cols-2 gap-4">
            {homeGalleryItems.slice(0, 4).map((item, idx) => (
              <img
                key={item.id}
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className={`h-52 sm:h-64 w-full rounded-2xl border border-[#D4AF37]/30 object-cover shadow-xl ${
                  idx % 2 === 1 ? 'mt-6' : ''
                }`}
              />
            ))}
          </ParallaxLayer>
        </div>
      </section>

      {/* 3. Featured Menu Tabs (Món Đặc Sắc & Thức Uống) */}
      <section className="bg-[#FAF6F0] text-[#1C2420] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-[0.25em] text-[#B8332A] uppercase">
              Tinh hoa Thực đơn
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-[#0B1F17]">
              Món Ngon Đặc Sắc & Thức Uống
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#1C2420]/75">
              Sự hòa quyện tinh tế giữa vị chua thanh, cay nồng, mặn đậm đà và ngọt dịu tự nhiên.
            </p>

            {/* Category Tabs */}
            <div className="mt-8 inline-flex rounded-full border border-[#0B1F17]/15 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveCategory('signature')}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition ${
                  activeCategory === 'signature'
                    ? 'bg-[#0B1F17] text-[#D4AF37] shadow'
                    : 'text-[#1C2420]/70 hover:text-[#0B1F17]'
                }`}
              >
                <Utensils className="h-4 w-4" />
                <span>Món đặc sắc</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('drinks')}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition ${
                  activeCategory === 'drinks'
                    ? 'bg-[#0B1F17] text-[#D4AF37] shadow'
                    : 'text-[#1C2420]/70 hover:text-[#0B1F17]'
                }`}
              >
                <Wine className="h-4 w-4" />
                <span>Thức uống</span>
              </button>
            </div>
          </div>

          {/* Dish / Drink Grid with 3D Tilt Cards */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <ParallaxTiltCard
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-[#0B1F17]/10 bg-white shadow-md hover:shadow-xl"
              >
                {item.imageUrl && (
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.nameVi}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-[#0B1F17]/90 px-3.5 py-1 text-xs font-bold text-[#D4AF37]">
                      {item.priceFormatted}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {item.nameEnOrThai && (
                      <p className="text-xs font-medium text-[#B8332A]">
                        {item.nameEnOrThai}
                      </p>
                    )}
                    {!item.imageUrl && (
                      <span className="rounded-full bg-[#0B1F17] px-3 py-1 text-xs font-bold text-[#D4AF37]">
                        {item.priceFormatted}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-serif text-xl font-bold text-[#0B1F17]">
                    {item.nameVi}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#1C2420]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ParallaxTiltCard>
            ))}
          </div>

          {/* Branch Menu CTAs */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/thuc-don-lac-thai-mac-thi-buoi"
              className="rounded-full bg-[#0B1F17] px-6 py-3 text-xs sm:text-sm font-semibold text-[#D4AF37] transition hover:bg-[#123528]"
            >
              Xem 42 trang Thực đơn Quận 1
            </Link>
            <Link
              to="/thuc-don-lac-thai-xuan-thuy"
              className="rounded-full border border-[#0B1F17] px-6 py-3 text-xs sm:text-sm font-semibold text-[#0B1F17] transition hover:bg-[#0B1F17] hover:text-[#D4AF37]"
            >
              Xem 53 trang Thực đơn Thảo Điền
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Space Gallery & Two Branches */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Không gian Kiến trúc Đông Dương & Thái Lan
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#FAF6F0]">
              Hai Điểm Đến Sang Trọng Tại Sài Gòn
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {BRANCHES.map((b) => (
              <Link
                key={b.id}
                to={b.spaceRoute}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#123528] px-4 py-2 text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#07140F] transition"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{b.shortName}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeGalleryItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-testid="home-gallery-item"
              onClick={() => lightbox.openAt(index)}
              className="group relative h-72 overflow-hidden rounded-2xl border border-[#D4AF37]/25 text-left"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-transparent to-transparent flex flex-col justify-end p-5">
                <h3 className="font-serif text-lg font-semibold text-[#D4AF37]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#FAF6F0]/80">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Latest Blog & News */}
      <section className="border-t border-[#D4AF37]/20 bg-[#07140F] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Cẩm nang Ẩm thực
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#FAF6F0]">
                Tin Tức & Văn Hóa Ẩm Thực Thái
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:underline"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/tin-tuc/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0B1F17] transition hover:border-[#D4AF37]/60"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37]">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.publishedDate}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-[#FAF6F0] group-hover:text-[#D4AF37] line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#FAF6F0]/70 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37]">
                    Đọc tiếp <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LightboxModal
        isOpen={lightbox.isOpen}
        items={homeGalleryItems}
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
