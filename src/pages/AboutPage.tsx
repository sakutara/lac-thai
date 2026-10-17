import React from 'react';
import { Link } from 'react-router-dom';
import { Award, MapPin, Phone, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { BRAND_INFO, BRANCHES } from '../data/branches.data';
import { GALLERY_IMAGES } from '../data/galleries.data';
import { ParallaxSection, ParallaxLayer } from '../components/parallax/ParallaxSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const AboutPage: React.FC = () => {
  useDocumentMeta({
    title: 'Về Chúng Tôi | Nhà hàng Lạc Thái — Vị Thái Chuẩn Cho Người Sành',
    description:
      'Khám phá câu chuyện thương hiệu Nhà hàng Lạc Thái từ năm 1999: hơn 25 năm phục vụ ẩm thực Thái Lan chuẩn vị tại Quận 1 và Thảo Điền.',
  });

  const highlightPhotos = GALLERY_IMAGES.slice(0, 4);

  return (
    <div className="space-y-0">
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/DSC00676(1).JPG"
        speedFactor={0.24}
        showThaiLeaves
        className="py-24 border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#123528]/90 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            {BRAND_INFO.heritageBadge}
          </span>
          <h1 className="mt-5 font-serif text-4xl sm:text-6xl font-bold text-[#FAF6F0]">
            Câu Chuyện Lạc Thái
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#FAF6F0]/85">
            “{BRAND_INFO.philosophyQuote}” — {BRAND_INFO.taglineVi} ({BRAND_INFO.taglineEn})
          </p>
        </div>
      </ParallaxSection>

      {/* Main Story Content */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Tinh hoa Xứ sở Chùa Vàng
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6F0]">
              Nơi Hội Tụ Của Những Người Sành Ẩm Thực Thái
            </h2>
            {BRAND_INFO.aboutParagraphs.map((para, index) => (
              <p
                key={index}
                className="text-sm sm:text-base leading-relaxed text-[#FAF6F0]/85"
              >
                {para}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#123528]/70 p-4 flex items-start gap-3">
                <Award className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-[#D4AF37] text-sm">
                    Đầu Bếp Thái Bản Xứ
                  </h3>
                  <p className="text-xs text-[#FAF6F0]/80 mt-1">
                    Chế biến tỉ mỉ từ nguyên liệu thảo mộc tươi ngon chuẩn vị Hoàng gia.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#123528]/70 p-4 flex items-start gap-3">
                <Award className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-[#D4AF37] text-sm">
                    Kiến Trúc Nghệ Thuật
                  </h3>
                  <p className="text-xs text-[#FAF6F0]/80 mt-1">
                    Giao thoa giữa nét cổ điển Đông Dương và văn hóa Thái Lan đương đại.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ParallaxLayer
            speedFactor={-0.1}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {highlightPhotos.map((img, i) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.title}
                loading="lazy"
                className={`h-52 w-full rounded-2xl border border-[#D4AF37]/30 object-cover shadow-xl ${
                  i % 2 === 1 ? 'mt-6' : ''
                }`}
              />
            ))}
          </ParallaxLayer>
        </div>
      </section>

      {/* Two Branches Overview */}
      <section className="border-t border-[#D4AF37]/20 bg-[#07140F] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Hệ thống Nhà hàng
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#FAF6F0]">
              Hai Chi Nhánh Tại TP. Hồ Chí Minh
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="rounded-2xl border border-[#D4AF37]/25 bg-[#0B1F17] p-8 space-y-4"
              >
                <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {branch.name}
                </h3>
                <p className="flex items-start gap-2.5 text-sm text-[#FAF6F0]/85">
                  <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-1" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center gap-2.5 text-sm text-[#FAF6F0]/85">
                  <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>{branch.hotline}</span>
                </p>
                <p className="flex items-center gap-2.5 text-sm text-[#FAF6F0]/85">
                  <Clock className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>{branch.openingHours}</span>
                </p>

                <ul className="space-y-1.5 pt-2 text-xs text-[#FAF6F0]/75 list-disc list-inside">
                  {branch.highlights.map((hl) => (
                    <li key={hl}>{hl}</li>
                  ))}
                </ul>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link
                    to={branch.spaceRoute}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 px-5 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#07140F] transition"
                  >
                    <span>Khám phá Không gian</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to={branch.menuRoute}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#123528] px-5 py-2 text-xs font-semibold text-[#FAF6F0] hover:text-[#D4AF37] transition"
                  >
                    <span>Xem Thực đơn</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
