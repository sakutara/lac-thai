import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  WifiOff,
  ChevronDown,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { BRANCHES, BRAND_INFO } from '../../data/branches.data';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { defaultReservationService } from '../../services/reservation.service';
import { defaultAnalyticsService } from '../../services/analytics.service';

const MOBILE_NAV_LINKS = [
  { to: '/', label: 'Trang chủ', indent: false },
  { to: '/ve-chung-toi', label: 'Về chúng tôi', indent: false },
  { to: '/thuc-don', label: 'Thực đơn Tổng hợp', indent: false },
  {
    to: '/thuc-don-lac-thai-mac-thi-buoi',
    label: '• Thực đơn Mạc Thị Bưởi (Q.1)',
    indent: true,
  },
  {
    to: '/thuc-don-lac-thai-xuan-thuy',
    label: '• Thực đơn Xuân Thủy (Thảo Điền)',
    indent: true,
  },
  {
    to: '/khong-gian-lac-thai-mac-thi-buoi',
    label: 'Không gian Mạc Thị Bưởi',
    indent: false,
  },
  {
    to: '/khong-gian-lac-thai-xuan-thuy-thao-dien',
    label: 'Không gian Xuân Thủy',
    indent: false,
  },
  { to: '/blog', label: 'Blog & Tin tức', indent: false },
  { to: '/lien-he', label: 'Liên hệ', indent: false },
];

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    defaultAnalyticsService.trackPageView(pathname, document.title);
  }, [pathname]);
  return null;
};

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleReconnect = useCallback(() => {
    void defaultReservationService.flushOfflineQueue();
  }, []);
  const { isOnline } = useNetworkStatus(handleReconnect);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition hover:text-[#D4AF37] ${
      isActive ? 'text-[#D4AF37] font-semibold' : 'text-[#FAF6F0]/90'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F17] text-[#FAF6F0] font-sans selection:bg-[#D4AF37] selection:text-[#0B1F17]">
      <ScrollToTop />

      {/* Offline PWA Status Banner */}
      {!isOnline && (
        <div
          role="status"
          className="bg-[#D97706] text-[#07140F] px-4 py-2 text-center text-xs md:text-sm font-medium flex items-center justify-center gap-2 z-50"
        >
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>
            Chế độ ngoại tuyến (Offline PWA) — Bạn vẫn có thể xem Thực đơn, Không gian và lưu yêu cầu Đặt bàn.
          </span>
        </div>
      )}

      {/* Top Royal Info Bar */}
      <div className="hidden lg:block border-b border-[#D4AF37]/15 bg-[#07140F] text-xs text-[#FAF6F0]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              {BRAND_INFO.taglineVi} — {BRAND_INFO.heritageBadge}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
              10:00 - 14:00 | 17:00 - 22:00
            </span>
          </div>
          <div className="flex items-center gap-6">
            {BRANCHES.map((branch) => (
              <a
                key={branch.id}
                href={`tel:${branch.hotlineTel}`}
                className="flex items-center gap-1.5 hover:text-[#D4AF37] transition"
              >
                <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
                {branch.shortName}: {branch.hotline}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/20 bg-[#0B1F17]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://lacthai.vn/www/uploads/images/logo-lac-thai.png"
              alt={BRAND_INFO.name}
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-[#D4AF37] uppercase">
                Lạc Thái
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#FAF6F0]/75 uppercase">
                Royal Thai Gastronomy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <NavLink to="/" end className={navLinkClass}>
              Trang chủ
            </NavLink>

            <NavLink to="/ve-chung-toi" className={navLinkClass}>
              Về chúng tôi
            </NavLink>

            {/* Thực đơn Dropdown */}
            <div className="relative group">
              <NavLink to="/thuc-don" className={navLinkClass}>
                <span className="inline-flex items-center gap-1 py-2">
                  <span>Thực đơn</span>
                  <ChevronDown className="h-4 w-4 text-[#D4AF37]" />
                </span>
              </NavLink>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full w-64 rounded-xl border border-[#D4AF37]/30 bg-[#07140F]/95 p-2 shadow-2xl backdrop-blur-lg">
                <Link
                  to="/thuc-don"
                  className="block rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#123528] hover:text-[#D4AF37]"
                >
                  Tổng quan Thực đơn
                </Link>
                <Link
                  to="/thuc-don-lac-thai-mac-thi-buoi"
                  className="block rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#123528] hover:text-[#D4AF37]"
                >
                  Thực đơn CN Mạc Thị Bưởi (Q.1)
                </Link>
                <Link
                  to="/thuc-don-lac-thai-xuan-thuy"
                  className="block rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#123528] hover:text-[#D4AF37]"
                >
                  Thực đơn CN Xuân Thủy (Thảo Điền)
                </Link>
              </div>
            </div>

            {/* Không gian Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 py-2 text-[#FAF6F0]/90 transition hover:text-[#D4AF37]"
              >
                <span>Không gian</span>
                <ChevronDown className="h-4 w-4 text-[#D4AF37]" />
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full w-64 rounded-xl border border-[#D4AF37]/30 bg-[#07140F]/95 p-2 shadow-2xl backdrop-blur-lg">
                <Link
                  to="/khong-gian-lac-thai-mac-thi-buoi"
                  className="block rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#123528] hover:text-[#D4AF37]"
                >
                  Không gian Lạc Thái Mạc Thị Bưởi
                </Link>
                <Link
                  to="/khong-gian-lac-thai-xuan-thuy-thao-dien"
                  className="block rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#123528] hover:text-[#D4AF37]"
                >
                  Không gian Lạc Thái Xuân Thủy
                </Link>
              </div>
            </div>

            <NavLink to="/blog" className={navLinkClass}>
              Blog & Tin tức
            </NavLink>

            <NavLink to="/lien-he" className={navLinkClass}>
              Liên hệ
            </NavLink>
          </nav>

          {/* Primary CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/dat-ban"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#07140F] shadow-lg transition hover:brightness-110"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Đặt bàn</span>
            </Link>

            <button
              type="button"
              aria-label="Mở menu điều hướng"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg border border-[#D4AF37]/30 bg-[#123528] p-2 text-[#D4AF37]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            data-testid="mobile-drawer"
            className="fixed inset-0 z-50 flex flex-col bg-[#07140F]/98 p-6 lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
              <span className="font-serif text-lg font-bold text-[#D4AF37]">
                LẠC THÁI MENU
              </span>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-[#D4AF37]/30 p-2 text-[#D4AF37]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-3 text-base">
              {MOBILE_NAV_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    item.indent
                      ? 'rounded-lg pl-6 py-1.5 text-sm text-[#FAF6F0]/80 hover:text-[#D4AF37]'
                      : 'rounded-lg px-3 py-2 hover:bg-[#123528] hover:text-[#D4AF37]'
                  }
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/dat-ban"
                className="mt-4 rounded-full bg-[#D4AF37] py-3 text-center font-semibold text-[#07140F]"
              >
                Đặt bàn ngay
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Route View */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Royal Footer */}
      <footer className="border-t border-[#D4AF37]/25 bg-[#07140F] text-[#FAF6F0]/85">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div>
              <img
                src="https://lacthai.vn/www/uploads/images/logo-lac-thai.png"
                alt="Lạc Thái"
                className="h-14 w-auto object-contain mb-4"
              />
              <p className="font-serif text-lg font-semibold text-[#D4AF37]">
                {BRAND_INFO.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#FAF6F0]/75">
                {BRAND_INFO.taglineVi}. Tinh hoa ẩm thực Thái Lan chính thống tại Sài Gòn từ năm{' '}
                {BRAND_INFO.establishedYear} ({BRAND_INFO.taglineEn}).
              </p>
              <p className="mt-3 text-xs text-[#D4AF37]">
                Email: info@lacthai.com.vn
              </p>
            </div>

            {/* Branch Columns */}
            {BRANCHES.map((branch) => (
              <div key={branch.id} className="space-y-2.5 text-xs">
                <h3 className="font-serif text-base font-semibold text-[#D4AF37]">
                  {branch.name}
                </h3>
                <p className="flex items-start gap-2 text-[#FAF6F0]/85">
                  <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37] mt-0.5" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  <span>{branch.hotline}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  <span>{branch.openingHours}</span>
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    to={branch.menuRoute}
                    className="text-[#D4AF37] underline underline-offset-4 hover:text-[#FAF6F0]"
                  >
                    Xem thực đơn
                  </Link>
                  <Link
                    to={branch.spaceRoute}
                    className="text-[#D4AF37] underline underline-offset-4 hover:text-[#FAF6F0]"
                  >
                    Xem không gian
                  </Link>
                </div>
              </div>
            ))}

            {/* Quick Links & Policies */}
            <div className="space-y-2.5 text-xs">
              <h3 className="font-serif text-base font-semibold text-[#D4AF37]">
                Liên kết & Chính sách
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ve-chung-toi" className="hover:text-[#D4AF37]">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/thuc-don" className="hover:text-[#D4AF37]">
                    Thực đơn Lạc Thái
                  </Link>
                </li>
                <li>
                  <Link to="/dat-ban" className="hover:text-[#D4AF37]">
                    Đặt bàn trực tuyến
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-[#D4AF37]">
                    Blog ẩm thực Thái
                  </Link>
                </li>
                <li>
                  <Link to="/chinh-sach" className="hover:text-[#D4AF37]">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/quy-dinh" className="hover:text-[#D4AF37]">
                    Quy định chung
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-[#D4AF37]/15 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF6F0]/60">
            <p>© {new Date().getFullYear()} Nhà Hàng Lạc Thái (lacthai.vn). All rights reserved.</p>
            <p className="mt-2 sm:mt-0">
              PWA & SPA Experience — Modern Royal Thai Gastronomy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
