# ADR-002: Chiến Lược Progressive Web App (PWA), Service Worker Caching & Hàng Đợi Ngoại Tuyến

- **Mã ADR:** `ADR-002`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Proposed (Chờ chốt)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.0.0` (`FR-04`, `FR-06`, `NFR-02`), `SA v1.0.0`

---

## 1. Bối Cảnh (Context)
Thực khách của Nhà hàng Lạc Thái thường tra cứu thực đơn (43 trang tại chi nhánh Mạc Thị Bưởi, 54 trang tại chi nhánh Xuân Thủy), xem địa chỉ/hotline hoặc đặt bàn ngay trên điện thoại di động khi đang di chuyển hoặc ngồi trong không gian nhà hàng (nơi kết nối 4G/Wi-Fi có thể không ổn định). Do đó, ứng dụng cần hoạt động như một **PWA hoàn chỉnh**: cài đặt được lên màn hình chính (Installable) và hoạt động bền bỉ ngay cả khi mất mạng (Offline-capable).

## 2. Quyết Định Kiến Trúc (Decision)

1. **Web App Manifest (`manifest.webmanifest`):**
   - `name`: `"Nhà hàng Lạc Thái - Vị Thái chuẩn cho người sành"`
   - `short_name`: `"Lạc Thái"`
   - `display`: `"standalone"`
   - `theme_color`: `"#0F291E"` (Deep Thai Emerald)
   - `background_color`: `"#0A1912"`
   - Cung cấp đầy đủ icon chuẩn PWA (`192x192`, `512x512`, `maskable`).

2. **Chiến lược Bộ nhớ đệm (Service Worker Caching via Workbox):**
   - **Tầng 1 — App Shell & Core Content Precache:**
     - Toàn bộ mã nguồn SPA, thông tin 2 chi nhánh, 14 món Signature/Drinks và toàn bộ 15 bài viết Blog được đóng gói sẵn và Precache.
     - Kết quả: Người dùng mở bất kỳ trang nào (`/`, `/ve-chung-toi`, `/thuc-don`, `/blog`, `/tin-tuc/:slug`, `/lien-he`) khi **Offline 100%** vẫn hiển thị đầy đủ nội dung ngay lập tức.
   - **Tầng 2 — Hình ảnh Thực đơn & Không gian (`CacheFirst` / `StaleWhileRevalidate`):**
     - Hình ảnh thực đơn (`Art-01..36`, `Lac 7 Menu...`) và ảnh không gian được lưu vào bộ nhớ đệm riêng `lacthai-media-cache` với hạn mức tối đa 150 tệp tin.
   - **Tầng 3 — Hàng đợi Đặt bàn Ngoại tuyến (`Offline Reservation Queue`):**
     - Khi người dùng gửi biểu mẫu Đặt bàn (`/dat-ban`) trong lúc mất mạng, `ReservationService` lưu bản ghi đã kiểm duyệt (validated) vào `localStorage` (`lacthai_offline_reservation_queue`) và lắng nghe sự kiện `window.addEventListener('online')` để tự động đồng bộ lên máy chủ ngay khi có mạng trở lại.

## 3. Hệ Quả (Consequences)
- **Tích cực:** Không bao giờ xảy ra màn hình khủng long mất mạng của trình duyệt; khách hàng không bị mất thông tin đã nhập vào form Đặt bàn khi rớt mạng đột ngột.
- **Kiểm thử:** Toàn bộ logic phát hiện Online/Offline (`useNetworkStatus`) và hàng đợi đồng bộ (`ReservationService.flushOfflineQueue`) được tách biệt hoàn toàn để kiểm thử tự động bằng Unit & Integration Tests.
