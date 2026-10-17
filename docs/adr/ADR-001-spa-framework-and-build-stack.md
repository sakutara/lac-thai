# ADR-001: Lựa Chọn Nền Tảng SPA Framework, Ngôn Ngữ và Build Tool

- **Mã ADR:** `ADR-001`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Proposed (Chờ chốt)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.0.0` (`NFR-01`, `NFR-04`, `NFR-05`), `SA v1.0.0`

---

## 1. Bối Cảnh (Context)
Website hiện tại của Nhà hàng Lạc Thái (`https://lacthai.vn/`) được xây dựng trên nền tảng PHP 5.6 kết hợp giao diện xuất tĩnh từ WordPress/Elementor, tải hơn 60 tệp CSS/JS rời rạc và phải tải lại toàn bộ trang mỗi khi người dùng chuyển mục. Yêu cầu của dự án là viết lại toàn bộ ứng dụng theo mô hình **SPA (Single Page Application)** và **PWA (Progressive Web App)**, đảm bảo tốc độ chuyển trang tức thì, giữ nguyên 100% các đường dẫn URL cũ và hỗ trợ quy trình phát triển **SDD + TDD với độ phủ kiểm thử >= 90%**.

## 2. Các Phương Án Được Cân Nhắc (Options Considered)

### Phương án A: React 19 + TypeScript (Strict Mode) + Vite 6 + React Router v7 (Đề xuất)
- **Ưu điểm:**
  - Chuyển trang thuần SPA tức thì qua HTML5 History API, bảo toàn 100% URL cũ (`/ve-chung-toi`, `/thuc-don-lac-thai-mac-thi-buoi`, `/tin-tuc/:slug`...).
  - Hệ sinh thái kiểm thử TDD hoàn hảo với **Vitest + React Testing Library**, tốc độ chạy test cực nhanh (chỉ vài trăm mili-giây cho mỗi chu trình Red-Green-Refactor).
  - Tích hợp mượt mà với `vite-plugin-pwa` (Workbox) để đóng gói PWA chuẩn mực.
  - TypeScript Strict Mode giúp thực thi SDD (Specification-Driven Development) ngay từ tầng kiểu dữ liệu.
- **Nhược điểm:**
  - Cần cấu hình fallback về `index.html` trên web server (Nginx/Vercel/Cloudflare Pages) để hỗ trợ Deep Linking.

### Phương án B: Next.js (SSR / App Router)
- **Ưu điểm:** Hỗ trợ SSR mặc định.
- **Nhược điểm:** Nặng hơn cho mục tiêu thuần SPA + Offline-first PWA; kiểm thử Unit/Integration với React Server Components phức tạp hơn và dễ phát sinh mã boilerplate không cần thiết.

### Phương án C: Vue 3 + Vite
- **Ưu điểm:** Nhẹ, tốc độ tốt.
- **Nhược điểm:** Hệ sinh thái kiểm thử hành vi người dùng và các thư viện UI/Accessibility ít phổ biến hơn so với tổ hợp React + Testing Library.

## 3. Quyết Định (Decision)
Chọn **Phương án A: React 19 + TypeScript 5 (Strict Mode) + Vite 6 + React Router v7**.

## 4. Hệ Quả (Consequences)
- **Tích cực:** Đạt tốc độ phản hồi SPA tức thì, hỗ trợ chia nhỏ bundle (Code Splitting) theo từng trang, và cho phép kiểm thử độc lập từng tầng Domain → Service → Hook → Component để đạt >= 90% coverage thực chất.
- **Ràng buộc kỹ thuật:** Cần kèm theo file cấu hình điều hướng (`_redirects` / `vercel.json` / `nginx.conf`) để mọi đường dẫn con đều trỏ về `index.html` của SPA.
