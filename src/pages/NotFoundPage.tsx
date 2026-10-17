import React from 'react';
import { Link } from 'react-router-dom';
import { Home, UtensilsCrossed } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const NotFoundPage: React.FC = () => {
  useDocumentMeta({
    title: '404 — Không tìm thấy trang | Nhà hàng Lạc Thái',
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center space-y-6">
      <span className="font-serif text-7xl font-bold text-[#D4AF37]">404</span>
      <h1 className="font-serif text-3xl font-bold text-[#FAF6F0]">
        Trang bạn tìm kiếm không tồn tại
      </h1>
      <p className="text-sm text-[#FAF6F0]/75">
        Đường dẫn có thể đã thay đổi. Quý khách có thể quay về Trang chủ hoặc Đặt bàn trực tuyến bên dưới.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-xs font-bold text-[#07140F]"
        >
          <Home className="h-4 w-4" />
          <span>Về Trang chủ</span>
        </Link>
        <Link
          to="/dat-ban"
          className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#D4AF37]"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Đặt bàn trực tuyến</span>
        </Link>
      </div>
    </div>
  );
};
