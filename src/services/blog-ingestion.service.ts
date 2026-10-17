import {
  BlogContentBlock,
  BlogPost,
  RawBlogDraftInput,
  StandardizedImageMeta,
} from '../domain/models';
import { BlogService, defaultBlogService } from './blog.service';
import { removeVietnameseTones } from './menu.service';

export const STANDARD_BLOG_IMAGE_SPEC: StandardizedImageMeta = {
  format: 'webp',
  quality: 82,
  aspectRatio: '16:9',
  aspectRatioNumeric: 1.7778,
  width: 1200,
  height: 675,
  thumbnailWidth: 600,
  thumbnailHeight: 338,
  fitMode: 'cover',
  backgroundHex: '#0B1F17',
};

const DEFAULT_BLOG_THUMBNAIL =
  'https://lacthai.vn/www/uploads/images/TOM_7590-HDR%20copy(1).jpg';

export function slugifyVietnamese(text: string): string {
  const withoutTones = removeVietnameseTones(text.trim());
  return withoutTones
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  const slugSet = new Set(existingSlugs);
  if (!slugSet.has(baseSlug)) {
    return baseSlug;
  }
  let counter = 2;
  while (slugSet.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }
  return `${baseSlug}-${counter}`;
}

export function normalizeBlogDates(
  rawDate?: string,
  referenceDate: Date = new Date()
): { publishedDate: string; publishedIso: string } {
  if (rawDate && /^\d{2}\/\d{2}\/\d{4}$/.test(rawDate.trim())) {
    const [dd, mm, yyyy] = rawDate.trim().split('/');
    return {
      publishedDate: `${dd}/${mm}/${yyyy}`,
      publishedIso: `${yyyy}-${mm}-${dd}`,
    };
  }
  if (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim())) {
    const [yyyy, mm, dd] = rawDate.trim().split('-');
    return {
      publishedDate: `${dd}/${mm}/${yyyy}`,
      publishedIso: `${yyyy}-${mm}-${dd}`,
    };
  }

  const yyyy = String(referenceDate.getUTCFullYear());
  const mm = String(referenceDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(referenceDate.getUTCDate()).padStart(2, '0');

  return {
    publishedDate: `${dd}/${mm}/${yyyy}`,
    publishedIso: `${yyyy}-${mm}-${dd}`,
  };
}

export function parseRawBlogContent(
  rawContent: string | BlogContentBlock[],
  defaultTitle: string
): BlogContentBlock[] {
  if (Array.isArray(rawContent)) {
    return rawContent.map((block) =>
      block.type === 'image'
        ? {
            ...block,
            imageAlt: block.imageAlt || defaultTitle,
            imageMeta: { ...STANDARD_BLOG_IMAGE_SPEC },
          }
        : block
    );
  }

  const chunks = rawContent
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  return chunks.map((chunk) => {
    if (/^#{1,4}\s+/.test(chunk)) {
      return {
        type: 'heading',
        text: chunk.replace(/^#{1,4}\s+/, '').trim(),
      };
    }

    const mdImgMatch = chunk.match(/^!\[([^\]]*)\]\((.+)\)$/);
    if (mdImgMatch) {
      return {
        type: 'image',
        imageAlt: mdImgMatch[1].trim() || defaultTitle,
        imageUrl: mdImgMatch[2].trim(),
        imageMeta: { ...STANDARD_BLOG_IMAGE_SPEC },
      };
    }

    return {
      type: 'paragraph',
      text: chunk,
    };
  });
}

export function buildAutoExcerpt(
  blocks: BlogContentBlock[],
  fallbackTitle: string,
  maxLength: number = 180
): string {
  const firstParagraph = blocks.find((b) => b.type === 'paragraph' && b.text)?.text;
  const source = (firstParagraph || fallbackTitle).trim();
  if (source.length <= maxLength) {
    return source;
  }
  const sliced = source.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

export class BlogIngestionService {
  private readonly blogService: BlogService;

  constructor(blogService: BlogService = defaultBlogService) {
    this.blogService = blogService;
  }

  public standardizeBlogDraft(
    draft: RawBlogDraftInput,
    existingPosts: BlogPost[] = this.blogService.getAllPosts(),
    referenceDate: Date = new Date()
  ): BlogPost {
    const cleanTitle = (draft.title ?? '').trim();
    if (cleanTitle.length < 3) {
      throw new Error('Tiêu đề bài viết Blog phải có ít nhất 3 ký tự.');
    }

    const baseSlug = draft.slug
      ? slugifyVietnamese(draft.slug)
      : slugifyVietnamese(cleanTitle);
    const existingSlugs = existingPosts.map((p) => p.slug);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);

    const { publishedDate, publishedIso } = normalizeBlogDates(
      draft.publishedDate,
      referenceDate
    );

    const contentParagraphs = parseRawBlogContent(draft.rawContent, cleanTitle);
    const excerpt = draft.excerpt?.trim()
      ? draft.excerpt.trim()
      : buildAutoExcerpt(contentParagraphs, cleanTitle);

    const firstInlineImage = contentParagraphs.find(
      (b) => b.type === 'image' && b.imageUrl
    )?.imageUrl;
    const thumbnailUrl =
      draft.thumbnailUrl?.trim() || firstInlineImage || DEFAULT_BLOG_THUMBNAIL;

    const relatedKeywords =
      draft.relatedKeywords && draft.relatedKeywords.length > 0
        ? draft.relatedKeywords.map((k) => k.trim()).filter(Boolean)
        : [
            'Nhà hàng Lạc Thái',
            'Ẩm thực Thái Lan Sài Gòn',
            'Lạc Thái Thảo Điền & Quận 1',
            cleanTitle,
          ];

    return {
      id: `post-${Date.now()}`,
      slug,
      title: cleanTitle,
      publishedDate,
      publishedIso,
      excerpt,
      thumbnailUrl,
      thumbnailMeta: { ...STANDARD_BLOG_IMAGE_SPEC },
      contentParagraphs,
      relatedKeywords,
      seoMeta: {
        metaTitle: `${cleanTitle} | Nhà hàng Lạc Thái`,
        metaDescription: excerpt,
        canonicalPath: `/tin-tuc/${slug}`,
      },
    };
  }

  public ingestNewBlogPost(
    draft: RawBlogDraftInput,
    referenceDate: Date = new Date()
  ): BlogPost {
    const post = this.standardizeBlogDraft(
      draft,
      this.blogService.getAllPosts(),
      referenceDate
    );
    this.blogService.prependPost(post);
    return post;
  }
}

export const defaultBlogIngestionService = new BlogIngestionService(
  defaultBlogService
);
