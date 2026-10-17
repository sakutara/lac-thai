import { FEATURED_MENU_ITEMS } from '../data/featured-menu.data';
import { INITIAL_BRANCH_MENUS } from '../data/branch-menus.data';
import {
  BranchId,
  BranchMenuPageItem,
  FeaturedItemCategory,
  FeaturedMenuItem,
  MenuBookSection,
} from '../domain/models';

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export class MenuService {
  private branchMenus: Record<BranchId, BranchMenuPageItem[]>;
  private menuVersions: Record<BranchId, string>;

  constructor() {
    this.branchMenus = {
      'mac-thi-buoi': [...INITIAL_BRANCH_MENUS['mac-thi-buoi']],
      'xuan-thuy': [...INITIAL_BRANCH_MENUS['xuan-thuy']],
    };
    this.menuVersions = {
      'mac-thi-buoi': 'v2026.10.17-initial',
      'xuan-thuy': 'v2026.10.17-initial',
    };
  }

  public getFeaturedItems(
    category?: FeaturedItemCategory,
    searchQuery?: string
  ): FeaturedMenuItem[] {
    let items = [...FEATURED_MENU_ITEMS];

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const normalizedQuery = removeVietnameseTones(searchQuery.trim());
      items = items.filter((item) => {
        const hayVi = removeVietnameseTones(item.nameVi);
        const hayEn = removeVietnameseTones(item.nameEnOrThai ?? '');
        const hayDesc = removeVietnameseTones(item.description ?? '');
        return (
          hayVi.includes(normalizedQuery) ||
          hayEn.includes(normalizedQuery) ||
          hayDesc.includes(normalizedQuery)
        );
      });
    }

    return items;
  }

  public getBranchMenuPages(
    branchId: BranchId,
    section: MenuBookSection | 'all' = 'all'
  ): BranchMenuPageItem[] {
    const pages = this.branchMenus[branchId] ?? [];
    if (section === 'all') {
      return [...pages];
    }
    return pages.filter((p) => p.section === section);
  }

  public setBranchMenuPages(
    branchId: BranchId,
    pages: BranchMenuPageItem[],
    version: string
  ): void {
    this.branchMenus[branchId] = [...pages];
    this.menuVersions[branchId] = version;
  }

  public getMenuVersion(branchId: BranchId): string {
    return this.menuVersions[branchId];
  }
}

export const defaultMenuService = new MenuService();
