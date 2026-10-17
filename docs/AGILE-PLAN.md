# Kế Hoạch Triển Khai Agile, SDD & TDD (Master Implementation Plan)

- **Mã tài liệu:** `DOC-PLAN-LACTHAI`
- **Phiên bản:** `1.3.0` (Đồng bộ với `BR v1.3.0`, `SA v1.3.0`, `SDD v1.3.0`)
- **Ngày cập nhật:** `2026-10-17`
- **Liên kết:** [`BR v1.3.0`](./BR.md) | [`SA v1.3.0`](./SA.md) | [`SDD v1.3.0`](./SDD.md) | [`ADR Log`](./adr/README.md)

---

## 1. Lịch Sử Phiên Bản Kế Hoạch (Plan Revision History)

| Phiên bản | Ngày | Nội dung cập nhật |
| :--- | :--- | :--- |
| `1.0.0` | 2026-10-17 | Khởi tạo lộ trình 5 Sprint theo mô hình Agile + SDD + TDD (Coverage >= 90%). |
| `1.1.0` | 2026-10-17 | Cập nhật Sprint 1 & Sprint 2 để bổ sung TDD cho **Parallax Engine** và **Anti-DoS/Spam Guard** theo `BR v1.1.0` & `SA v1.1.0`. |
| `1.2.0` | 2026-10-17 | Cập nhật Sprint 1 & Sprint 5 để bổ sung TDD cho **AI Agent Content & Media Ingestion Pipeline** (`BlogIngestionService`, `MenuOptimizationService`) theo `BR v1.2.0` & `SA v1.2.0`. |
| `1.3.0` | 2026-10-17 | Cập nhật Sprint 1 & Sprint 4 để bổ sung TDD cho **`ReservationTransportService`** (Công cụ gửi kết quả đặt bàn đa kênh: Webhook/Google Sheets, Email Relay, Telegram/Zalo, Legacy POST `/dat-ban`, sinh Mã đơn `#LT-xxxxxx` & file lịch `.ics`) theo `BR v1.3.0` & `SA v1.3.0`. |

---

## 2. Quy Trình Phát Triển Chuẩn Mực (Agile + SDD + TDD Workflow)

Mỗi Sprint và mỗi User Story đều phải đi qua đúng **5 bước bắt buộc**:
1. **Bước 1 (SDD Check):** Đối chiếu đặc tả trong `docs/SDD.md`.
2. **Bước 2 (RED — Viết Test Trước):** Viết Unit/Component Test & chạy xác nhận FAIL.
3. **Bước 3 (GREEN — Viết Code):** Viết code tối thiểu để toàn bộ Test PASS.
4. **Bước 4 (REFACTOR):** Làm sạch code, tối ưu UI/UX & giữ Test PASS.
5. **Bước 5 (QUALITY GATE):** Kiểm tra Coverage >= 90% (Lines, Branches, Functions, Statements).

---

## 3. Lộ Trình Các Sprint (Agile Sprint Roadmap `v1.3.0`)

### Sprint 0: Khởi Tạo Khung Dự Án, Cấu Hình PWA, Agent Skill & Cổng Kiểm Thử TDD
- Thiết lập React 19 + TypeScript + Vite 6 + Tailwind CSS + Vitest + `vite-plugin-pwa`, cấu hình ngưỡng Coverage >= 90%.
- Chuẩn hóa kho dữ liệu gốc từ `https://lacthai.vn/` và khởi tạo Workspace Agent Skill `.agents/skills/lacthai-content-manager/SKILL.md`.

