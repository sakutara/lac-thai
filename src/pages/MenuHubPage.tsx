import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, Utensils, Wine } from 'lucide-react';
import { BRANCHES } from '../data/branches.data';
import { defaultMenuService } from '../services/menu.service';
import { FeaturedItemCategory } from '../domain/models';
import { ParallaxSection, ParallaxTiltCard } from '../components/parallax/ParallaxSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const MenuHubPage: React.FC = () => {
  useDocumentMeta({
    title: 'Thực Đơn Nhà Hàng Lạc Thái | Mạc Thị Bưởi (Q.1) & Xuân Thủy (Thảo Điền)',
    description:
      'Khám phá các món ăn đặc sắc và trọn bộ thực đơn chi nhánh Mạc Thị Bưởi (42 trang) & Xuân Thủy Thảo Điền (53 trang) tại Nhà hàng Lạc Thái.',
  });

  const [category, setCategory] = useState<FeaturedItemCategory | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState('');

  const items = defaultMenuService.getFeaturedItems(category, searchQuery);

  return (
    <div className="space-y-0">
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/Goi%20Ca%20Tre.jpg"
        speedFactor={0.22}
        className="py-20 border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            Royal Thai Cuisine
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold text-[#FAF6F0]">
            Thực Đơn Nhà Hàng Lạc Thái
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#FAF6F0]/85">
            Thưởng thức hơn 100 mỹ vị Thái Lan chính thống tại hai chi nhánh Quận 1 và Thảo Điền.
          </p>
        </div>
      </ParallaxSection>

      {/* Branch Menu Books Selector */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {BRANCHES.map((branch) => {
            const pageCount =
              defaultMenuService.getBranchMenuPages(branch.id).length;
            return (
              <div
                key={branch.id}
                className="flex flex-col justify-between rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#123528] to-[#07140F] p-8 shadow-xl"
              >
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#0B1F17] px-3.5 py-1 text-xs font-semibold text-[#D4AF37]">
                    <BookOpen className="h-3.5 w-3.5" />
                    {pageCount} trang thực đơn chuẩn HD
                  </span>
                  <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#FAF6F0]">
                    Thực đơn {branch.name}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#FAF6F0]/75">
                    {branch.address}
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    to={branch.menuRoute}
                    className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-xs sm:text-sm font-bold text-[#07140F] transition hover:brightness-110"
                  >
                    <span>Mở cuốn Thực đơn ({pageCount} trang)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Searchable Featured Dishes & Drinks */}
      <section className="bg-[#FAF6F0] text-[#1C2420] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#0B1F17]">
                Tra Cứu Nhanh Món Đặc Sắc & Thức Uống
              </h2>
              <p className="text-xs sm:text-sm text-[#1C2420]/75 mt-1">
                Hỗ trợ tìm kiếm tiếng Việt có dấu hoặc không dấu (VD: “ca tre”, “tom yum”, “thai tea”)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-[#0B1F17]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm món đặc sắc hoặc thức uống..."
                  className="rounded-full border border-[#0B1F17]/20 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#0B1F17] focus:border-[#0B1F17] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setCategory(undefined)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === undefined
                    ? 'bg-[#0B1F17] text-[#D4AF37]'
                    : 'bg-white text-[#1C2420] border border-[#0B1F17]/15'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setCategory('signature')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === 'signature'
                    ? 'bg-[#0B1F17] text-[#D4AF37]'
                    : 'bg-white text-[#1C2420] border border-[#0B1F17]/15'
                }`}
              >
                <Utensils className="h-3.5 w-3.5" />
                Món đặc sắc
              </button>
              <button
                type="button"
                onClick={() => setCategory('drinks')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === 'drinks'
                    ? 'bg-[#0B1F17] text-[#D4AF37]'
                    : 'bg-white text-[#1C2420] border border-[#0B1F17]/15'
                }`}
              >
                <Wine className="h-3.5 w-3.5" />
                Thức uống
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ParallaxTiltCard
                key={item.id}
                className="rounded-2xl border border-[#0B1F17]/10 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {item.nameEnOrThai && (
                      <p className="text-xs font-semibold text-[#B8332A]">
                        {item.nameEnOrThai}
                      </p>
                    )}
                    <h3 className="font-serif text-lg font-bold text-[#0B1F17]">
                      {item.nameVi}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#0B1F17] px-3 py-1 text-xs font-bold text-[#D4AF37]">
                    {item.priceFormatted}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-2 text-xs text-[#1C2420]/75 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </ParallaxTiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
