# Tài Liệu Dự Án: Lạc Thái Restaurant Webapp (SPA & PWA)

> **Trạng thái kế hoạch:** `APPROVED v1.3.0 — Đã chốt chính thức (Signed Off) & Đang triển khai Agile SDD + TDD`
> **Mục tiêu:** Viết lại toàn bộ website [https://lacthai.vn/](https://lacthai.vn/) theo kiến trúc **Single Page Application (SPA)** và **Progressive Web App (PWA)**, giữ nguyên 100% tính năng nghiệp vụ cũ, nâng cấp toàn diện giao diện (UI/UX) theo phong cách **Modern Royal Thai Gastronomy kết hợp Parallax đa tầng**, bảo vệ an toàn trước tấn công Spam/DoS/DDoS, và tích hợp **Hệ thống tự động chuẩn hóa bài Blog & tối ưu hóa hình ảnh Thực đơn cho AI Agent**.

---

## 1. Cấu Trúc Thư Mục Tài Liệu (`docs/`)

Toàn bộ tài liệu chuẩn mực của dự án được lưu trữ và quản lý phiên bản tại thư mục `docs/`:

| File / Thư mục | Mô tả chi tiết | Phiên bản hiện tại |
| :--- | :--- | :--- |
| [`docs/README.md`](./README.md) | Tổng quan hệ thống tài liệu, quy trình SDD/TDD, quy tắc đồng bộ BR ↔ SA ↔ ADR và cơ chế phản hồi khi phát sinh vấn đề. | `v1.3.0` |
| [`docs/BR.md`](./BR.md) | **Business Requirements (Yêu cầu nghiệp vụ):** Phân tích hiện trạng `lacthai.vn`, giữ nguyên 100% tính năng cũ, **Chi tiết toàn diện tính năng Đặt bàn (`FR-06`: Luồng nghiệp vụ, Công cụ gửi, Nơi nhận kết quả)**, UI/UX **Parallax**, **Chống DoS/DDoS**, và **AI Agent tự động hóa (`FR-09`, `FR-10`)**. | `v1.3.0` |
| [`docs/SA.md`](./SA.md) | **System Architecture (Kiến trúc hệ thống):** Kiến trúc tổng thể SPA & PWA, **Mục 4: Kiến trúc Chi tiết Hệ thống Đặt bàn Trực tuyến (`ReservationTransportService` & Đa kênh nhận kết quả)**, **Parallax Engine 60fps**, **Phòng vệ Chống DoS/Spam 4 lớp**, **AI Agent Pipeline** và **Ma trận truy vết BR ↔ SA**. | `v1.3.0` |
| [`docs/SDD.md`](./SDD.md) | **Specification-Driven Development (Đặc tả kỹ thuật chi tiết):** Định nghĩa kiểu dữ liệu, thuật toán Parallax, `SecurityGuardService`, `ReservationTransportService`, `BlogIngestionService`, `MenuOptimizationService` và kịch bản kiểm thử TDD. | `v1.3.0` |
| [`docs/AGILE-PLAN.md`](./AGILE-PLAN.md) | **Kế hoạch triển khai Agile + SDD + TDD:** Lộ trình 5 Sprint, quy trình Red-Green-Refactor, tiêu chuẩn kiểm soát >= 90% Real Test Coverage (chống farm coverage). | `v1.3.0` |
| [`docs/adr/README.md`](./adr/README.md) | **Architecture Decision Records Index:** Nhật ký toàn bộ các quyết định kiến trúc và lịch sử tiến hóa của SA (`v1.0.0` → `v1.1.0` → `v1.2.0` → `v1.3.0`). | `v1.3.0` |
| [`ADR-001`](./adr/ADR-001-spa-framework-and-build-stack.md) | Quyết định lựa chọn nền tảng SPA, ngôn ngữ và công cụ đóng gói (React 19 + TypeScript + Vite). | `v1.0.0` |
| [`ADR-002`](./adr/ADR-002-pwa-and-offline-strategy.md) | Quyết định kiến trúc PWA, Service Worker, chiến lược lưu đệm thực đơn/bài viết offline và hàng đợi đặt bàn. | `v1.0.0` |
| [`ADR-003`](./adr/ADR-003-ui-redesign-and-styling-system.md) | Quyết định định hướng giao diện mới ("Modern Royal Thai Gastronomy" + Parallax) và kiến trúc Design System. | `v1.1.0` |
| [`ADR-004`](./adr/ADR-004-data-and-reservation-backend-strategy.md) | Quyết định kiến trúc lưu trữ dữ liệu nội dung, xử lý Đặt bàn an toàn & cập nhật qua AI Agent. | `v1.2.0` |
| [`ADR-005`](./adr/ADR-005-sdd-tdd-and-quality-gates.md) | Quyết định công cụ kiểm thử, quy tắc TDD và cơ chế chặn CI/CD với ngưỡng >= 90% coverage thực chất. | `v1.0.0` |
| [`ADR-006`](./adr/ADR-006-parallax-scrolling-and-motion-architecture.md) | Quyết định kiến trúc hiển thị Parallax đa tầng & hiệu ứng chuyển động 60fps. | `v1.0.0` |
| [`ADR-007`](./adr/ADR-007-dos-ddos-protection-and-rate-limiting.md) | Quyết định kiến trúc phòng chống tấn công DoS/DDoS & bảo vệ luồng Đặt bàn Client-side. | `v1.0.0` |
| [`ADR-008`](./adr/ADR-008-ai-agent-content-and-media-optimization-pipeline.md) | Quyết định kiến trúc tự động hóa cho AI Agent — Chuẩn hóa trang Blog mới & Tối ưu hóa hình ảnh Menu. | `v1.0.0` |
| [`ADR-009`](./adr/ADR-009-reservation-delivery-and-notification-architecture.md) | Quyết định kiến trúc Công cụ gửi & Nơi nhận kết quả Đặt bàn đa kênh (`ReservationTransportService`). | `v1.0.0` |
