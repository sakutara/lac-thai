# Specification-Driven Development (SDD) — Đặc Tả Kỹ Thuật Chi Tiết

- **Mã tài liệu:** `DOC-SDD-LACTHAI`
- **Phiên bản:** `1.3.0` (Đồng bộ với `BR v1.3.0` & `SA v1.3.0`)
- **Ngày cập nhật:** `2026-10-17`
- **Mục đích:** Định nghĩa đầy đủ các kiểu dữ liệu (Data Contracts), thuật toán Parallax, cơ chế bảo vệ chống DoS/Spam, **công cụ gửi & nơi nhận kết quả Đặt bàn (`ReservationTransportService`)**, pipeline tự động hóa Blog & Menu cho AI Agent, và đặc tả kiểm thử (Test Specifications) trước khi viết bất kỳ dòng code nào.

---

## 1. Đặc Tả Mô Hình Dữ Liệu (Domain Models & Data Contracts)

### 1.1. Mô hình Chi Nhánh (`Branch`)
```typescript
export type BranchId = 'mac-thi-buoi' | 'xuan-thuy';

export interface Branch {
  id: BranchId;
  name: string;                  // VD: "Chi nhánh Mạc Thị Bưởi - HCM"
  shortName: string;             // VD: "Mạc Thị Bưởi (Quận 1)"
  address: string;               // VD: "71/1 Mạc Thị Bưởi, Phường Bến Nghé, Quận 1, TP.HCM"
  legacyContactAddress: string;  // VD: "71/2 Mạc Thị Bưởi, Bến Nghé, quận 1"
  reservationOptionValue: string;// Giá trị khớp hoàn toàn form cũ: "71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM"
  hotline: string;               // VD: "0906 67 82 83"
  hotlineTel: string;            // VD: "0906678283"
  openingHours: string;          // VD: "10:00 - 22:00 (Thứ Hai - Chủ Nhật)"
  mapEmbedUrl: string;           // URL Google Maps Embed
  menuRoute: string;             // VD: "/thuc-don-lac-thai-mac-thi-buoi"
  spaceRoute: string;            // VD: "/khong-gian-lac-thai-mac-thi-buoi"
  highlights: string[];          // Đặc trưng không gian của chi nhánh
}
```

### 1.2. Mô hình Thực Đơn & Thông Số Chuẩn Hóa Ảnh Menu (`BranchMenuPageItem` & `StandardizedImageMeta`)
```typescript
export type FeaturedItemCategory = 'signature' | 'drinks';

export interface FeaturedMenuItem {
  id: string;
  category: FeaturedItemCategory;
  nameVi: string;                // VD: "CÁ TRÊ CHIÊN XÙ VÀ SỐT GỎI XOÀI"
  nameEnOrThai?: string;         // VD: "Yam Plaa Dook Foo"
  priceVnd: number;              // VD: 220000
  priceFormatted: string;        // VD: "220.000 đ"
  description?: string;
  imageUrl?: string;
  isSpicy?: boolean;
  isBestSeller?: boolean;
}

export type MenuBookSection = 'food' | 'drinks' | 'promo';

export interface StandardizedImageMeta {
  format: 'webp' | 'jpeg' | 'png';
  quality: number;               // Chuẩn: 85 cho Menu, 82 cho Blog
  aspectRatio: '3:4' | '16:9' | '4:3';
  aspectRatioNumeric: number;    // Chuẩn Menu: 0.75 (3:4), Chuẩn Blog: 1.7778 (16:9)
  width: number;                 // Chuẩn Menu Zoom: 1600px
  height: number;                // Chuẩn Menu Zoom: 2133px
  thumbnailWidth: number;        // Chuẩn Menu Grid: 600px
  thumbnailHeight: number;       // Chuẩn Menu Grid: 800px
  fitMode: 'contain' | 'cover';
  backgroundHex: string;         // Nền bù viền chuẩn: "#0B1F17"
}

export interface BranchMenuPageItem {
  id: string;
  branchId: BranchId;
  pageNumber: number;
  section: MenuBookSection;
  title: string;                 // VD: "Thực đơn Món ăn - Trang 1"
  imageUrl: string;              // URL ảnh chất lượng cao đã chuẩn hóa
  thumbnailUrl?: string;         // URL ảnh thu nhỏ cho chế độ xem lưới
  imageMeta?: StandardizedImageMeta;
}
```

