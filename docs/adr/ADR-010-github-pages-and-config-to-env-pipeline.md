# ADR-010: Chiến Lược Deploy GitHub Pages & Pipeline Đồng Bộ Cấu Hình Đặt Bàn (`JSON/MD` → `.env`)

- **Trạng thái:** `Accepted`
- **Phiên bản ADR:** `v1.0.0`
- **Áp dụng cho:** `SA v1.4.0` / `BR v1.4.0`
- **Ngày quyết định:** 2026-10-17

---

## 1. Bối Cảnh (Context)

1. **Triển khai lên GitHub Pages:**
   - Ứng dụng SPA & PWA được deploy lên **GitHub Pages** tại địa chỉ `https://sakutara.github.io/lac-thai/` thông qua GitHub Actions (`.github/workflows/deploy.yml`).
   - Do chạy dưới subpath `/lac-thai/`, SPA Router, PWA Manifest (`start_url`, `scope`), và toàn bộ tài nguyên ảnh tĩnh cần tự động thích ứng với `import.meta.env.BASE_URL` đồng thời hỗ trợ SPA fallback qua `dist/404.html`.
2. **Quản lý cấu hình Email & Google Sheet đặt bàn dễ theo dõi:**
   - Người vận hành muốn lưu trữ toàn bộ cấu hình kênh nhận đặt bàn (Google Sheet Webhook + Danh sách Email nhận thông báo) trong file JSON/Markdown (`config/reservation-channels.json` và `docs/RESERVATION-CHANNELS.md`) để dễ theo dõi và kiểm soát lịch sử trên Git.
   - Khi build/deploy, hệ thống mới chuyển nội dung cấu hình đó ra file `.env` và ứng dụng đọc từ các biến môi trường `import.meta.env.VITE_RESERVATION_*` trong `.env`.

---

## 2. Quyết Định Kiến Trúc (Decision)

1. **Lưu trữ Nguồn Sự Thật (Source of Truth) trong `config/reservation-channels.json` & `docs/RESERVATION-CHANNELS.md`:**
   - File `config/reservation-channels.json` lưu cấu trúc `googleSheet` (`webhookUrl`, `spreadsheetId`, `sheetTabName`) và `emails` (`recipients`, `cc`, `subjectPrefix`).
   - File `docs/RESERVATION-CHANNELS.md` mô tả chi tiết bảng cấu hình và mã Google Apps Script tự động đọc `payload.recipients` từ ứng dụng gửi lên.
2. **Pipeline Tự Động Sinh `.env` Khi Build/Deploy (`scripts/sync-env-from-config.ts`):**
   - Script `npm run sync:env` (`tsx scripts/sync-env-from-config.ts`) đọc `config/reservation-channels.json` và xuất ra file `.env` chứa:
     - `VITE_RESERVATION_WEBHOOK_URL`
     - `VITE_RESERVATION_SPREADSHEET_ID`
     - `VITE_RESERVATION_SHEET_TAB`
     - `VITE_RESERVATION_RECIPIENT_EMAILS`
     - `VITE_RESERVATION_CC_EMAILS`
     - `VITE_RESERVATION_EMAIL_SUBJECT_PREFIX`
   - Tự động kích hoạt trước `npm run dev`, `npm run build`, `npm test`, `npm run test:coverage` và trong bước CI/CD của `.github/workflows/deploy.yml`.
3. **Ứng Dụng Đọc Cấu Hình Từ `.env` (`src/services/reservation-transport.service.ts`):**
   - Hàm `getEnvReservationConfig()` đọc trực tiếp từ `import.meta.env.VITE_RESERVATION_*` và đính kèm `recipients`, `cc`, `emailSubjectPrefix`, `sheetTabName` vào JSON payload gửi đến Google Sheet Webhook.

---

## 3. Hệ Quả (Consequences)

- **Ưu điểm:**
  - Dễ dàng theo dõi và chỉnh sửa cấu hình Email/Google Sheet ngay trong `config/reservation-channels.json` mà không cần sửa code hay cập nhật lại Google Apps Script mỗi khi đổi danh sách email nhận.
  - Đảm bảo `.env` luôn đồng bộ 100% lúc dev, test và deploy trên GitHub Actions.
