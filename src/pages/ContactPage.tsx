import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail, UtensilsCrossed } from 'lucide-react';
import { BRANCHES, BRAND_INFO } from '../data/branches.data';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const ContactPage: React.FC = () => {
  useDocumentMeta({
    title: 'Liên Hệ & Hệ Thống Chi Nhánh | Nhà hàng Lạc Thái',
    description:
      'Thông tin liên hệ, địa chỉ, bản đồ và hotline đặt bàn của hệ thống Nhà hàng Lạc Thái tại Quận 1 và Thảo Điền TP.HCM.',
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
          Contact & Locations
        </span>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-[#FAF6F0]">
          Liên Hệ & Hệ Thống Chi Nhánh
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#FAF6F0]/80">
          {BRAND_INFO.name} luôn sẵn sàng lắng nghe và đón tiếp Quý thực khách tại 2 chi nhánh TP. Hồ Chí Minh.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {BRANCHES.map((branch) => (
          <div
            key={branch.id}
            className="rounded-2xl border border-[#D4AF37]/30 bg-[#07140F] p-8 space-y-4 shadow-xl"
          >
            <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">
              {branch.name}
            </h2>
            <p className="flex items-start gap-2.5 text-sm text-[#FAF6F0]/90">
              <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-1" />
              <span>
                {branch.address} ({branch.legacyContactAddress})
              </span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-[#FAF6F0]/90">
              <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <a
                href={`tel:${branch.hotlineTel}`}
                className="hover:text-[#D4AF37] font-semibold"
              >
                {branch.hotline}
              </a>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-[#FAF6F0]/90">
              <Clock className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <span>{branch.openingHours}</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-[#FAF6F0]/90">
              <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <span>info@lacthai.com.vn</span>
            </p>

            <div className="h-64 overflow-hidden rounded-xl border border-[#D4AF37]/25 pt-2">
              <iframe
                title={`Bản đồ ${branch.name}`}
                src={branch.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to="/dat-ban"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-xs font-bold text-[#07140F]"
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Đặt bàn tại chi nhánh này</span>
              </Link>
              <Link
                to={branch.menuRoute}
                className="rounded-full border border-[#D4AF37]/50 px-5 py-2.5 text-xs font-semibold text-[#D4AF37]"
              >
                Xem Thực đơn
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
