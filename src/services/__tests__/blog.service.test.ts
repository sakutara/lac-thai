import { describe, it, expect, beforeEach } from 'vitest';
import { BlogService } from '../blog.service';
import {
  BlogIngestionService,
  slugifyVietnamese,
  ensureUniqueSlug,
  normalizeBlogDates,
} from '../blog-ingestion.service';

describe('BlogService & BlogIngestionService — Pagination, Detail & AI Agent Blog Standardization (TDD)', () => {
  let blogService: BlogService;
  let ingestionService: BlogIngestionService;

  beforeEach(() => {
    blogService = new BlogService();
    ingestionService = new BlogIngestionService(blogService);
  });

  it('paginates 15 initial blog posts into 3 pages (6, 6, 3)', () => {
    const page1 = blogService.getPaginatedPosts(1, 6);
    expect(page1.items).toHaveLength(6);
    expect(page1.currentPage).toBe(1);
    expect(page1.totalPages).toBe(3);
    expect(page1.totalItems).toBe(15);
    expect(page1.hasPreviousPage).toBe(false);
    expect(page1.hasNextPage).toBe(true);

    const page2 = blogService.getPaginatedPosts(2, 6);
    expect(page2.items).toHaveLength(6);
    expect(page2.hasPreviousPage).toBe(true);
    expect(page2.hasNextPage).toBe(true);

    const page3 = blogService.getPaginatedPosts(3, 6);
    expect(page3.items).toHaveLength(3);
    expect(page3.hasPreviousPage).toBe(true);
    expect(page3.hasNextPage).toBe(false);
  });

  it('clamps out-of-range page numbers and filters posts by search query', () => {
    const clampLow = blogService.getPaginatedPosts(-5, 6);
    expect(clampLow.currentPage).toBe(1);

    const clampHigh = blogService.getPaginatedPosts(99, 6);
    expect(clampHigh.currentPage).toBe(3);

    const searchSongkran = blogService.getPaginatedPosts(1, 6, 'Songkran');
    expect(searchSongkran.totalItems).toBeGreaterThanOrEqual(2);

    const emptySearch = blogService.getPaginatedPosts(
      1,
      6,
      'khong-co-bai-viet-nay-xyz'
    );
    expect(emptySearch.items).toHaveLength(0);
    expect(emptySearch.totalPages).toBe(1);
  });

  it('finds post by slug and retrieves related posts excluding the current post', () => {
    const slug = 'nha-hang-lac-thai-huong-vi-chuan-thai-giua-long-thao-dien';
    const post = blogService.getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post?.title).toContain('Thảo Điền');

    expect(blogService.getPostBySlug('slug-khong-ton-tai')).toBeNull();

    const related = blogService.getRelatedPosts(slug, 5);
    expect(related).toHaveLength(5);
    expect(related.every((p) => p.slug !== slug)).toBe(true);
  });

  it('slugifies Vietnamese titles accurately, normalizes dates, and ensures unique slugs', () => {
    const slug = slugifyVietnamese(
      'Đêm Tiệc Hoàng Gia Thái Lan & Ưu Đãi 20% Tại Thảo Điền!'
    );
    expect(slug).toBe('dem-tiec-hoang-gia-thai-lan-uu-dai-20-tai-thao-dien');

    const unique1 = ensureUniqueSlug('bai-viet-moi', ['bai-viet-moi']);
    expect(unique1).toBe('bai-viet-moi-2');

    const unique2 = ensureUniqueSlug('bai-viet-moi', [
      'bai-viet-moi',
      'bai-viet-moi-2',
    ]);
    expect(unique2).toBe('bai-viet-moi-3');

    expect(normalizeBlogDates('25/12/2026')).toEqual({
      publishedDate: '25/12/2026',
      publishedIso: '2026-12-25',
    });
    expect(normalizeBlogDates('2026-12-31')).toEqual({
      publishedDate: '31/12/2026',
      publishedIso: '2026-12-31',
    });
  });

  it('standardizes raw blog draft (Markdown headings, images, paragraphs, auto excerpt, date & SEO meta) and publishes it for AI Agent', () => {
    const rawDraft = {
      title: 'Khám Phá Thực Đơn Mùa Lễ Hội Cuối Năm Tại Lạc Thái 2026',
      rawContent: `## Tinh hoa ẩm thực mùa lễ hội

Mùa lễ hội cuối năm tại Sài Gòn thêm phần ấm áp với bộ thực đơn đặc biệt từ bếp trưởng Thái Lan tại Nhà hàng Lạc Thái, kết hợp nguyên liệu thảo mộc tươi ngon và phong cách trình bày sang trọng bậc nhất giữa lòng thành phố Hồ Chí Minh sôi động và náo nhiệt.

![](https://lacthai.vn/www/uploads/images/TOM_7569-HDR%20copy(1).jpg)

Hãy đặt bàn sớm tại chi nhánh Mạc Thị Bưởi hoặc Xuân Thủy để tận hưởng không gian tuyệt vời bên người thân.`,
    };

    const createdPost = ingestionService.ingestNewBlogPost(
      rawDraft,
      new Date('2026-10-17T12:00:00Z')
    );

    expect(createdPost.slug).toBe(
      'kham-pha-thuc-don-mua-le-hoi-cuoi-nam-tai-lac-thai-2026'
    );
    expect(createdPost.publishedDate).toBe('17/10/2026');
    expect(createdPost.publishedIso).toBe('2026-10-17');
    expect(createdPost.excerpt.endsWith('...')).toBe(true);
    expect(createdPost.relatedKeywords.length).toBeGreaterThanOrEqual(3);
    expect(createdPost.thumbnailMeta?.aspectRatio).toBe('16:9');
    expect(createdPost.contentParagraphs).toHaveLength(4);
    expect(createdPost.contentParagraphs[0].type).toBe('heading');
    expect(createdPost.contentParagraphs[2].type).toBe('image');

    // Also test custom slug, custom excerpt, custom thumbnailUrl, custom relatedKeywords, and short title validation
    const customPost = ingestionService.ingestNewBlogPost({
      title: 'Tiệc Tất Niên Lạc Thái',
      slug: 'tiec-tat-nien-custom',
      publishedDate: '20/12/2026',
      excerpt: 'Tóm tắt tùy chỉnh ngắn gọn.',
      thumbnailUrl: 'https://lacthai.vn/www/uploads/images/56.jpg',
      relatedKeywords: ['Tất niên', 'Lạc Thái Q1'],
      rawContent: 'Đoạn văn ngắn.',
    });
    expect(customPost.slug).toBe('tiec-tat-nien-custom');
    expect(customPost.excerpt).toBe('Tóm tắt tùy chỉnh ngắn gọn.');
    expect(customPost.relatedKeywords).toEqual(['Tất niên', 'Lạc Thái Q1']);

    expect(() =>
      ingestionService.standardizeBlogDraft({
        title: 'A',
        rawContent: 'Ngắn',
      })
    ).toThrow(/ít nhất 3 ký tự/);
  });
});
