import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BlogListPage } from '../BlogListPage';
import { BlogDetailPage } from '../BlogDetailPage';
import { ContactPage } from '../ContactPage';
import { LegalPage } from '../LegalPage';
import { NotFoundPage } from '../NotFoundPage';
import { defaultBlogIngestionService } from '../../services/blog-ingestion.service';

describe('BlogListPage, BlogDetailPage, ContactPage, LegalPage & NotFoundPage (TDD)', () => {
  it('renders BlogListPage (/blog) with pagination next/prev (6 per page) and live search', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <BlogListPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Blog & Cẩm Nang Ẩm Thực Thái/i })
    ).toBeInTheDocument();

    const cardsPage1 = screen.getAllByTestId('blog-post-card');
    expect(cardsPage1.length).toBe(6);

    // Navigate to Page 2 then back to Page 1
    const nextBtn = screen.getByRole('button', { name: /Trang sau/i });
    await user.click(nextBtn);
    expect(screen.getByText(/Trang 2 \/ 3/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /Trang trước/i });
    await user.click(prevBtn);
    expect(screen.getByText(/Trang 1 \/ 3/i)).toBeInTheDocument();

    // Search for "Songkran"
    const searchInput = screen.getByPlaceholderText(/Tìm kiếm bài viết/i);
    await user.type(searchInput, 'Songkran');
    expect(screen.getAllByTestId('blog-post-card').length).toBeGreaterThan(0);
  });

  it('renders BlogDetailPage (/tin-tuc/:slug) with headings, lists, images, and fallback for unknown slug', () => {
    // Ingest a rich blog article with heading, image, and list blocks
    const richPost = defaultBlogIngestionService.ingestNewBlogPost({
      title: 'Khám phá Ngũ Vị Thái Lan tại Lạc Thái',
      rawContent: [
        { type: 'heading', text: 'Bí quyết cân bằng 5 hương vị' },
        {
          type: 'paragraph',
          text: 'Ẩm thực Thái nổi tiếng với sự kết hợp chua, cay, mặn, ngọt và đắng.',
        },
        {
          type: 'list',
          items: ['Vị chua từ chanh Thái', 'Vị cay từ ớt hiểm tươi'],
        },
        {
          type: 'image',
          imageUrl: 'https://lacthai.vn/www/uploads/images/56.jpg',
          imageAlt: 'Mâm cỗ Thái truyền thống',
        },
      ],
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={[`/tin-tuc/${richPost.slug}`]}>
        <Routes>
          <Route path="/tin-tuc/:slug" element={<BlogDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Khám phá Ngũ Vị Thái Lan tại Lạc Thái/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Bí quyết cân bằng 5 hương vị/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Vị chua từ chanh Thái/i)).toBeInTheDocument();
    expect(screen.getByText(/Bài viết liên quan/i)).toBeInTheDocument();

    unmount();

    render(
      <MemoryRouter initialEntries={['/tin-tuc/bai-viet-khong-ton-tai']}>
        <Routes>
          <Route path="/tin-tuc/:slug" element={<BlogDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Không tìm thấy bài viết/i)).toBeInTheDocument();
  });

  it('renders ContactPage (/lien-he), LegalPage (/chinh-sach & /quy-dinh), and NotFoundPage', () => {
    const { unmount } = render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: /Liên Hệ & Hệ Thống Chi Nhánh/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/71\/2 Mạc Thị Bưởi, Bến Nghé, quận 1/i)
    ).toBeInTheDocument();
    unmount();

    const { unmount: unmountPolicy } = render(
      <MemoryRouter>
        <LegalPage docType="chinh-sach" />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: /Chính Sách Bảo Mật/i })
    ).toBeInTheDocument();
    unmountPolicy();

    const { unmount: unmountTerms } = render(
      <MemoryRouter>
        <LegalPage docType="quy-dinh" />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: /Quy Định Chung/i })
    ).toBeInTheDocument();
    unmountTerms();

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
