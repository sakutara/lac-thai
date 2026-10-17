import { STANDARD_MENU_IMAGE_SPEC } from '../data/branch-menus.data';
import {
  BranchId,
  BranchMenuPageItem,
  MenuBookSection,
  MenuReplacementResult,
  RawMenuReplacementInput,
} from '../domain/models';
import { defaultMenuService, MenuService } from './menu.service';

export const MIN_MENU_SOURCE_WIDTH = 600;

export class MenuOptimizationService {
  private readonly menuService: MenuService;

  constructor(menuService: MenuService = defaultMenuService) {
    this.menuService = menuService;
  }

  public inferMenuSection(
    sourceUrlOrPath: string,
    explicitSection?: MenuBookSection
  ): MenuBookSection {
    if (explicitSection) {
      return explicitSection;
    }
    const lower = sourceUrlOrPath.toLowerCase();
    if (
      lower.includes('drink') ||
      lower.includes('untitled') ||
      lower.includes('wine') ||
      lower.includes('beverage')
    ) {
      return 'drinks';
    }
    if (lower.includes('promo') || lower.includes('image-') || lower.includes('event')) {
      return 'promo';
    }
    return 'food';
  }

  public optimizeMenuPageAsset(
    input: RawMenuReplacementInput,
    pageNumber: number,
    branchId: BranchId
  ): { item: BranchMenuPageItem; warning?: string } {
    if (typeof input.sourceWidth === 'number' && input.sourceWidth < MIN_MENU_SOURCE_WIDTH) {
      throw new Error(
        `Độ phân giải ảnh thực đơn quá thấp (${input.sourceWidth}px < ${MIN_MENU_SOURCE_WIDTH}px). Vui lòng dùng ảnh sắc nét để khách đọc rõ giá và tên món.`
      );
    }

    let warning: string | undefined;
    if (
      typeof input.sourceWidth === 'number' &&
      typeof input.sourceHeight === 'number' &&
      input.sourceHeight > 0
    ) {
      const sourceRatio = input.sourceWidth / input.sourceHeight;
      const diff = Math.abs(sourceRatio - STANDARD_MENU_IMAGE_SPEC.aspectRatioNumeric);
      if (diff > 0.05) {
        warning = `Ảnh trang ${pageNumber} có tỷ lệ gốc (${sourceRatio.toFixed(
          2
        )}) khác chuẩn 3:4 (0.75). Hệ thống đã tự động căn chỉnh contain trên nền #0B1F17 về chuẩn 1600x2133px.`;
      }
    }

    const section = this.inferMenuSection(input.sourceUrlOrPath, input.section);
    const branchLabel = branchId === 'mac-thi-buoi' ? 'Mạc Thị Bưởi' : 'Xuân Thủy';
    const sectionLabel =
      section === 'food'
        ? 'Món ăn'
        : section === 'drinks'
          ? 'Thức uống'
          : 'Đặc biệt & Ưu đãi';

    const item: BranchMenuPageItem = {
      id: `${branchId}-opt-page-${pageNumber}`,
      branchId,
      pageNumber,
      section,
      title: input.title ?? `Thực đơn ${sectionLabel} ${branchLabel} - Trang ${pageNumber}`,
      imageUrl: input.sourceUrlOrPath.trim(),
      thumbnailUrl: input.sourceUrlOrPath.trim(),
      imageMeta: { ...STANDARD_MENU_IMAGE_SPEC },
    };

    return { item, warning };
  }

  public replaceBranchMenu(
    branchId: BranchId,
    rawInputs: RawMenuReplacementInput[],
    options: {
      mode?: 'full' | 'section';
      targetSection?: MenuBookSection;
    } = {}
  ): MenuReplacementResult {
    const mode = options.mode ?? 'full';
    const warnings: string[] = [];

    const optimizedNewPages = rawInputs.map((raw, idx) => {
      const effectiveInput: RawMenuReplacementInput =
        mode === 'section' && options.targetSection
          ? { ...raw, section: options.targetSection }
          : raw;
      const { item, warning } = this.optimizeMenuPageAsset(
        effectiveInput,
        idx + 1,
        branchId
      );
      if (warning) warnings.push(warning);
      return item;
    });

    let combinedPages: BranchMenuPageItem[];

    if (mode === 'section' && options.targetSection) {
      const existing = this.menuService.getBranchMenuPages(branchId, 'all');
      const foodPages =
        options.targetSection === 'food'
          ? optimizedNewPages
          : existing.filter((p) => p.section === 'food');
      const drinkPages =
        options.targetSection === 'drinks'
          ? optimizedNewPages
          : existing.filter((p) => p.section === 'drinks');
      const promoPages =
        options.targetSection === 'promo'
          ? optimizedNewPages
          : existing.filter((p) => p.section === 'promo');

      combinedPages = [...foodPages, ...drinkPages, ...promoPages];
    } else {
      combinedPages = optimizedNewPages;
    }

    // Re-index sequential page numbers 1..N
    const reindexedPages = combinedPages.map((page, idx) => ({
      ...page,
      id: `${branchId}-page-${idx + 1}`,
      pageNumber: idx + 1,
    }));

    const newVersion = `v${new Date().toISOString().slice(0, 10)}-${Date.now()}`;
    this.menuService.setBranchMenuPages(branchId, reindexedPages, newVersion);

    return {
      branchId,
      menuVersion: newVersion,
      totalPages: reindexedPages.length,
      replacedSection: mode === 'section' && options.targetSection ? options.targetSection : 'all',
      pages: reindexedPages,
      optimizationReport: {
        processedCount: rawInputs.length,
        standardSpec: { ...STANDARD_MENU_IMAGE_SPEC },
        warnings,
      },
    };
  }
}

export const defaultMenuOptimizationService = new MenuOptimizationService(
  defaultMenuService
);
