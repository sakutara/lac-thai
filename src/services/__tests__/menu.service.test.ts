import { describe, it, expect, beforeEach } from 'vitest';
import { MenuService } from '../menu.service';
import { MenuOptimizationService } from '../menu-optimization.service';
import { STANDARD_MENU_IMAGE_SPEC } from '../../data/branch-menus.data';

describe('MenuService & MenuOptimizationService — Multi-branch Menu & AI Agent Image Optimization (TDD)', () => {
  let menuService: MenuService;
  let menuOptService: MenuOptimizationService;

  beforeEach(() => {
    menuService = new MenuService();
    menuOptService = new MenuOptimizationService(menuService);
  });

  it('returns 6 Signature dishes and 8 Drinks on homepage featured menu', () => {
    const signatures = menuService.getFeaturedItems('signature');
    const drinks = menuService.getFeaturedItems('drinks');
    const all = menuService.getFeaturedItems();

    expect(signatures).toHaveLength(6);
    expect(drinks).toHaveLength(8);
    expect(all).toHaveLength(14);
  });

  it('searches featured menu items accent-insensitively across Vietnamese and Thai/English names', () => {
    const caTre = menuService.getFeaturedItems(undefined, 'ca tre');
    expect(caTre).toHaveLength(1);
    expect(caTre[0].nameVi).toContain('CÁ TRÊ CHIÊN XÙ');

    const somTam = menuService.getFeaturedItems(undefined, 'som tam');
    expect(somTam).toHaveLength(1);
    expect(somTam[0].nameVi).toContain('GỎI ĐU ĐỦ');
  });

  it('returns branch menu pages for Mac Thi Buoi (42 pages) and Xuan Thuy (53 pages) and filters by section', () => {
    const mtbAll = menuService.getBranchMenuPages('mac-thi-buoi', 'all');
    const mtbFood = menuService.getBranchMenuPages('mac-thi-buoi', 'food');
    const mtbDrinks = menuService.getBranchMenuPages('mac-thi-buoi', 'drinks');
    const mtbPromo = menuService.getBranchMenuPages('mac-thi-buoi', 'promo');

    expect(mtbAll).toHaveLength(42);
    expect(mtbFood).toHaveLength(36);
    expect(mtbDrinks).toHaveLength(5);
    expect(mtbPromo).toHaveLength(1);

    const xtAll = menuService.getBranchMenuPages('xuan-thuy');
    expect(xtAll).toHaveLength(53);
  });

  it('infers menu section automatically from file path or uses explicit section', () => {
    expect(menuOptService.inferMenuSection('/uploads/Drink-01.png')).toBe('drinks');
    expect(menuOptService.inferMenuSection('/uploads/Untitled-1-05.png')).toBe('drinks');
    expect(menuOptService.inferMenuSection('/uploads/image-20260330.png')).toBe('promo');
    expect(menuOptService.inferMenuSection('/uploads/Art-01.png')).toBe('food');
    expect(menuOptService.inferMenuSection('/uploads/Art-01.png', 'promo')).toBe('promo');
  });

  it('rejects menu images with source resolution too low (< 600px width)', () => {
    expect(() =>
      menuOptService.optimizeMenuPageAsset(
        {
          sourceUrlOrPath: 'https://lacthai.vn/www/uploads/new-menu-blurry.png',
          sourceWidth: 450,
          sourceHeight: 600,
        },
        1,
        'mac-thi-buoi'
      )
    ).toThrow(/Độ phân giải ảnh thực đơn quá thấp/);
  });

  it('normalizes aspect ratio (3:4), dual-tier sizes (1600x2133 & 600x800), and quality (85% WebP) with warnings when aspect ratio differs', () => {
    const { item, warning } = menuOptService.optimizeMenuPageAsset(
      {
        sourceUrlOrPath: 'https://lacthai.vn/www/uploads/wide-menu.png',
        sourceWidth: 1920,
        sourceHeight: 1080, // 16:9 instead of 3:4
      },
      1,
      'xuan-thuy'
    );

    expect(item.imageMeta).toEqual(STANDARD_MENU_IMAGE_SPEC);
    expect(item.imageMeta?.aspectRatio).toBe('3:4');
    expect(item.imageMeta?.quality).toBe(85);
    expect(item.imageMeta?.width).toBe(1600);
    expect(item.imageMeta?.thumbnailWidth).toBe(600);
    expect(warning).toContain('3:4');
  });

  it('atomically replaces full branch menu or a single section and bumps menuVersion', () => {
    const oldVersion = menuService.getMenuVersion('mac-thi-buoi');

    // Replace only drinks section for Mac Thi Buoi with 2 new optimized pages
    const result = menuOptService.replaceBranchMenu(
      'mac-thi-buoi',
      [
        { sourceUrlOrPath: 'https://lacthai.vn/www/uploads/new-drink-1.webp', sourceWidth: 1600, sourceHeight: 2133 },
        { sourceUrlOrPath: 'https://lacthai.vn/www/uploads/new-drink-2.webp', sourceWidth: 1600, sourceHeight: 2133 },
      ],
      { mode: 'section', targetSection: 'drinks' }
    );

    expect(result.menuVersion).not.toBe(oldVersion);
    expect(result.replacedSection).toBe('drinks');
    const updatedDrinks = menuService.getBranchMenuPages('mac-thi-buoi', 'drinks');
    expect(updatedDrinks).toHaveLength(2);
    // Total pages should now be 36 food + 2 drinks + 1 promo = 39
    expect(result.totalPages).toBe(39);
    // Page numbers must be sequential 1..39
    expect(result.pages.map((p) => p.pageNumber)).toEqual(
      Array.from({ length: 39 }, (_, i) => i + 1)
    );

    // Full replacement
    const fullResult = menuOptService.replaceBranchMenu(
      'xuan-thuy',
      [
        { sourceUrlOrPath: 'https://lacthai.vn/www/uploads/Art-new-1.png', section: 'food' },
        { sourceUrlOrPath: 'https://lacthai.vn/www/uploads/Drink-new-1.png', section: 'drinks' },
      ],
      { mode: 'full' }
    );
    expect(fullResult.totalPages).toBe(2);
    expect(menuService.getBranchMenuPages('xuan-thuy')).toHaveLength(2);
  });
});
