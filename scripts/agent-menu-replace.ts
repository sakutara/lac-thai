import { MenuOptimizationService } from '../src/services/menu-optimization.service';
import { defaultMenuService } from '../src/services/menu.service';
import { BranchId, MenuBookSection } from '../src/domain/models';

/**
 * CLI Automation Entrypoint for AI Agent Menu Replacement & Optimization (FR-10 / ADR-008)
 * Usage: npx tsx scripts/agent-menu-replace.ts --branch mac-thi-buoi --section all --images "url1,url2"
 */
export function runAgentMenuReplace(args: string[]): void {
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const branchId = (getArg('--branch') ?? 'mac-thi-buoi') as BranchId;
  const section = (getArg('--section') ?? 'all') as MenuBookSection | 'all';
  const rawUrls = (getArg('--images') ?? '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  const optimizer = new MenuOptimizationService(defaultMenuService);
  const result = optimizer.replaceBranchMenu(
    branchId,
    rawUrls.map((sourceUrlOrPath) => ({
      sourceUrlOrPath,
      section: section === 'all' ? undefined : section,
    })),
    {
      mode: section === 'all' ? 'full' : 'section',
      targetSection: section === 'all' ? undefined : section,
    }
  );

  console.log(
    JSON.stringify(
      {
        status: 'MENU_OPTIMIZED_AND_UPDATED',
        branchId: result.branchId,
        newMenuVersion: result.menuVersion,
        totalPages: result.totalPages,
        optimizationReport: result.optimizationReport,
      },
      null,
      2
    )
  );
}
