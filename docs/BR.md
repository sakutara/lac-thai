# Business Requirements Document (BR) — Nhà Hàng Lạc Thái Webapp (SPA & PWA)

- **Mã tài liệu:** `DOC-BR-LACTHAI`
- **Phiên bản:** `1.3.0` (Cập nhật chi tiết toàn diện tính năng Đặt bàn: Luồng nghiệp vụ, Công cụ gửi & Nơi nhận kết quả)
- **Ngày cập nhật:** `2026-10-17`
- **Nguồn khảo sát:** Phân tích toàn diện hệ thống trực tuyến [https://lacthai.vn/](https://lacthai.vn/)

---

## 1. Lịch Sử Phiên Bản (Revision History)

| Phiên bản | Ngày | Tác giả | Nội dung thay đổi |
| :--- | :--- | :--- | :--- |
| `1.0.0` | 2026-10-17 | Antigravity AI | Khởi tạo toàn bộ đặc tả yêu cầu nghiệp vụ (BR) dựa trên khảo sát thực tế 100% các trang, tính năng, dữ liệu của `https://lacthai.vn/` và yêu cầu nâng cấp lên SPA + PWA với giao diện mới. |
| `1.1.0` | 2026-10-17 | Antigravity AI (theo yêu cầu của Anh) | 1. Chốt phong cách **Modern Royal Thai Gastronomy** kết hợp bắt buộc hiệu ứng **Parallax Scrolling đa tầng** trên toàn trang (`NFR-03`, `FR-02`, `FR-03`, `FR-05`).<br>2. Bổ sung yêu cầu **Phòng chống DoS/DDoS, Anti-Bot/Spam & Rate Limiting** (`FR-06`, `NFR-06`). |
| `1.2.0` | 2026-10-17 | Antigravity AI (theo yêu cầu của Anh) | 1. Bổ sung **FR-09:** Hệ thống tự động xử lý & chuẩn hóa trang mới khi AI Agent nhận yêu cầu đăng bài Blog mới.<br>2. Bổ sung **FR-10:** Hệ thống tự động xử lý & tối ưu hóa chất lượng hình ảnh khi AI Agent nhận yêu cầu thay Thực đơn (`ratio`, `size`, `quality`). |
| `1.3.0` | 2026-10-17 | Antigravity AI (theo yêu cầu của Anh) | Đặc tả chi tiết hóa toàn diện **FR-06 (Hệ thống Đặt bàn Trực tuyến):** Làm rõ đầy đủ (1) Chi tiết tính năng & hành trình người dùng, (2) Công cụ gửi kết quả đặt bàn, (3) Nơi nhận kết quả đặt bàn (phía Nhà hàng & phía Thực khách), và đồng bộ sang `SA v1.3.0` (Mục 4) & `ADR-009`. |

---

## 2. Tổng Quan Dự Án & Mục Tiêu Nghiệp Vụ (Business Objectives)

### 2.1. Bối cảnh thương hiệu
**Nhà hàng Lạc Thái** (*Since 1999 — Hơn 25 năm phục vụ thực khách*) là thương hiệu nhà hàng ẩm thực Thái Lan cao cấp lâu đời tại Sài Gòn với định vị **"Vị Thái chuẩn cho người sành" / "Best Thai food in Viet Nam"**. Hiện tại, hệ thống vận hành 2 chi nhánh trọng điểm tại TP.HCM:
1. **Chi nhánh Quận 1:** `71/1` (hoặc `71/2`) Mạc Thị Bưởi, Phường Bến Nghé, Quận 1, TP.HCM — Hotline: `0906 67 82 83`.
2. **Chi nhánh Thảo Điền (TP. Thủ Đức):** `48bis` Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP.HCM — Hotline: `0909 89 80 64`.

### 2.2. Mục tiêu của dự án viết lại
1. **Giữ nguyên 100% tính năng và nội dung nghiệp vụ cũ** của `https://lacthai.vn/` (và khắc phục triệt để các điểm gãy như lỗi `/thuc-don` 404).
2. **Thay đổi hoàn toàn giao diện (UI/UX Redesign) với hiệu ứng Parallax đa tầng:** Mang phong cách **Modern Royal Thai Gastronomy** kết hợp hiệu ứng cuộn **Parallax Scrolling** mượt mà.
3. **Chuyển đổi sang kiến trúc SPA & PWA an toàn, chống DoS/DDoS.**
4. **Tự động hóa vận hành bằng AI Agent (AI-Agent-Native Content & Media Pipeline)** cho việc đăng bài Blog mới và thay Thực đơn.

---

## 3. Ma Trận Bảo Toàn Tính Năng Cũ & Bổ Sung Tính Năng Mới (`v1.3.0`)

| Mã đối chiếu | Tính năng / Trang | URL / Phạm vi | Yêu cầu trên hệ thống mới (SPA & PWA) |
| :--- | :--- | :--- | :--- |
| **LP-01** | **Header & Điều hướng đa cấp** | Toàn trang | Sticky Glassmorphism Header + Mobile Drawer Navigation chuẩn PWA. |
| **LP-02** | **Trang chủ (`Home`) + Hiệu ứng Parallax** | `/` | Giữ nguyên 100% thông điệp, 6 món Signature + 8 món Drinks, giá, 6 ảnh Gallery + Lightbox; thiết kế lại với **hiệu ứng cuộn Parallax đa lớp**. |
| **LP-03** | **Về chúng tôi (`About Us`)** | `/ve-chung-toi` | Giữ nguyên nội dung bài viết và thông tin 2 chi nhánh với Parallax Banner. |
| **LP-04** | **Thực đơn Chi nhánh Mạc Thị Bưởi** | `/thuc-don-lac-thai-mac-thi-buoi` | Giữ nguyên 43 trang thực đơn gốc, nâng cấp trình xem E-Menu tương tác (lọc phân mục, phóng to, lưu đệm Offline). |
| **LP-05** | **Thực đơn Chi nhánh Xuân Thủy** | `/thuc-don-lac-thai-xuan-thuy` | Giữ nguyên 54 trang thực đơn gốc chi nhánh Xuân Thủy với trình xem E-Menu tương tác. |
| **LP-06** | **Trang tổng hợp Thực đơn (`/thuc-don`)** | `/thuc-don` | Khắc phục lỗi 404 của web cũ: Xây dựng trang Hub Thực Đơn chọn nhanh chi nhánh và tìm kiếm món ăn. |
| **LP-07** | **Không gian Chi nhánh Mạc Thị Bưởi** | `/khong-gian-lac-thai-mac-thi-buoi` | Giữ nguyên 5 ảnh không gian Quận 1 + Parallax Showcase + Lightbox + CTA Đặt bàn tại Quận 1. |
| **LP-08** | **Không gian Chi nhánh Xuân Thủy - Thảo Điền** | `/khong-gian-lac-thai-xuan-thuy-thao-dien` | Giữ nguyên 10 ảnh HDR không gian Thảo Điền + Parallax Lookbook + Lightbox + CTA Đặt bàn tại Thảo Điền. |
| **LP-09** | **Đặt bàn (`Reservation`)** | `/dat-ban` | **Đặc tả chi tiết tại `FR-06` bên dưới và Mục 4 của `docs/SA.md`:** 8 trường dữ liệu, lưu nháp tự động, bản đồ động theo chi nhánh, 4 lớp chống Spam/DoS, công cụ gửi đa kênh và nơi nhận kết quả rõ ràng. |
| **LP-10** | **Danh sách Blog / Tin tức (`Blog Listing`)** | `/blog` | Giữ nguyên 15 bài viết hiện có, tự động phân trang (`?page=1..N` với 6 bài/trang), tìm kiếm tức thì. |
| **LP-11** | **Chi tiết bài viết Tin tức (`Blog Detail`)** | `/tin-tuc/:slug` | Giữ nguyên 100% URL slug của các bài viết cũ và tự động phục vụ mọi trang `/tin-tuc/:slug` mới. |
| **LP-12** | **Liên hệ (`Contact`)** | `/lien-he` | Thông tin liên hệ 2 chi nhánh, nút gọi nhanh (`tel:`), chỉ đường Google Maps và liên kết đặt bàn nhanh. |
| **LP-13** | **Chính sách & Quy định (`Legal Pages`)** | `/chinh-sach`, `/quy-dinh` | Giữ nguyên đầy đủ 2 route `/chinh-sach` và `/quy-dinh`. |
| **LP-14** | **Tiện ích toàn cục & Tích hợp bên thứ ba** | Toàn trang | Giữ nguyên GTM (`GTM-WDNLDMWF`), Google Ads Conversion (`AW-11425296834`), Facebook Chat (`482323218545316`) và nút Back-to-top. |
| **NEW-15** | **AI Agent — Tự động chuẩn hóa & đăng bài Blog mới** | Pipeline & Runtime (`FR-09`) | Tự động chuẩn hóa nội dung thô thành bài viết chuẩn Lạc Thái (slug, ngày, đoạn trích, từ khóa, ảnh 16:9 WebP). |
| **NEW-16** | **AI Agent — Tự động thay Thực đơn & tối ưu hóa ảnh Menu** | Pipeline & Runtime (`FR-10`) | Tự động chuẩn hóa ảnh thực đơn (`ratio 3:4`, `size 1600x2133 & 600x800`, `quality 85% WebP`) và thay thế nguyên tử theo chi nhánh. |

---

## 4. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements & Acceptance Criteria)

### FR-01: Hệ thống Điều hướng Toàn cục & Đa nền tảng (Global Navigation & App Shell)
- Cung cấp Header, Footer, Mobile Navigation Drawer, nút gọi Hotline nhanh (`0906 67 82 83`), nút Chat/Messenger và nút Scroll-to-Top xuyên suốt ứng dụng SPA.

### FR-02: Trang Chủ với Trải Nghiệm Parallax Đa Tầng (Home Parallax Experience & Featured Menu)
- Truyền tải đẳng cấp thương hiệu Lạc Thái ("Since 1999 - Hơn 25 năm phục vụ thực khách", "Make food, not war") qua bố cục **Parallax Scrolling đa lớp**, 6 món Signature, 8 món Drinks và 6 ảnh Gallery có Lightbox.

### FR-03: Trang Về Chúng Tôi (`/ve-chung-toi`)
- Giới thiệu câu chuyện thương hiệu Lạc Thái, triết lý ẩm thực và hệ thống 2 chi nhánh với bố cục Parallax Storytelling.

### FR-04: Hệ Thống Thực Đơn Đa Chi Nhánh (`/thuc-don`, `/thuc-don-lac-thai-mac-thi-buoi`, `/thuc-don-lac-thai-xuan-thuy`)
- Cho phép thực khách xem toàn bộ thực đơn chi tiết theo từng chi nhánh (43 trang Mạc Thị Bưởi, 54 trang Xuân Thủy) và tra cứu nhanh tại `/thuc-don`.

### FR-05: Không Gian Nhà Hàng Theo Chi Nhánh (`/khong-gian-lac-thai-mac-thi-buoi`, `/khong-gian-lac-thai-xuan-thuy-thao-dien`)
- Trình diễn hình ảnh không gian kiến trúc trong nhà và sân vườn của từng chi nhánh với hiệu ứng Parallax Lookbook và CTA đặt bàn chọn sẵn chi nhánh (`/dat-ban?branch=...`).

---

### FR-06: Hệ Thống Đặt Bàn Trực Tuyến Toàn Diện — Chi Tiết Tính Năng, Công Cụ Gửi & Nơi Nhận Kết Quả (`/dat-ban`)

> **Tham chiếu Kiến trúc & Đặc tả kỹ thuật:** Được thiết kế chi tiết tại **[Mục 4 của `docs/SA.md`](./SA.md)**, **[Mục 1.5 & 2.3 của `docs/SDD.md`](./SDD.md)** và **[`docs/adr/ADR-009-reservation-delivery-and-notification-architecture.md`](./adr/ADR-009-reservation-delivery-and-notification-architecture.md)**.

#### 6.1. Chi Tiết Tính Năng & Hành Trình Thực Khách (Feature Details & User Journey)
1. **Điểm truy cập vào trang Đặt bàn (`/dat-ban`):**
   - Nhấn từ thanh Menu chính (`Đặt bàn`), nút CTA trên Trang chủ (`/`), Footer, hoặc từ nút *"Đặt bàn tại chi nhánh này"* trên trang Không gian / Thực đơn của từng chi nhánh (hỗ trợ tham số `?branch=mac-thi-buoi` hoặc `?branch=xuan-thuy` để tự động chọn sẵn chi nhánh).
2. **8 Trường dữ liệu đặt bàn (Bảo toàn 100% cấu trúc `ContactForm` cũ & nâng cấp UX):**
   - `fullname` (**Họ tên** — Bắt buộc, 2–100 ký tự).
   - `email` (**Email** — Tùy chọn; nếu khách nhập email hợp lệ, hệ thống dùng để gửi thư xác nhận đặt bàn cho khách).
   - `phone` (**Điện thoại** — Bắt buộc, chuẩn số điện thoại Việt Nam `09xxxxxxxx` / `+849xxxxxxxx`).
   - `title` (**Chi nhánh đặt bàn** — Bắt buộc):
     - Tùy chọn 1: `71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM` (Hotline chi nhánh: `0906 67 82 83`)
     - Tùy chọn 2: `48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM` (Hotline chi nhánh: `0909 89 80 64`)
     - *Hành vi động:* Khi khách chuyển đổi chi nhánh trong ô chọn, **Bản đồ Google Maps nhúng**, **Địa chỉ** và **Số Hotline trực tiếp** bên cạnh biểu mẫu sẽ tự động chuyển sang đúng chi nhánh đó.
   - `date` (**Ngày đến** — Bắt buộc, định dạng `YYYY-MM-DD`, mặc định gợi ý ngày hôm nay, chặn chọn ngày trong quá khứ).
   - `time` (**Giờ đến** — Bắt buộc, nằm trong khung giờ phục vụ `10:00` – `22:00`, có các nút chọn nhanh khung giờ phổ biến như Trưa `11:30`, `12:00`, `12:30` và Tối `18:00`, `19:00`, `19:30`, `20:00`).
   - `quantity` (**Số lượng khách** — Bắt buộc, số nguyên từ `1` đến `200`, có nút cộng/trừ nhanh và chọn nhanh `2 người`, `4 người`, `6 người`, `Tiệc > 10 người`).
   - `message` (**Ghi chú đặc biệt** — Tùy chọn, tối đa 500 ký tự, kèm các thẻ gợi ý chạm nhanh: *"Khu vực sân vườn"*, *"Phòng riêng yên tĩnh"*, *"Cần ghế trẻ em"*, *"Trang trí sinh nhật / kỷ niệm"*, *"Ăn chay / Dị ứng thực phẩm"*).
3. **Tự động lưu nháp (`Auto-Save Form Draft`):**
   - Trong lúc điền dở form, nếu khách chuyển sang trang `/thuc-don` để xem lại món ăn rồi quay lại `/dat-ban`, toàn bộ thông tin đã nhập được khôi phục tự động từ `sessionStorage`.
4. **Cơ chế Bảo vệ Chống Bot / Spam / DoS (4 lớp):**
   - Kiểm tra trường ẩn Honeypot (`_hp_website`), thời gian mở form tối thiểu (`>= 1.5s`), chống gửi trùng lặp cùng SĐT + Chi nhánh + Ngày + Giờ trong 10 phút (`Idempotency Key`), và giới hạn tần suất tối đa `3 đơn / 15 phút` + `Cooldown 30 giây`.

#### 6.2. Công Cụ Để Gửi Kết Quả Đặt Bàn (`Delivery Tools / Transport Mechanism`)
Khi thực khách nhấn nút **`GỬI NGAY`** và dữ liệu vượt qua tầng kiểm tra hợp lệ + chống Spam, **`ReservationTransportService`** sử dụng kiến trúc **Multi-Adapter Dispatcher** để gửi dữ liệu đi:
1. **Công cụ 1 — Webhook / Serverless API Dispatcher (Khuyên dùng cho SPA/PWA):**
   - Ứng dụng gửi gói tin HTTPS `POST` (định dạng JSON chuẩn hóa kèm mã đơn `#LT-xxxxxx`) tới Endpoint nhận đơn cấu hình qua biến môi trường (`VITE_RESERVATION_WEBHOOK_URL` / Serverless Function `/api/reservations`).
   - Hỗ trợ kết nối trực tiếp tới:
     - **Google Apps Script Web App Webhook** (để ghi thẳng vào Google Sheets).
     - **Email Delivery API** (Web3Forms / EmailJS / Resend Worker) để gửi email thông báo.
     - **Telegram Bot / Zalo Webhook** để bắn tin nhắn tức thì cho lễ tân.
2. **Công cụ 2 — Legacy Form POST Adapter (Tương thích ngược 100% server cũ):**
   - Đóng gói dữ liệu dưới dạng `FormData` / `application/x-www-form-urlencoded` với đúng tên trường `ContactForm[fullname]`, `ContactForm[email]`, `ContactForm[phone]`, `ContactForm[title]`, `ContactForm[date]`, `ContactForm[time]`, `ContactForm[quantity]`, `ContactForm[message]` gửi tới `POST /dat-ban`.
3. **Công cụ 3 — Hàng đợi Ngoại tuyến (`Bounded Offline Queue` + `Background Sync`):**
   - Nếu khách nhấn `GỬI NGAY` khi mất mạng (Offline) hoặc mạng chập chờn, yêu cầu được lưu an toàn vào `localStorage` (`lacthai_offline_reservation_queue`, tối đa 5 đơn) và **tự động gửi đi ngay khi thiết bị có mạng trở lại** (`window 'online'` event).

#### 6.3. Nơi Nhận Kết Quả Đặt Bàn (`Where Results Are Received`)
Kết quả đặt bàn được chuyển tới **2 phía nhận rõ ràng**:
1. **Nơi nhận phía Nhà hàng Lạc Thái (Bộ phận Lễ tân & Quản lý):**
   - **Đích nhận A — Hộp thư Email của Nhà hàng / Chi nhánh:** Nhận email thông báo chi tiết đơn đặt bàn với tiêu đề chuẩn `[ĐẶT BÀN MỚI - CN Mạc Thị Bưởi] Nguyễn Văn A - 4 khách - 19:00 20/10/2026`, trong nội dung email có nút bấm gọi điện xác nhận ngay (`tel:09...`).
   - **Đích nhận B — Sổ Đặt Bàn Trực Tuyến (Google Sheets của Nhà hàng):** Tự động chèn 1 dòng mới gồm đầy đủ: *Mã đặt bàn, Thời gian gửi, Chi nhánh (Q1 / Thảo Điền), Họ tên, Số điện thoại, Email, Ngày đến, Giờ đến, Số lượng khách, Ghi chú, Trạng thái xử lý*.
   - **Đích nhận C — Tin nhắn Thông báo Tức thì (Telegram / Zalo Lễ tân):** Bắn thông báo real-time tới nhóm lễ tân của đúng chi nhánh được chọn để nhân viên gọi xác nhận cho khách trong vòng 5–15 phút.
2. **Nơi nhận phía Thực khách (Ngay trên ứng dụng SPA/PWA):**
   - **Màn hình Phiếu Xác Nhận Đặt Bàn (`ReservationSuccessModal`):** Hiển thị ngay Mã đặt bàn (`#LT-xxxxxx`), toàn bộ thông tin đã đặt, nút **Tải lịch hẹn (`.ics` / Google Calendar)** và nút gọi nhanh Hotline chi nhánh (`0906 67 82 83` hoặc `0909 89 80 64`).
   - **Mục "Lịch sử Đặt bàn của tôi" ngay trên trang `/dat-ban` (Lưu trên thiết bị PWA):** Giúp khách mở điện thoại đưa mã đặt bàn cho lễ tân xem ngay cả khi không có mạng.
   - **Hệ thống Đo lường Quảng cáo (`Google Ads Conversion`):** Tự động kích hoạt sự kiện `gtag_report_conversion` (`AW-11425296834/Z7U8CJ-hi_wYEMLjgMgq`) giống hệt trang cũ.

- **Acceptance Criteria cho FR-06 (Gherkin):**
  - **AC-FR06-1 (Validation & Dynamic Branch Map):** Khi người dùng đổi chi nhánh giữa Mạc Thị Bưởi và Xuân Thủy, bản đồ và hotline cập nhật tương ứng; nếu bỏ trống trường bắt buộc hoặc nhập sai SĐT/Email/Ngày quá khứ, hiển thị lỗi tiếng Việt rõ ràng.
  - **AC-FR06-2 (Multi-Channel Delivery & Receipt):** Khi gửi form hợp lệ lúc Online, `ReservationService` gửi dữ liệu qua `ReservationTransportService` tới nơi nhận của nhà hàng, kích hoạt Google Ads Conversion, lưu phiếu đặt bàn vào lịch sử trên máy khách và hiển thị Modal xác nhận kèm mã `#LT-xxxxxx`.
  - **AC-FR06-3 (Anti-Spam/DoS & Offline Queue):** Chặn đứng các trường hợp Honeypot, gửi quá nhanh (`< 1.5s`), gửi trùng trong 10 phút, hoặc vượt quá 3 lần/15 phút; nếu đang Offline thì lưu vào hàng đợi và tự động gửi khi có mạng lại.

---

### FR-07: Hệ Thống Blog / Tin Tức & Chi Tiết Bài Viết (`/blog`, `/tin-tuc/:slug`)
- Bảo toàn 15 bài viết hiện có và hỗ trợ không giới hạn các bài viết mới được AI Agent đăng thêm, phân trang 6 bài/trang.

### FR-08: Trang Liên Hệ (`/lien-he`) & Trang Pháp Lý (`/chinh-sach`, `/quy-dinh`)
- Cung cấp thông tin liên hệ chính thức của 2 chi nhánh Lạc Thái cùng các quy định, chính sách.

### FR-09: Hệ Thống Tự Xử Lý & Chuẩn Hóa Trang Mới Khi AI Agent Nhận Yêu Cầu Đăng Bài Blog Mới
- Tự động chuẩn hóa `slug` tiếng Việt, ngày đăng (`DD/MM/YYYY` & `YYYY-MM-DD`), khối nội dung (`heading`, `paragraph`, `image`), đoạn trích (`excerpt`), từ khóa liên quan và thông số ảnh bài viết (`16:9`, `1200x675`, `quality: 82%`, `webp`).

### FR-10: Hệ Thống Tự Xử Lý Thay Thực Đơn & Tối Ưu Hóa Chất Lượng Hình Ảnh Menu
- Tự động chuẩn hóa ảnh thực đơn về tỷ lệ `3:4`, kích thước 2 tầng (`600x800` & `1600x2133`), chất lượng `85% WebP` và thay thế thực đơn nguyên tử theo chi nhánh.

---

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements — NFR)

- **NFR-01:** Kiến trúc SPA (Client-side Routing, Deep Linking, Dynamic SEO Meta).
- **NFR-02:** Kiến trúc PWA chuẩn mực (Manifest, Service Worker Precache & Runtime Cache, Offline Queue).
- **NFR-03:** Giao diện *Modern Royal Thai Gastronomy* kết hợp hiệu ứng **Parallax 60fps** (`translate3d` & `prefers-reduced-motion`).
- **NFR-04:** Hiệu năng Core Web Vitals (`LCP < 2.0s`, `INP < 100ms`, `CLS < 0.05`).
- **NFR-05:** SDD + TDD nghiêm ngặt, **Test Coverage >= 90%** thực chất trên cả 4 chỉ số, không farm coverage.
- **NFR-06:** Phòng chống DoS/DDoS & Anti-Bot 4 lớp.
- **NFR-07:** Kiến trúc AI-Agent-Native kèm CLI Scripts & Workspace Agent Skill.
