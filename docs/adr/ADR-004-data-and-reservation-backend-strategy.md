# ADR-004: Kiến Trúc Quản Lý Dữ Liệu Nội Dung, Tích Hợp Đặt Bàn An Toàn & Pipeline Cập Nhật Tự Động

- **Mã ADR:** `ADR-004`
- **Phiên bản:** `1.2.0` (Cập nhật từ `1.1.0` để tích hợp AI Agent Content & Media Pipeline)
- **Trạng thái:** `Accepted (Đã chốt kèm ADR-007 & ADR-008)`
- **Ngày cập nhật:** `2026-10-17`
- **Liên kết:** `BR v1.2.0` (`FR-02`..`FR-10`, `NFR-06`, `NFR-07`), `SA v1.2.0`, [`ADR-007`](./ADR-007-dos-ddos-protection-and-rate-limiting.md), [`ADR-008`](./ADR-008-ai-agent-content-and-media-optimization-pipeline.md)

---

## 0. Lịch Sử Phiên Bản Quyết Định (Decision Revision History)

| Phiên bản | Ngày | Trạng thái | Nội dung quyết định |
| :--- | :--- | :--- | :--- |
| `1.0.0` | 2026-10-17 | `Proposed` | Đề xuất lưu trữ dữ liệu nội dung dưới dạng kho dữ liệu tĩnh có kiểu (`Structured Static Repository`) kết hợp `ReservationService` gửi `POST /dat-ban` và hàng đợi Offline. |
| `1.1.0` | 2026-10-17 | `Accepted` | Qua đánh giá an ninh mạng (`ADR-007`), xác nhận hướng Client-side SPA/PWA + CDN Edge loại bỏ hoàn toàn nguy cơ L7 GET DoS vào Origin Server khi xem nội dung; đồng thời bổ sung lớp `SecurityGuardService` để bảo vệ tuyệt đối luồng `POST /dat-ban`. Chốt thực hiện theo Hướng 1. |
| `1.2.0` | 2026-10-17 | `Accepted` | Bổ sung cơ chế cập nhật kho dữ liệu tự động dành cho AI Agent (`BlogIngestionService` và `MenuOptimizationService` tại [`ADR-008`](./ADR-008-ai-agent-content-and-media-optimization-pipeline.md)), cho phép thêm bài blog mới đã chuẩn hóa và thay thực đơn đã tối ưu hóa hình ảnh một cách nguyên tử (atomic) trên nền tảng dữ liệu tĩnh/runtime. |

---

## 1. Bối Cảnh (Context)
Website `https://lacthai.vn/` bao gồm dữ liệu nội dung thương hiệu (2 chi nhánh, 14 món đề xuất, 97 trang thực đơn, 21 ảnh không gian/gallery, 15+ bài blog), luồng giao dịch đặt bàn (`POST /dat-ban`), và luồng cập nhật nội dung tự động qua AI Agent (đăng bài blog mới, thay thực đơn).

## 2. Quyết Định Kiến Trúc (Decision)

1. **Tầng Dữ liệu Nội dung Có Phiên Bản (`Versioned Structured Repository Pattern`):**
   - Đóng gói chuẩn hóa trong `src/data/` và truy xuất/cập nhật thông qua `MenuService`, `BlogService`, `BlogIngestionService` và `MenuOptimizationService`.
   - Hỗ trợ cả cập nhật trực tiếp vào tệp dữ liệu nguồn (khi AI Agent chạy lệnh cập nhật) và lưu trữ bổ sung trong bộ nhớ ứng dụng, kèm mã phiên bản `menuVersion` / `blogVersion` để đồng bộ với PWA Service Worker.
2. **Tầng Xử lý Đặt bàn An toàn (`ReservationService` + `SecurityGuardService`):**
   - Mọi yêu cầu đặt bàn đều phải đi qua kiểm duyệt Schema (`Zod`) **và** kiểm duyệt chống Bot/Spam/DoS (`SecurityGuardService` chi tiết tại [`ADR-007`](./ADR-007-dos-ddos-protection-and-rate-limiting.md)).
