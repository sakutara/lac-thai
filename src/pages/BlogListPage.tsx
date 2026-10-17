import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { defaultBlogService } from '../services/blog.service';
import { ParallaxSection } from '../components/parallax/ParallaxSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const BlogListPage: React.FC = () => {
  useDocumentMeta({
    title: 'Blog & Cẩm Nang Ẩm Thực Thái Lan | Nhà hàng Lạc Thái',
    description:
      'Khám phá văn hóa ẩm thực Thái Lan, bí quyết gia vị thảo mộc và tin tức sự kiện mới nhất tại Nhà hàng Lạc Thái.',
  });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const paginated = defaultBlogService.getPaginatedPosts(page, 6, searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="space-y-0">
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/56.jpg"
        speedFactor={0.22}
        className="py-20 border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#123528]/90 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Thai Culinary Stories
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-bold text-[#FAF6F0]">
            Blog & Cẩm Nang Ẩm Thực Thái
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-[#FAF6F0]/85">
            Chuyện về nguyên liệu, văn hóa bàn tiệc xứ Chùa Vàng và các sự kiện đặc sắc tại Lạc Thái.
          </p>
        </div>
      </ParallaxSection>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-8">
          <p className="text-sm text-[#FAF6F0]/80">
            Hiển thị <strong>{paginated.items.length}</strong> /{' '}
            <strong>{paginated.totalItems}</strong> bài viết
          </p>

          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full rounded-full border border-[#D4AF37]/30 bg-[#07140F] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Grid (6 posts per page) */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginated.items.map((post) => (
            <Link
              key={post.id}
              to={`/tin-tuc/${post.slug}`}
              data-testid="blog-post-card"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#07140F] transition hover:border-[#D4AF37]"
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
                  <h2 className="mt-2 font-serif text-lg font-bold text-[#FAF6F0] group-hover:text-[#D4AF37] line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-xs text-[#FAF6F0]/75 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
                  Đọc chi tiết <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {paginated.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!paginated.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 px-4 py-2 text-xs font-semibold text-[#D4AF37] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Trang trước</span>
            </button>

            <span className="text-xs font-semibold text-[#FAF6F0]">
              Trang {paginated.currentPage} / {paginated.totalPages}
            </span>

            <button
              type="button"
              disabled={!paginated.hasNextPage}
              onClick={() =>
                setPage((p) => Math.min(paginated.totalPages, p + 1))
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 px-4 py-2 text-xs font-semibold text-[#D4AF37] disabled:opacity-40"
            >
              <span>Trang sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
