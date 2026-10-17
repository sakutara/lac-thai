import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, UtensilsCrossed } from 'lucide-react';
import { defaultBlogService } from '../services/blog.service';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const BlogDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = defaultBlogService.getPostBySlug(slug);

  useDocumentMeta({
    title: post
      ? `${post.title} | Blog Nhà hàng Lạc Thái`
      : 'Không tìm thấy bài viết | Nhà hàng Lạc Thái',
    description: post?.excerpt,
  });

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#D4AF37]">
          Không tìm thấy bài viết
        </h1>
        <p className="text-sm text-[#FAF6F0]/75">
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang chuyên mục khác.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-[#07140F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang Blog</span>
        </Link>
      </div>
    );
  }

  const relatedPosts = defaultBlogService.getRelatedPosts(post.slug, 5);

  return (
    <article className="mx-auto max-w-5xl px-6 py-14">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Tất cả bài viết Blog</span>
      </Link>

      <header className="mt-6 border-b border-[#D4AF37]/20 pb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D4AF37]">
          <Calendar className="h-3.5 w-3.5" />
          Ngày đăng: {post.publishedDate}
        </span>
        <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#FAF6F0]">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-[#FAF6F0]/85 leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#D4AF37]/30">
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="max-h-[480px] w-full object-cover"
        />
      </div>

      {/* Structured Article Content Blocks */}
      <div className="mt-10 space-y-6 text-sm sm:text-base leading-relaxed text-[#FAF6F0]/90">
        {post.contentParagraphs.map((block, index) => {
          if (block.type === 'heading') {
            return (
              <h2
                key={index}
                className="pt-4 font-serif text-2xl font-bold text-[#D4AF37]"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === 'image' && block.imageUrl) {
            return (
              <figure key={index} className="my-6 space-y-2">
                <img
                  src={block.imageUrl}
                  alt={block.imageAlt ?? post.title}
                  loading="lazy"
                  className="w-full rounded-xl border border-[#D4AF37]/25 object-cover"
                />
                {block.imageAlt && (
                  <figcaption className="text-center text-xs text-[#FAF6F0]/65 italic">
                    {block.imageAlt}
                  </figcaption>
                )}
              </figure>
            );
          }
          if (block.type === 'list' && block.items) {
            return (
              <ul
                key={index}
                className="list-disc list-inside space-y-2 pl-2 text-[#FAF6F0]/85"
              >
                {block.items.map((li, idx) => (
                  <li key={idx}>{li}</li>
                ))}
              </ul>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>

      {/* Related Keywords */}
      {post.relatedKeywords.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[#D4AF37]/20 pt-6">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37]">
            <Tag className="h-3.5 w-3.5" />
            Từ khóa:
          </span>
          {post.relatedKeywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full border border-[#D4AF37]/30 bg-[#123528]/50 px-3 py-1 text-xs text-[#FAF6F0]/85"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Booking CTA Box */}
      <div className="mt-12 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#123528] to-[#07140F] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">
            Trải nghiệm hương vị Thái chuẩn vị ngay hôm nay
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#FAF6F0]/80">
            Đặt bàn trực tuyến tại chi nhánh Quận 1 hoặc Thảo Điền chỉ trong 30 giây.
          </p>
        </div>
        <Link
          to="/dat-ban"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-xs sm:text-sm font-bold text-[#07140F]"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Đặt bàn ngay</span>
        </Link>
      </div>

      {/* 5 Related Posts */}
      <section className="mt-16 border-t border-[#D4AF37]/20 pt-10">
        <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">
          Bài viết liên quan
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((rel) => (
            <Link
              key={rel.id}
              to={`/tin-tuc/${rel.slug}`}
              className="group rounded-xl border border-[#D4AF37]/20 bg-[#07140F] p-4 transition hover:border-[#D4AF37]"
            >
              <span className="text-[11px] text-[#D4AF37]">
                {rel.publishedDate}
              </span>
              <h3 className="mt-1 font-serif text-sm font-bold text-[#FAF6F0] group-hover:text-[#D4AF37] line-clamp-2">
                {rel.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
