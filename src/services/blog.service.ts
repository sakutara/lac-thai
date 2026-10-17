import { INITIAL_BLOG_POSTS } from '../data/blog-posts.data';
import { BlogPost, PaginatedBlogResult } from '../domain/models';
import { removeVietnameseTones } from './menu.service';

export class BlogService {
  private posts: BlogPost[];

  constructor(initialPosts: BlogPost[] = INITIAL_BLOG_POSTS) {
    this.posts = [...initialPosts];
  }

  public getAllPosts(): BlogPost[] {
    return [...this.posts];
  }

  public prependPost(post: BlogPost): void {
    const filtered = this.posts.filter((p) => p.slug !== post.slug);
    this.posts = [post, ...filtered];
  }

  public getPaginatedPosts(
    page: number = 1,
    pageSize: number = 6,
    searchQuery?: string
  ): PaginatedBlogResult {
    let filtered = [...this.posts];

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = removeVietnameseTones(searchQuery.trim());
      filtered = filtered.filter((post) => {
        const titleNorm = removeVietnameseTones(post.title);
        const excerptNorm = removeVietnameseTones(post.excerpt);
        const kwNorm = post.relatedKeywords
          .map((k) => removeVietnameseTones(k))
          .join(' ');
        return (
          titleNorm.includes(q) || excerptNorm.includes(q) || kwNorm.includes(q)
        );
      });
    }

    const totalItems = filtered.length;
    const safePageSize = Math.max(1, pageSize);
    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

    const numericPage = Number.isFinite(page) ? Math.floor(page) : 1;
    const currentPage = Math.min(Math.max(1, numericPage), totalPages);

    const startIndex = (currentPage - 1) * safePageSize;
    const items = filtered.slice(startIndex, startIndex + safePageSize);

    return {
      items,
      currentPage,
      totalPages,
      totalItems,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }

  public getPostBySlug(slug: string): BlogPost | null {
    const cleanSlug = (slug ?? '').trim();
    return this.posts.find((p) => p.slug === cleanSlug) ?? null;
  }

  public getRelatedPosts(currentSlug: string, limit: number = 5): BlogPost[] {
    return this.posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
  }
}

export const defaultBlogService = new BlogService();
