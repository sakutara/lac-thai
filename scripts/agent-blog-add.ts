import { BlogIngestionService } from '../src/services/blog-ingestion.service';
import { defaultBlogService } from '../src/services/blog.service';

/**
 * CLI Automation Entrypoint for AI Agent Blog Publishing (FR-09 / ADR-008)
 * Usage: npx tsx scripts/agent-blog-add.ts --title "..." --content "..." --thumb "..."
 */
export function runAgentBlogAdd(args: string[]): void {
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const title = getArg('--title') ?? 'Bài viết ẩm thực mới tại Lạc Thái';
  const rawContent =
    getArg('--content') ??
    'Khám phá hương vị ẩm thực Thái Lan chuẩn vị tại Nhà hàng Lạc Thái Sài Gòn.';
  const thumbnailUrl =
    getArg('--thumb') ??
    'https://lacthai.vn/www/uploads/images/Cover%20website.jpg';

  const ingestion = new BlogIngestionService(defaultBlogService);
  const post = ingestion.ingestNewBlogPost({
    title,
    rawContent,
    thumbnailUrl,
  });

  console.log(
    JSON.stringify(
      {
        status: 'PUBLISHED_AND_STANDARDIZED',
        route: `/tin-tuc/${post.slug}`,
        post,
        standardizedCover: post.thumbnailMeta,
      },
      null,
      2
    )
  );
}
