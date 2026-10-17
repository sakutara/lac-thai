# Architecture Decision Records (ADR) — Lịch Sử Quyết Định Kiến Trúc

Thư mục này lưu trữ **tất cả các phiên bản và quyết định kiến trúc (SA)** trong suốt lịch sử phát triển ứng dụng **Nhà Hàng Lạc Thái Webapp (SPA & PWA)**.

---

## 1. Quy Tắc Quản Lý ADR (ADR Governance)

1. **Bất biến & Lưu vết lịch sử (Immutability & Full Version History):**
   - Không bao giờ xóa một ADR cũ hay lịch sử phiên bản cũ.
   - Mọi sự thay đổi hoặc tinh chỉnh quyết định kiến trúc (do cập nhật `BR.md` hoặc do phát hiện vấn đề trong quá trình xây dựng) đều được ghi nhận vào bảng **Lịch Sử Phiên Bản Quyết Định** bên trong ADR đó và bổ sung ADR mới.
2. **Liên kết chặt chẽ với `SA.md` và `BR.md`:**
   - Mỗi ADR đều ghi rõ phiên bản `BR` và `SA` mà nó phục vụ.

---

## 2. Danh Mục Các Quyết Định Kiến Trúc (ADR Log)

| Mã ADR | Tiêu đề quyết định | Phiên bản ADR | Phiên bản SA | Trạng thái | Ngày cập nhật |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`ADR-001`](./ADR-001-spa-framework-and-build-stack.md) | Lựa chọn nền tảng SPA Framework, Ngôn ngữ và Build Tool (React 19 + TypeScript + Vite) | `v1.0.0` | `SA v1.0.0+` | `Accepted` | 2026-10-17 |
| [`ADR-002`](./ADR-002-pwa-and-offline-strategy.md) | Chiến lược Progressive Web App (PWA), Service Worker Caching & Hàng đợi Đặt bàn Ngoại tuyến | `v1.0.0` | `SA v1.0.0+` | `Accepted` | 2026-10-17 |
| [`ADR-003`](./ADR-003-ui-redesign-and-styling-system.md) | Định hướng Giao diện Mới ("Modern Royal Thai Gastronomy") & Kiến trúc Design System | `v1.1.0` | `SA v1.1.0+` | `Accepted (Updated)` | 2026-10-17 |
| [`ADR-004`](./ADR-004-data-and-reservation-backend-strategy.md) | Kiến trúc Quản lý Dữ liệu Nội dung, Tích hợp Đặt bàn An toàn & Pipeline Cập nhật Tự động | `v1.2.0` | `SA v1.2.0+` | `Accepted (Updated)` | 2026-10-17 |
| [`ADR-005`](./ADR-005-sdd-tdd-and-quality-gates.md) | Quy trình SDD + TDD Nghiêm ngặt và Cổng Kiểm soát Chất lượng >= 90% Real Coverage | `v1.0.0` | `SA v1.0.0+` | `Accepted` | 2026-10-17 |
| [`ADR-006`](./ADR-006-parallax-scrolling-and-motion-architecture.md) | Kiến trúc Hiển thị Parallax Đa Tầng & Hiệu ứng Chuyển động 60fps | `v1.0.0` | `SA v1.1.0+` | `Accepted` | 2026-10-17 |
| [`ADR-007`](./ADR-007-dos-ddos-protection-and-rate-limiting.md) | Kiến trúc Phòng chống Tấn công DoS/DDoS & Bảo vệ Luồng Đặt bàn Client-Side | `v1.0.0` | `SA v1.1.0+` | `Accepted` | 2026-10-17 |
| [`ADR-008`](./ADR-008-ai-agent-content-and-media-optimization-pipeline.md) | Kiến trúc Tự động hóa cho AI Agent — Chuẩn hóa Trang Blog Mới & Tối ưu hóa Hình ảnh Menu | `v1.0.0` | `SA v1.2.0+` | `Accepted` | 2026-10-17 |
| [`ADR-009`](./ADR-009-reservation-delivery-and-notification-architecture.md) | Kiến trúc Công cụ Gửi & Nơi Nhận Kết quả Đặt bàn Đa kênh (`ReservationTransportService`) | `v1.0.0` | `SA v1.3.0` | `Accepted` | 2026-10-17 |

---

## 3. Nhật Ký Phiên Bản Kiến Trúc Hệ Thống (SA Version History)

| Phiên bản SA | Phiên bản BR | Ngày | Tóm tắt trạng thái & thay đổi kiến trúc | Các ADR hiệu lực |
| :--- | :--- | :--- | :--- | :--- |
| `v1.0.0` | `v1.0.0` | 2026-10-17 | Phiên bản kiến trúc khởi tạo cho bản viết lại toàn diện `https://lacthai.vn/` theo mô hình SPA & PWA, giữ nguyên 100% tính năng cũ và nâng cấp giao diện mới. | `ADR-001` .. `ADR-005` (`v1.0.0`) |
| `v1.1.0` | `v1.1.0` | 2026-10-17 | Cập nhật kiến trúc theo phản hồi lần 1 của Anh:<br>1. Bổ sung kiến trúc **Parallax Scrolling đa tầng 60fps**.<br>2. Đánh giá rủi ro DoS/DDoS và bổ sung kiến trúc **Phòng vệ 4 lớp (`SecurityGuardService`)**. | `ADR-001`, `ADR-002`, `ADR-003 (v1.1.0)`, `ADR-004 (v1.1.0)`, `ADR-005`, `ADR-006`, `ADR-007` |
| `v1.2.0` | `v1.2.0` | 2026-10-17 | Cập nhật kiến trúc theo phản hồi lần 2 của Anh:<br>1. Bổ sung `BlogIngestionService` tự động chuẩn hóa trang mới khi AI Agent nhận yêu cầu đăng bài Blog.<br>2. Bổ sung `MenuOptimizationService` tự động tối ưu hóa chất lượng hình ảnh (`ratio 3:4`, `size 1600x2133 & 600x800`, `quality 85% WebP`). | `ADR-001` .. `ADR-008` |
| `v1.3.0` | `v1.3.0` | 2026-10-17 | Cập nhật kiến trúc theo phản hồi lần 3 của Anh:<br>Làm rõ toàn diện **Mục 4 trong `SA.md` — Kiến trúc Hệ thống Đặt bàn Trực tuyến**: quy định rõ **Công cụ gửi kết quả (`ReservationTransportService`)** gồm 4 Adapter (`WebhookJson`, `EmailRelay`, `ChatNotify`, `LegacyFormPost`) và **Nơi nhận kết quả** (Email Nhà hàng, Sổ Google Sheets, Chat Lễ tân 2 chi nhánh, và Phiếu xác nhận điện tử `#LT-xxxxxx` + Lịch `.ics` cho Thực khách). | `ADR-001` .. `ADR-009` |