### 1.3. Mô hình Chuẩn Hóa & Đăng Bài Blog Mới (`RawBlogDraftInput` & `BlogPost`)
```typescript
export interface BlogContentBlock {
  type: 'paragraph' | 'image' | 'heading';
  text?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageMeta?: StandardizedImageMeta;
}

export interface BlogPost {
  id: string;
  slug: string;                  // VD: "nha-hang-lac-thai-huong-vi-chuan-thai-giua-long-thao-dien"
  title: string;
  publishedDate: string;         // Định dạng hiển thị chuẩn Lạc Thái: "DD/MM/YYYY"
  publishedIso: string;          // Định dạng chuẩn sắp xếp: "YYYY-MM-DD"
  excerpt: string;               // Đoạn trích chuẩn 140-200 ký tự
  thumbnailUrl: string;
  thumbnailMeta?: StandardizedImageMeta;
  contentParagraphs: BlogContentBlock[];
  relatedKeywords: string[];
  seoMeta?: {
    metaTitle: string;
    metaDescription: string;
    canonicalPath: string;       // VD: "/tin-tuc/<slug>"
  };
}
```

### 1.4. Mô hình Cấu Hình Parallax (`ParallaxLayerConfig` & `Tilt3DValues`)
```typescript
export interface ParallaxLayerConfig {
  speedFactor: number;           // Hệ số tốc độ (-1.0 đến 1.0)
  maxOffsetPx?: number;          // Biên độ dịch chuyển tối đa (mặc định: 180px)
  direction?: 'vertical' | 'horizontal';
  reducedMotion?: boolean;       // Nếu true, luôn trả về offset = 0
}
```

### 1.5. Mô hình Đặt Bàn, Công Cụ Gửi & Nơi Nhận Kết Quả (`ReservationRecord` & `ReservationDeliveryReceipt`)
```typescript
export interface ReservationFormInput {
  fullname: string;              // ContactForm[fullname] - Bắt buộc (2..100 ký tự)
  email?: string;                // ContactForm[email] - Tùy chọn (Email xác nhận cho khách)
  phone: string;                 // ContactForm[phone] - Bắt buộc (SĐT Việt Nam)
  title: string;                 // ContactForm[title] (Chi nhánh) - Bắt buộc
  date: string;                  // ContactForm[date] (YYYY-MM-DD) - Bắt buộc
  time: string;                  // ContactForm[time] (HH:mm, 10:00..22:00) - Bắt buộc
  quantity: number | string;     // ContactForm[quantity] (1..200) - Bắt buộc
  message?: string;              // ContactForm[message] (Ghi chú) - Tùy chọn (<=500 ký tự)
  honeypot?: string;             // Trường ẩn _hp_website chống bot
  formOpenedAtMs?: number;       // Timestamp mở form chống script gửi tức thì
}

export type ReservationDeliveryChannel =
  | 'WEBHOOK_JSON'               // Gửi JSON tới Webhook (Google Sheets / Serverless / n8n / Make)
  | 'EMAIL_RELAY'                // Gửi tới Email Nhà hàng & Email Thực khách
  | 'CHAT_NOTIFICATION'          // Báo tin nhắn tức thì cho Lễ tân (Telegram / Zalo Webhook)
  | 'LEGACY_FORM_POST';          // Gửi FormData ContactForm[...] tới POST /dat-ban

export interface ReservationDeliveryReceipt {
  channel: ReservationDeliveryChannel;
  delivered: boolean;
  recipientLabel: string;        // VD: "Sổ Đặt Bàn Google Sheets & Email Lễ Tân CN Mạc Thị Bưởi"
  timestampIso: string;
  errorMessage?: string;
}

export type ReservationSyncStatus = 'SUBMITTED_ONLINE' | 'QUEUED_OFFLINE' | 'SYNCED_FROM_OFFLINE';

export interface ReservationRecord extends Omit<ReservationFormInput, 'honeypot' | 'formOpenedAtMs'> {
  id: string;                    // Mã đặt bàn duy nhất: VD "#LT-849201"
  branchId: BranchId;            // 'mac-thi-buoi' | 'xuan-thuy'
  branchHotline: string;         // Hotline chi nhánh tương ứng
  idempotencyKey: string;        // Khóa chống gửi trùng: phone|branch|date|time
  quantity: number;
  createdAtIso: string;
  status: ReservationSyncStatus;
  deliveryReceipts: ReservationDeliveryReceipt[];
  calendarIcsContent: string;    // Nội dung file lịch .ics để khách lưu vào điện thoại
}
```

---

## 2. Đặc Tả Các Dịch Vụ Nghiệp Vụ (`v1.3.0`)

### 2.1. `BlogIngestionService` (`src/services/blog-ingestion.service.ts`) — Phục vụ AI Agent Đăng Blog
- Chuẩn hóa `slugifyVietnamese`, `ensureUniqueSlug`, `parseRawBlogContent`, `standardizeBlogDraft`, và `ingestNewBlogPost`.

### 2.2. `MenuOptimizationService` (`src/services/menu-optimization.service.ts`) — Phục vụ AI Agent Thay Menu
- Chuẩn hóa ảnh thực đơn theo `STANDARD_MENU_IMAGE_SPEC` (`ratio 3:4`, `size 1600x2133 & 600x800`, `quality 85% WebP`), `inferMenuSection`, `optimizeMenuPageAsset`, và `replaceBranchMenu`.

