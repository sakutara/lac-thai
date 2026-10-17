# ADR-003: Định Hướng Giao Diện Mới ("Modern Royal Thai Gastronomy") & Kiến Trúc Design System

- **Mã ADR:** `ADR-003`
- **Phiên bản:** `1.1.0` (Cập nhật từ `1.0.0` sau khi chốt hiệu ứng Parallax)
- **Trạng thái:** `Accepted (Đã chốt với bổ sung ADR-006)`
- **Ngày cập nhật:** `2026-10-17`
- **Liên kết:** `BR v1.1.0` (`FR-01`..`FR-08`, `NFR-03`), `SA v1.1.0`, [`ADR-006`](./ADR-006-parallax-scrolling-and-motion-architecture.md)

---

## 0. Lịch Sử Phiên Bản Quyết Định (Decision Revision History)

| Phiên bản | Ngày | Trạng thái | Nội dung quyết định |
| :--- | :--- | :--- | :--- |
| `1.0.0` | 2026-10-17 | `Proposed` | Đề xuất ngôn ngữ thiết kế *Modern Royal Thai Gastronomy* (Xanh Ngọc Lục Bảo trầm + Vàng kim Hoàng gia + Kem ngà ấm) cùng trình xem E-Menu thông minh. |
| `1.1.0` | 2026-10-17 | `Accepted` | Anh phê duyệt bảng màu & phong cách `ADR-003`, đồng thời bổ sung yêu cầu bắt buộc: **Toàn bộ trang phải hiển thị dạng Parallax đa tầng** (chi tiết kỹ thuật tách riêng tại [`ADR-006`](./ADR-006-parallax-scrolling-and-motion-architecture.md)). |

---

## 1. Bối Cảnh (Context)
Yêu cầu cốt lõi của dự án là **thay đổi toàn bộ giao diện** của `https://lacthai.vn/` trong khi vẫn giữ nguyên 100% tính năng và nội dung cũ, đồng thời tái hiện và nâng tầm hiệu ứng chiều sâu **Parallax** đặc trưng của nhà hàng.

## 2. Quyết Định Thiết Kế (Design Direction & Architecture)

### 2.1. Ngôn ngữ thiết kế: "Modern Royal Thai Gastronomy" + Multi-Layer Parallax
- **Bảng màu (Color Palette):**
  - **Primary Background (Dark Luxury):** Xanh ngọc lục bảo trầm (*Deep Thai Emerald* `#0B1F17` & `#122E23`).
  - **Secondary Surface (Warm Ivory):** Kem ngà hoa nhài (*Jasmine Rice Ivory* `#FAF6F0`).
  - **Accent Primary:** Vàng kim Chùa Vàng (*Royal Siam Gold* `#D4AF37` / `#E5C158`).
  - **Accent Secondary:** Đỏ ớt Thái (*Tom Yum Terracotta* `#C84B31`).
- **Typography (Hỗ trợ tiếng Việt tuyệt đối):**
  - **Heading Font:** *Playfair Display* / *Cormorant Garamond*.
  - **Body & UI Font:** *Plus Jakarta Sans*.
- **Trải nghiệm Cuộn Parallax Đa Tầng (Bắt buộc theo `v1.1.0`):**
  - Mọi phân đoạn chính (Hero Banner, Câu chuyện thương hiệu *"Since 1999"*, *"Make food, not war"*, Không gian nhà hàng, Kêu gọi Đặt bàn) đều kết hợp tối thiểu 2–3 lớp Parallax (Lớp nền ảnh chậm, Lớp họa tiết lá Thái/hoa văn trôi ngược chiều, Lớp nội dung chính).

### 2.2. Cải tiến UX đột phá trên các tính năng cũ
1. **Trình xem E-Menu thông minh (Smart Branch Menu Viewer):** Chuyển đổi nhanh giữa 2 chi nhánh, lọc phân mục (`Tất cả`, `Món ăn`, `Thức uống`, `Ưu đãi`), chế độ xem lưới & phóng to sắc nét.
2. **Thanh điều hướng di động chuẩn PWA (Mobile Quick Action Bar):** Truy cập nhanh `Trang chủ`, `Thực đơn`, `Đặt bàn ngay`, `Gọi Hotline`.
