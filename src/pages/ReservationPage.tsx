import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  CheckCircle2,
  Download,
  AlertCircle,
  Sparkles,
  History,
} from 'lucide-react';
import { BRANCHES } from '../data/branches.data';
import { ReservationFormInput, ReservationRecord } from '../domain/models';
import { defaultReservationService } from '../services/reservation.service';
import { ParallaxSection } from '../components/parallax/ParallaxSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const QUICK_NOTE_TAGS = [
  'Phòng riêng VIP',
  'Bàn sân vườn thoáng mát',
  'Ghế trẻ em',
  'Trang trí sinh nhật',
  'Ít cay / Không cay',
];

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const ReservationPage: React.FC = () => {
  useDocumentMeta({
    title: 'Đặt Bàn Trực Tuyến | Nhà hàng Lạc Thái — Mạc Thị Bưởi & Xuân Thủy',
    description:
      'Đặt bàn trực tuyến tại Nhà hàng Lạc Thái Quận 1 (71/1 Mạc Thị Bưởi) và Thảo Điền (48bis Xuân Thủy). Nhận mã xác nhận #LT-xxxxxx tức thì.',
  });

  const [formLoadedAt] = useState<number>(() => Date.now() - 2500);

  const [formData, setFormData] = useState<ReservationFormInput>(() => {
    const draft = defaultReservationService.loadDraft();
    return {
      fullname: draft?.fullname ?? '',
      email: draft?.email ?? '',
      phone: draft?.phone ?? '',
      title: draft?.title ?? BRANCHES[0].reservationOptionValue,
      date: draft?.date ?? getTodayDateString(),
      time: draft?.time ?? '19:00',
      quantity: draft?.quantity ?? 4,
      message: draft?.message ?? '',
      honeypot: '',
      formOpenedAtMs: Date.now() - 2500,
    };
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRecord, setConfirmedRecord] =
    useState<ReservationRecord | null>(null);
  const [history, setHistory] = useState<ReservationRecord[]>(() =>
    defaultReservationService.getReservationHistory()
  );

  useEffect(() => {
    defaultReservationService.saveDraft(formData);
  }, [formData]);

  const activeBranch =
    BRANCHES.find((b) => b.reservationOptionValue === formData.title) ??
    BRANCHES[0];

  const handleAppendQuickNote = (tag: string) => {
    setFormData((prev) => {
      const current = (prev.message ?? '').trim();
      const nextMessage = current.includes(tag)
        ? current
        : current.length > 0
          ? `${current}, ${tag}`
          : tag;
      return { ...prev, message: nextMessage };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const record = await defaultReservationService.submitReservation({
        ...formData,
        formOpenedAtMs: formLoadedAt,
      });
      setConfirmedRecord(record);
      setHistory(defaultReservationService.getReservationHistory());
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Không thể gửi yêu cầu đặt bàn.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = (record: ReservationRecord) => {
    const blob = new Blob([record.calendarIcsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LacThai-${record.id.replace('#', '')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-0">
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/TOM_7590-HDR%20copy%20(1).jpg"
        speedFactor={0.22}
        className="py-20 border-b border-[#D4AF37]/25"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#123528]/90 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Table Reservation
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-bold text-[#FAF6F0]">
            Đặt Bàn Trực Tuyến
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-[#FAF6F0]/85">
            Đặt chỗ trước để Nhà hàng Lạc Thái chuẩn bị không gian chu đáo nhất cho buổi tiệc của Quý khách.
          </p>
        </div>
      </ParallaxSection>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Booking Form */}
          <div className="lg:col-span-7 rounded-2xl border border-[#D4AF37]/30 bg-[#07140F] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#D4AF37]">
              Thông Tin Đặt Bàn
            </h2>
            <p className="mt-1 text-xs text-[#FAF6F0]/70">
               Khung giờ phục vụ: Trưa 10:00 – 14:00 | Tối 17:00 – 22:00
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#DC2626] bg-[#DC2626]/15 p-4 text-xs sm:text-sm text-[#FAF6F0]"
              >
                <AlertCircle className="h-5 w-5 text-[#DC2626] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              {/* Hidden Honeypot Anti-Bot Field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="_hp_website">Website</label>
                <input
                  id="_hp_website"
                  name="_hp_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, honeypot: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Họ và tên quý khách *
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    placeholder="Nguyễn Văn An"
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Số điện thoại *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0906678283"
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Email nhận xác nhận
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="khachhang@email.com"
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Chi nhánh nhà hàng *
                  </label>
                  <select
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value as ReservationFormInput['title'],
                      })
                    }
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  >
                    {BRANCHES.map((b) => (
                      <option
                        key={b.id}
                        value={b.reservationOptionValue}
                      >
                        {b.reservationOptionValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Ngày đặt bàn *
                  </label>
                  <div className="relative">
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Giờ dùng bữa *
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="text"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="19:00"
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                  >
                    Số lượng khách *
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={50}
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Note Tags */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-[#D4AF37] mb-1.5"
                >
                  Ghi chú yêu cầu đặc biệt
                </label>
                <div className="mb-2.5 flex flex-wrap gap-2">
                  {QUICK_NOTE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAppendQuickNote(tag)}
                      className="rounded-full border border-[#D4AF37]/35 bg-[#123528]/70 px-3 py-1 text-xs text-[#FAF6F0] hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Yêu cầu bàn gần cửa sổ, dị ứng thực phẩm, trang trí tiệc..."
                  className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#0B1F17] px-4 py-3 text-sm text-[#FAF6F0] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] py-4 text-sm font-bold text-[#07140F] shadow-xl transition hover:brightness-110 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xử lý đặt bàn...' : 'Xác nhận đặt bàn'}
              </button>
            </form>
          </div>

          {/* Dynamic Branch Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#123528]/40 p-6 space-y-4">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                Chi nhánh đang chọn
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">
                {activeBranch.name}
              </h3>
              <p className="flex items-start gap-2.5 text-xs sm:text-sm text-[#FAF6F0]/85">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{activeBranch.address}</span>
              </p>
              <p className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF6F0]/85">
                <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Hotline Lễ tân: {activeBranch.hotline}</span>
              </p>
              <p className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF6F0]/85">
                <Clock className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>{activeBranch.openingHours}</span>
              </p>

              <div className="overflow-hidden rounded-xl border border-[#D4AF37]/30 h-64">
                <iframe
                  title={`Bản đồ ${activeBranch.name}`}
                  src={activeBranch.mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Client Reservation History */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#07140F] p-6 space-y-4">
                <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#D4AF37]">
                  <History className="h-4 w-4" />
                  <span>Lịch sử đặt bàn trên thiết bị này</span>
                </h3>
                <div className="space-y-3">
                  {history.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-xl border border-[#D4AF37]/20 bg-[#0B1F17] p-3.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#D4AF37]">{rec.id}</span>
                        <span className="rounded-full bg-[#123528] px-2.5 py-0.5 text-[10px] text-[#FAF6F0]">
                          {rec.status === 'QUEUED_OFFLINE'
                            ? 'Chờ đồng bộ mạng'
                            : 'Đã gửi Lễ tân'}
                        </span>
                      </div>
                      <p className="text-[#FAF6F0] font-medium">
                        {rec.fullname} • {rec.quantity} khách
                      </p>
                      <p className="text-[#FAF6F0]/70">
                        {rec.date} lúc {rec.time} — {rec.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reservation Confirmation Modal */}
      {confirmedRecord && (
        <div
          data-testid="reservation-success-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07140F]/90 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#D4AF37] bg-[#0B1F17] p-8 text-center shadow-2xl space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#15803D]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                Phiếu Xác Nhận Đặt Bàn
              </span>
              <h3 className="mt-1 font-serif text-3xl font-bold text-[#FAF6F0]">
                {confirmedRecord.id}
              </h3>
            </div>

            <div className="rounded-xl border border-[#D4AF37]/25 bg-[#07140F] p-4 text-left text-xs sm:text-sm space-y-2 text-[#FAF6F0]/90">
              <p>
                <strong>Khách hàng:</strong> {confirmedRecord.fullname} ({confirmedRecord.phone})
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>{confirmedRecord.title}</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>
                  Ngày {confirmedRecord.date} — Lúc {confirmedRecord.time}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>{confirmedRecord.quantity} thực khách</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadIcs(confirmedRecord)}
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#07140F] transition"
              >
                <Download className="h-4 w-4" />
                <span>Tải lịch hẹn (.ics)</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedRecord(null)}
                className="rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-[#07140F]"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
