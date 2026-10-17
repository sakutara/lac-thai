# ADR-008: Kiến Trúc Tự Động Hóa Cho AI Agent — Chuẩn Hóa Trang Blog Mới & Tối Ưu Hóa Hình Ảnh Thực Đơn (Menu)

- **Mã ADR:** `ADR-008`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Accepted (Theo yêu cầu bổ sung của Anh tại BR v1.2.0)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.2.0` (`FR-09`, `FR-10`, `NFR-07`), `SA v1.2.0`, bổ sung cho [`ADR-004`](./ADR-004-data-and-reservation-backend-strategy.md)

---

## 1. Bối Cảnh (Context)
Trong quá trình vận hành thực tế của Nhà hàng Lạc Thái, hai tác vụ cập nhật nội dung thường xuyên nhất là:
1. **Đăng bài Blog / Tin tức mới** (khuyến mãi dịp lễ, giới thiệu món mới, sự kiện tiệc cưới/công ty).
2. **Thay Thực đơn (Menu)** khi nhà hàng điều chỉnh giá, ra mắt menu mới hoặc thêm chương trình ưu đãi đồ uống tại chi nhánh Mạc Thị Bưởi hoặc Xuân Thủy.

Nếu AI Agent chỉ sửa trực tiếp file dữ liệu thủ công mà không qua một tầng chuẩn hóa tự động:
- Bài blog mới dễ bị lỗi định dạng `slug` tiếng Việt, thiếu đoạn tóm tắt (`excerpt`), sai định dạng ngày `DD/MM/YYYY`, thiếu từ khóa SEO hoặc cấu trúc thẻ văn bản/hình ảnh không đồng nhất với các trang cũ.
- Hình ảnh thực đơn mới đưa vào dễ bị lệch tỷ lệ khung hình (`aspect ratio`), dung lượng quá nặng (như các file PNG vài MB trên web cũ) hoặc quá mờ khi thực khách phóng to đọc giá món ăn.

## 2. Quyết Định Kiến Trúc (Decision)

Thiết kế **Hệ thống Tự xử lý Nội dung & Đa phương tiện dành cho AI Agent (`AI Agent Content & Media Ingestion Pipeline`)** gồm 3 thành phần gắn kết chặt chẽ:

### 2.1. Dịch vụ Chuẩn hóa & Đăng bài Blog mới (`BlogIngestionService` — `src/services/blog-ingestion.service.ts`)
- **Hàm cốt lõi:** `standardizeBlogDraft(draft, options)` và `publishNewBlogPost(draft, existingPosts)`
- **Cơ chế tự động hóa:**
  1. **Slug Engine:** Tự động chuyển tiêu đề tiếng Việt có dấu sang `slug` chuẩn SEO không dấu (`đ -> d`, khoảng trắng/ký tự đặc biệt $\rightarrow$ `-`), tự động giải quyết xung đột nếu trùng `slug` cũ (`-2`, `-3`...).
  2. **Date Normalizer:** Tự động nhận diện ngày đầu vào (ISO, `DD/MM/YYYY`, hoặc `Date` mặc định là ngày hiện tại) và xuất ra đồng thời `publishedDate` (`DD/MM/YYYY`) và `publishedIso` (`YYYY-MM-DD`).
  3. **Content Block Normalizer:** Phân tích nội dung thô (Markdown hoặc Plain Text nhiều đoạn) thành mảng khối chuẩn `contentParagraphs` (`heading`, `paragraph`, `image`), tự động tạo `excerpt` chuẩn (140–200 ký tự) và `relatedKeywords` nếu người gửi không cung cấp.
  4. **Blog Image Standardizer:** Chuẩn hóa thông số ảnh bìa (`thumbnailUrl`) và ảnh minh họa về tỷ lệ `16:9` (`1200x675px`), định dạng `webp`, `quality: 82`, tự động điền `imageAlt` từ tiêu đề bài viết nếu thiếu.

### 2.2. Dịch vụ Thay Thực Đơn & Tối ưu hóa Hình ảnh Menu (`MenuOptimizationService` — `src/services/menu-optimization.service.ts`)
- **Hàm cốt lõi:** `optimizeMenuPageAsset(rawAsset, spec)` và `replaceBranchMenu(branchId, rawPages, options)`
- **Tiêu chuẩn Tối ưu hóa Hình ảnh Thực đơn (`STANDARD_MENU_IMAGE_SPEC`):**
  1. **Tỷ lệ chuẩn (`Standard Aspect Ratio`):** Chuẩn hóa mọi trang thực đơn về tỷ lệ dọc **`3:4`** (`aspectRatio = 0.75`). Nếu ảnh gốc lệch tỷ lệ, tự động áp dụng chế độ căn chỉnh `fit: 'contain'` trên nền màu xanh ngọc lục bảo `#0B1F17` để không làm méo chữ hoặc cắt mất giá tiền.
  2. **Kích thước chuẩn 2 tầng (`Standard Dual-Tier Sizes`):**
     - Bản xem lưới (`thumbnail`): **`600 × 800 px`** (ngân sách dung lượng `<= 80 KB`).
     - Bản phóng to đọc chi tiết (`highRes`): **`1600 × 2133 px`** (ngân sách dung lượng `<= 300 KB`).
     - Chặn và cảnh báo nếu ảnh gốc có chiều rộng `< 600 px` (không đủ độ nét cho chữ trên thực đơn).
  3. **Chất lượng chuẩn (`Standard Quality & Format`):** Định dạng đầu ra **`webp`**, chất lượng nén **`quality = 85`**, bật chế độ giữ nét chữ (`sharpText: true`) và xóa sạch EXIF metadata.
  4. **Thay thế Nguyên tử (`Atomic Replacement`):** Cho phép thay toàn bộ cuốn thực đơn của một chi nhánh (`mode: 'full'`) hoặc chỉ thay một phân mục (`mode: 'section'`, ví dụ chỉ thay `drinks` hoặc `promo`), tự động đánh lại số trang liên tục `1..N` và tăng `menuVersion` để PWA làm mới cache.

### 2.3. Tích hợp Workspace Agent Skill (`.agents/skills/lacthai-content-manager/SKILL.md`)
- Tạo sẵn một **Skill nội bộ trong dự án** để bất kỳ khi nào AI Agent nhận yêu cầu bằng tiếng Việt hoặc tiếng Anh (*"Đăng bài blog mới..."*, *"Thay menu chi nhánh Quận 1..."*), AI Agent sẽ tự động kích hoạt quy trình chuẩn hóa này.

## 3. Hệ Quả (Consequences)
- **Tích cực:** Đảm bảo 100% các bài blog mới và các đợt thay thực đơn trong tương lai luôn giữ đúng chuẩn giao diện *Modern Royal Thai Gastronomy*, tốc độ tải nhanh, không bao giờ vỡ khung hình (`CLS = 0`), và toàn bộ logic chuẩn hóa đều được bảo vệ bởi bộ kiểm thử tự động TDD (`>= 90% coverage`).