### 2.3. `ReservationTransportService` & `ReservationService` (`src/services/reservation-transport.service.ts`, `src/services/reservation.service.ts`) — Công Cụ Gửi & Nơi Nhận Đặt Bàn
- **`formatReservationEmailSubject(record: ReservationRecord): string`**
  - Tạo tiêu đề chuẩn phân luồng cho lễ tân: `"[ĐẶT BÀN MỚI - CN MẠC THỊ BƯỞI] #LT-xxxxxx - Họ Tên (N khách - HH:mm DD/MM/YYYY)"`.
- **`buildLegacyFormData(input: ReservationFormInput): URLSearchParams`**
  - Đóng gói chính xác 8 trường `ContactForm[fullname]`, `ContactForm[email]`, `ContactForm[phone]`, `ContactForm[title]`, `ContactForm[date]`, `ContactForm[time]`, `ContactForm[quantity]`, `ContactForm[message]` để gửi `POST /dat-ban`.
- **`generateReservationIcsCalendar(record: ReservationRecord): string`**
  - Sinh chuỗi chuẩn `BEGIN:VCALENDAR ... END:VCALENDAR` chứa thông tin lịch hẹn ăn tối/trưa tại chi nhánh Lạc Thái để thực khách tải về máy.
- **`dispatchReservationToRecipients(record: ReservationRecord, transportConfig): Promise<ReservationDeliveryReceipt[]>`**
  - Gửi kết quả đặt bàn qua các kênh được cấu hình (`WEBHOOK_JSON`, `EMAIL_RELAY`, `CHAT_NOTIFICATION`, `LEGACY_FORM_POST`) và trả về biên nhận `ReservationDeliveryReceipt[]` ghi rõ nơi nhận.
- **`saveReservationDraft(draft)` / `loadReservationDraft()` / `clearReservationDraft()`**
  - Tự động lưu và khôi phục bản nháp biểu mẫu đặt bàn trong `sessionStorage`.
- **`getReservationHistory(): ReservationRecord[]`**
  - Trả về danh sách các phiếu đặt bàn mà thực khách đã gửi trên thiết bị (`lacthai_reservation_history`).

---

## 3. Đặc Tả Kịch Bản Kiểm Thử Tự Động (TDD Test Specifications `v1.3.0`)

| Nhóm Kiểm Thử | File Test Dự Kiến | Các kịch bản kiểm thử bắt buộc (Red → Green → Refactor) |
| :--- | :--- | :--- |
| **Reservation Transport & Delivery** | `src/services/__tests__/reservation-transport.service.test.ts`<br>`src/services/__tests__/reservation.service.test.ts` | - Đóng gói đúng 8 trường `ContactForm[...]` cho `LEGACY_FORM_POST`.<br>- Định dạng đúng tiêu đề thông báo phân luồng theo chi nhánh Quận 1 vs Thảo Điền.<br>- Gửi thành công tới Webhook JSON / Email Relay / Legacy Endpoint và ghi nhận đúng `ReservationDeliveryReceipt`.<br>- Tự động tạo Mã đặt bàn `#LT-xxxxxx` và nội dung lịch `.ics` hợp lệ.<br>- Tự động lưu nháp (`sessionStorage`), lưu lịch sử phiếu đặt bàn (`localStorage`), đưa vào `Offline Queue` khi mất mạng và đồng bộ lại khi có mạng. |
| **AI Agent Blog & Menu Pipelines** | `src/services/__tests__/blog-ingestion.service.test.ts`<br>`src/services/__tests__/menu-optimization.service.test.ts` | - Chuẩn hóa bài Blog mới (slug tiếng Việt, ngày đăng, đoạn trích, khối nội dung, ảnh 16:9).<br>- Tối ưu hóa ảnh Menu (`ratio 3:4`, `size 1600x2133 & 600x800`, `quality 85% WebP`), chặn ảnh mờ `< 600px`, thay thế thực đơn nguyên tử. |
| **Parallax & Anti-DoS Guard** | `src/services/__tests__/parallax.service.test.ts`<br>`src/services/__tests__/security-guard.service.test.ts` | - Kiểm thử đầy đủ hiệu ứng Parallax 60fps & `reducedMotion`.<br>- Kiểm thử 4 lớp chống Bot/Spam/DoS (Honeypot, Fill-Time `< 1.5s`, Cooldown `< 30s`, Rate Limit `> 3/15p`, Idempotency `10p`). |
| **UI & SPA Integration** | `src/pages/__tests__/*.test.tsx` | - Kiểm thử toàn bộ 13 route SPA, đổi chi nhánh cập nhật Google Maps & Hotline tại `/dat-ban`, hiển thị Modal Phiếu xác nhận `#LT-xxxxxx` sau khi gửi. |
