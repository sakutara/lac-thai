---
name: lacthai-content-manager
description: Tự động xử lý, chuẩn hóa và xuất bản bài Blog mới hoặc thay Thực đơn (Menu) với tối ưu hóa chất lượng hình ảnh chuẩn (ratio 3:4, size 1600x2133 & 600x800, quality 85% WebP) khi AI Agent nhận yêu cầu từ người dùng.
---

# Kỹ Năng Quản Lý Nội Dung & Thực Đơn Tự Động — Nhà Hàng Lạc Thái (`lacthai-content-manager`)

Kỹ năng này được kích hoạt tự động mỗi khi người dùng yêu cầu AI Agent:
1. **Đăng bài Blog / Tin tức mới** (hoặc cập nhật bài viết).
2. **Thay Thực đơn (Menu)** cho chi nhánh Mạc Thị Bưởi (`mac-thi-buoi`) hoặc chi nhánh Xuân Thủy (`xuan-thuy`).

---

## 1. Quy Trình Khi Nhận Yêu Cầu Đăng Bài Blog Mới (`FR-09`)

Khi người dùng cung cấp tiêu đề và nội dung bài viết mới (dạng văn bản thô, Markdown, hoặc JSON):
1. Sử dụng `BlogIngestionService.standardizeBlogDraft(draft, existingPosts)` trong `src/services/blog-ingestion.service.ts` hoặc chạy lệnh CLI:
   ```bash
   npm run agent:blog:add -- --title "<Tiêu đề>" --content "<Nội dung hoặc đường dẫn file .md>"
   ```
2. Hệ thống sẽ tự động:
   - Chuẩn hóa `slug` tiếng Việt không dấu, chống trùng lặp (`-2`, `-3`...).
   - Chuẩn hóa ngày đăng về cả `DD/MM/YYYY` và `YYYY-MM-DD`.
   - Tách đoạn văn bản/Markdown thành khối chuẩn (`heading`, `paragraph`, `image`).
   - Tự sinh `excerpt` (140–200 ký tự) và `relatedKeywords` chuẩn SEO.
   - Chuẩn hóa ảnh đại diện về tỷ lệ `16:9` (`1200x675px`, `quality: 82%`, `webp`).
3. Chạy `npm test` để xác nhận bài viết mới hợp lệ 100% và hiển thị ngay ở đầu trang `/blog`.

---

## 2. Quy Trình Khi Nhận Yêu Cầu Thay Thực Đơn (`FR-10`)

Khi người dùng cung cấp danh sách ảnh thực đơn mới cho chi nhánh `mac-thi-buoi` hoặc `xuan-thuy`:
1. Sử dụng `MenuOptimizationService.replaceBranchMenu(branchId, rawInputs, options)` trong `src/services/menu-optimization.service.ts` hoặc chạy lệnh CLI:
   ```bash
   npm run agent:menu:replace -- --branch <mac-thi-buoi|xuan-thuy> --section <all|food|drinks|promo> --images "<url1,url2,...>"
   ```
2. Hệ thống sẽ tự động kiểm tra và chuẩn hóa:
   - **Ratio chuẩn:** `3:4` (`0.75`), tự động căn chỉnh `fit: 'contain'` trên nền `#0B1F17` để giữ `CLS = 0`.
   - **Size chuẩn:** Bản phóng to `1600 × 2133 px` (`<= 300 KB`) và bản thu nhỏ xem lưới `600 × 800 px` (`<= 80 KB`). Chặn ảnh gốc `< 600px`.
   - **Quality chuẩn:** `85% WebP` giữ độ nét chữ thực đơn và xóa EXIF.
   - Đánh lại số trang `1..N` liên tục và tăng `menuVersion` để PWA làm mới bộ nhớ đệm.
3. Chạy `npm test` để xác nhận bộ thực đơn mới đạt chuẩn 100%.
