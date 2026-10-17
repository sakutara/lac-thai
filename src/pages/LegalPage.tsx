import React from 'react';
import { LEGAL_DOCUMENTS } from '../data/legal.data';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export interface LegalPageProps {
  docType: 'chinh-sach' | 'quy-dinh';
}

export const LegalPage: React.FC<LegalPageProps> = ({ docType }) => {
  const doc =
    docType === 'chinh-sach' ? LEGAL_DOCUMENTS.policy : LEGAL_DOCUMENTS.terms;
  const headingTitle =
    docType === 'chinh-sach' ? 'Chính Sách Bảo Mật' : 'Quy Định Chung';

  useDocumentMeta({
    title: `${headingTitle} | Nhà hàng Lạc Thái`,
    description: doc.subtitle,
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="border-b border-[#D4AF37]/20 pb-6">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          Cập nhật lần cuối: {doc.lastUpdated}
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-[#FAF6F0]">
          {headingTitle}
        </h1>
        <p className="mt-2 text-sm text-[#FAF6F0]/80">{doc.subtitle}</p>
      </header>

      <div className="space-y-6">
        {doc.sections.map((sec) => (
          <section
            key={sec.heading}
            className="rounded-2xl border border-[#D4AF37]/20 bg-[#07140F] p-6 space-y-3"
          >
            <h2 className="font-serif text-xl font-bold text-[#D4AF37]">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed text-[#FAF6F0]/85"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};
