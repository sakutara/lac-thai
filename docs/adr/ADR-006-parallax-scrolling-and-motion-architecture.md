# ADR-006: Kiến Trúc Hiển Thị Parallax Đa Tầng & Hiệu Ứng Chuyển Động 60fps

- **Mã ADR:** `ADR-006`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Accepted (Đã chốt theo phản hồi của Anh)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.1.0` (`FR-02`, `FR-03`, `FR-05`, `NFR-03`), `SA v1.1.0`, bổ sung cho [`ADR-003`](./ADR-003-ui-redesign-and-styling-system.md)

---

## 1. Bối Cảnh (Context)
Website gốc `https://lacthai.vn/` sử dụng nhiều thư viện jQuery cũ (`hw-parallax.js`, `jarallax.js`, `jquery.parallax-scroll.js`, `tilt.jquery.js`, `jquery.smoove.js`) để tạo hiệu ứng thị giác có chiều sâu khi cuộn trang. Trong quá trình duyệt kế hoạch (`v1.0.0`), Anh đã chốt giữ phong cách **Modern Royal Thai Gastronomy (`ADR-003`)** và yêu cầu bắt buộc **trang phải hiển thị dạng Parallax**.

Tuy nhiên, việc bê nguyên các thư viện jQuery cũ vào ứng dụng React 19 SPA sẽ gây xung đột Virtual DOM, rò rỉ bộ nhớ khi chuyển route và khó kiểm thử tự động TDD (>= 90% coverage).

## 2. Quyết Định Kiến Trúc (Decision)

Xây dựng hệ thống **Native React Parallax Engine** nhẹ, không phụ thuộc jQuery, tách biệt rõ ràng giữa **Toán học tính toán (`ParallaxService`)**, **Quản lý sự kiện cuộn (`useParallax`)** và **Thành phần hiển thị (`ParallaxSection`, `ParallaxLayer`, `ParallaxTiltCard`)**:

1. **Tầng Thuật Toán (`src/services/parallax.service.ts`):**
   - Hàm thuần túy `calculateParallaxOffset(scrollY, elementTop, config)` tính toán vị trí dịch chuyển theo `speedFactor` (từ `-1.0` đến `1.0`) và giới hạn biên độ `maxOffsetPx` để hình ảnh không bao giờ bị hở viền.
   - Hàm thuần túy `calculateCardTilt(cursorX, cursorY, rect)` tạo hiệu ứng nghiêng 3D tinh tế khi rê chuột trên thẻ món ăn Signature và Gallery Không gian.
2. **Tầng Tối Ưu Hóa Phần Cứng (`src/hooks/useParallax.ts`):**
   - Sử dụng `window.addEventListener('scroll', handler, { passive: true })` kết hợp `requestAnimationFrame` để đảm bảo tốc độ khung hình luôn đạt **60fps**.
   - Áp dụng duy nhất thuộc tính GPU `transform: translate3d(x, y, 0)` (không can thiệp `top`/`left`), đảm bảo chỉ số `CLS = 0`.
3. **Tầng Trợ Năng (`Accessibility`):**
   - Tự động kiểm tra `window.matchMedia('(prefers-reduced-motion: reduce)')`. Nếu người dùng bật chế độ giảm chuyển động, hệ thống tự động vô hiệu hóa độ lệch Parallax mà vẫn giữ nguyên bố cục sang trọng.

## 3. Hệ Quả (Consequences)
- **Tích cực:** Mang lại trải nghiệm cuộn trang đa tầng sang trọng, mượt mà trên mọi thiết bị; loại bỏ hoàn toàn 5 thư viện jQuery nặng nề của web cũ; đạt 100% khả năng kiểm thử Unit & Component Test cho thuật toán và giao diện Parallax.