### Sprint 1: Tầng Domain, Validation, Anti-DoS Guard, Parallax Math, AI Agent Pipelines & Reservation Transport (TDD)
- **US-1.1 — Kiểm duyệt dữ liệu Đặt bàn (`reservation.schema.ts`)**: RED → GREEN → REFACTOR.
- **US-1.2 — Bảo vệ Chống Bot / Spam / DoS (`security-guard.service.ts`)**: RED → GREEN → REFACTOR.
- **US-1.3 — Thuật toán Parallax & 3D Tilt (`parallax.service.ts`)**: RED → GREEN → REFACTOR.
- **US-1.4 — Dịch vụ Thực đơn (`menu.service.ts`) & AI Agent Tối ưu hóa Thực đơn (`menu-optimization.service.ts`)**: RED → GREEN → REFACTOR.
- **US-1.5 — Dịch vụ Blog (`blog.service.ts`) & AI Agent Chuẩn hóa Bài Blog mới (`blog-ingestion.service.ts`)**: RED → GREEN → REFACTOR.
- **US-1.6 — Công cụ Gửi Đặt bàn Đa kênh (`reservation-transport.service.ts`) & Điều phối Đặt bàn (`reservation.service.ts`)**:
  - *RED:* Viết test kiểm tra đóng gói `FormData ContactForm[...]`, gửi Webhook JSON (Google Sheets / Serverless), gửi Email Relay, phân luồng tiêu đề theo chi nhánh (Mạc Thị Bưởi vs Xuân Thủy), sinh mã đơn `#LT-xxxxxx`, tạo file lịch `.ics`, lưu nháp `sessionStorage`, lưu lịch sử đặt bàn và đồng bộ `Offline Queue`.
  - *GREEN & REFACTOR:* Hiện thực hóa `ReservationTransportService` và `ReservationService`.

### Sprint 2: Custom Hooks, Thành Phần Giao Diện Parallax, App Shell & Trang Chủ (TDD)
- **US-2.1 — Custom Hooks (`useParallax`, `useLightbox`, `useNetworkStatus`, `useDocumentMeta`, `useReservationForm`)**: RED → GREEN → REFACTOR.
- **US-2.2 — Bộ Component Parallax & App Shell (`Header`, `Footer`, `MobileDrawer`, `OfflineBanner`, `ScrollToTop`)**: RED → GREEN → REFACTOR.
- **US-2.3 — Trang Chủ Đa Tầng Parallax (`HomePage` - `/`)**: RED → GREEN → REFACTOR.

### Sprint 3: Hệ Thống Thực Đơn Đa Chi Nhánh, Không Gian Parallax & Về Chúng Tôi (TDD)
- **US-3.1 — Trang Về chúng tôi (`/ve-chung-toi`) với Parallax Storytelling**: RED → GREEN → REFACTOR.
- **US-3.2 — Trang Hub Thực đơn (`/thuc-don`) & E-Menu 2 Chi nhánh (`/thuc-don-lac-thai-mac-thi-buoi`, `/thuc-don-lac-thai-xuan-thuy`)**: RED → GREEN → REFACTOR.
- **US-3.3 — Trang Không gian 2 Chi nhánh với Parallax Lookbook (`/khong-gian-...`)**: RED → GREEN → REFACTOR.

### Sprint 4: Đặt Bàn Trực Tuyến Toàn Diện, Blog / Tin Tức, Liên Hệ & Pháp Lý (TDD)
- **US-4.1 — Trang Đặt bàn (`/dat-ban`) & Modal Phiếu Xác Nhận (`ReservationSuccessModal`)**:
  - *RED → GREEN → REFACTOR:* Kiểm thử đổi chi nhánh cập nhật bản đồ Google Maps & Hotline, gợi ý ghi chú nhanh, lưu nháp tự động, hiển thị Phiếu Đặt Bàn `#LT-xxxxxx` kèm nơi nhận kết quả, nút tải lịch `.ics` và danh sách lịch sử đặt bàn trên thiết bị.
- **US-4.2 — Danh sách Blog (`/blog`) & Chi tiết bài viết (`/tin-tuc/:slug`)**: RED → GREEN → REFACTOR.
- **US-4.3 — Trang Liên hệ (`/lien-he`), Chính sách (`/chinh-sach`), Quy định (`/quy-dinh`) & 404**: RED → GREEN → REFACTOR.

### Sprint 5: Công Cụ CLI Cho AI Agent, Kiểm Thử Tích Hợp Toàn Diện, Đóng Gói PWA & Nghiệm Thu (>= 90% Coverage)
- Hoàn thiện CLI scripts (`npm run agent:blog:add`, `npm run agent:menu:replace`) và kiểm증 Coverage >= 90% thực chất trên cả 4 chỉ số.
