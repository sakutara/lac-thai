import { BranchId, BranchMenuPageItem, StandardizedImageMeta } from '../domain/models';

export const STANDARD_MENU_IMAGE_SPEC: StandardizedImageMeta = {
  format: 'webp',
  quality: 85,
  aspectRatio: '3:4',
  aspectRatioNumeric: 0.75,
  width: 1600,
  height: 2133,
  thumbnailWidth: 600,
  thumbnailHeight: 800,
  fitMode: 'contain',
  backgroundHex: '#0B1F17',
};

const MAC_THI_BUOI_RAW_URLS: Array<{ url: string; section: 'food' | 'drinks' | 'promo'; title: string }> = [
  ...Array.from({ length: 36 }, (_, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const suffix = [18, 33, 34, 35, 36].includes(idx + 1) ? '(1)' : '(2)';
    return {
      url: `https://lacthai.vn/www/uploads/images/Art-${num}${suffix}.png`,
      section: 'food' as const,
      title: `Thực đơn Món ăn Mạc Thị Bưởi - Trang ${idx + 1}`,
    };
  }),
  {
    url: 'https://lacthai.vn/www/uploads/images/Drink-01(2).png',
    section: 'drinks',
    title: 'Thực đơn Thức uống Mạc Thị Bưởi - Trang 1',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/Drink-02(1).png',
    section: 'drinks',
    title: 'Thực đơn Thức uống Mạc Thị Bưởi - Trang 2',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/Drink-03(2).png',
    section: 'drinks',
    title: 'Thực đơn Thức uống Mạc Thị Bưởi - Trang 3',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/Drink-04(1).png',
    section: 'drinks',
    title: 'Thực đơn Thức uống Mạc Thị Bưởi - Trang 4',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/Drink-06(1).png',
    section: 'drinks',
    title: 'Thực đơn Thức uống Mạc Thị Bưởi - Trang 5',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/image-20260330213727-1.png',
    section: 'promo',
    title: 'Thực đơn Đặc biệt & Ưu đãi Mạc Thị Bưởi',
  },
];

const XUAN_THUY_RAW_URLS: Array<{ url: string; section: 'food' | 'drinks' | 'promo'; title: string }> = [
  ...Array.from({ length: 35 }, (_, idx) => {
    const fileNum = String(idx + 2).padStart(2, '0'); // 02..36
    return {
      url: `https://lacthai.vn/www/uploads/images/Lac%207%20Menu%2025Jul25-${fileNum}(1).png`,
      section: 'food' as const,
      title: `Thực đơn Món ăn Xuân Thủy - Trang ${idx + 1}`,
    };
  }),
  ...Array.from({ length: 16 }, (_, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const suffix = idx + 1 === 2 ? '(2)' : idx + 1 >= 15 ? '(1)' : '(3)';
    return {
      url: `https://lacthai.vn/www/uploads/images/Untitled-1-${num}${suffix}.png`,
      section: 'drinks' as const,
      title: `Thực đơn Thức uống Xuân Thủy - Trang ${idx + 1}`,
    };
  }),
  {
    url: 'https://lacthai.vn/www/uploads/images/Lac%207%20Menu%2025Jul25-37(1).png',
    section: 'food',
    title: 'Thực đơn Món ăn Xuân Thủy - Trang 36',
  },
  {
    url: 'https://lacthai.vn/www/uploads/images/image-20260330213451-1.png',
    section: 'promo',
    title: 'Thực đơn Đặc biệt & Ưu đãi Xuân Thủy',
  },
];

export const INITIAL_BRANCH_MENUS: Record<BranchId, BranchMenuPageItem[]> = {
  'mac-thi-buoi': MAC_THI_BUOI_RAW_URLS.map((entry, idx) => ({
    id: `mtb-page-${idx + 1}`,
    branchId: 'mac-thi-buoi',
    pageNumber: idx + 1,
    section: entry.section,
    title: entry.title,
    imageUrl: entry.url,
    thumbnailUrl: entry.url,
    imageMeta: { ...STANDARD_MENU_IMAGE_SPEC },
  })),
  'xuan-thuy': XUAN_THUY_RAW_URLS.map((entry, idx) => ({
    id: `xt-page-${idx + 1}`,
    branchId: 'xuan-thuy',
    pageNumber: idx + 1,
    section: entry.section,
    title: entry.title,
    imageUrl: entry.url,
    thumbnailUrl: entry.url,
    imageMeta: { ...STANDARD_MENU_IMAGE_SPEC },
  })),
};
