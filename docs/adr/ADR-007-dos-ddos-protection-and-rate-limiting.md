# ADR-007: Kiến Trúc Phòng Chống Tấn Công DoS/DDoS & Bảo Vệ Luồng Đặt Bàn Client-Side

- **Mã ADR:** `ADR-007`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Accepted (Đã chốt theo phản hồi của Anh)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.1.0` (`FR-06`, `NFR-06`), `SA v1.1.0`, bổ sung cho [`ADR-004`](./ADR-004-data-and-reservation-backend-strategy.md)

---

## 1. Bối Cảnh (Context)
Khi xem xét phương án kiến trúc dữ liệu tại [`ADR-004`](./ADR-004-data-and-reservation-backend-strategy.md) (xử lý Client-side SPA/PWA kết hợp gửi POST `/dat-ban`), Anh đã đặt vấn đề rất xác đáng: **"Cân nhắc lại việc xử lý client-side có dễ xảy ra tình trạng DoS/DDoS không. Nếu không thì theo hướng 1."**

## 2. Phân Tích Rủi Ro DoS/DDoS (Risk Assessment)

1. **Đối với luồng đọc nội dung (99% lưu lượng truy cập: Trang chủ, Thực đơn, Không gian, Blog, Liên hệ):**
   - Trong kiến trúc PHP 5.6 cũ, mỗi lượt truy cập đều buộc máy chủ gốc (Origin Server) phải thực thi mã PHP. Nếu bị tấn công HTTP GET Flood, CPU/RAM của máy chủ sẽ nhanh chóng cạn kiệt.
   - Trong kiến trúc **Client-side SPA + PWA (`Hướng 1`)**:
     - Toàn bộ mã nguồn và dữ liệu nội dung là **tệp tĩnh (Static Assets)** được phân phối trực tiếp bởi **CDN Edge** (Cloudflare / Vercel / Nginx Static) và được lưu đệm ngay trên trình duyệt của khách qua **Service Worker**.
     - Khi người dùng chuyển qua lại giữa 13 trang hoặc xem lại thực đơn, **số lượng request gửi về máy chủ gốc bằng 0**.
     - Do đó, đối với luồng đọc, kiến trúc Client-side SPA/PWA **chống chịu DoS/DDoS tốt hơn vượt trội** so với web động truyền thống.

2. **Đối với luồng ghi dữ liệu (`POST /dat-ban` và `Offline Queue`):**
   - Rủi ro duy nhất nằm ở việc kẻ xấu hoặc bot tự động lợi dụng form Đặt bàn để bắn hàng loạt request `POST /dat-ban` (Form Spamming / L7 POST Flood), hoặc người dùng nhấn liên tục nút `GỬI NGAY`, hoặc `Offline Queue` bị nhồi nhét hàng nghìn bản ghi rồi xả đồng loạt khi có mạng trở lại.

## 3. Quyết Định Kiến Trúc (Decision)

Giữ **Hướng 1 (Client-side SPA/PWA + Adapter `/dat-ban`)** và bổ sung **Cơ chế Phòng vệ Đa lớp (4-Layer Defense-in-Depth)** thông qua `SecurityGuardService` (`src/services/security-guard.service.ts`) và cấu hình Edge:

1. **Lớp 1 — Chống Bot Tự Động tại Client (`Honeypot + Minimum Fill-Time Guard`):**
   - Bổ sung trường ẩn `honeypot` (`_hp_website`). Nếu bị điền bởi bot → chặn ngay lập tức tại Client (0 network request).
   - Đo thời gian từ lúc mở form tới lúc nhấn gửi (`formOpenedAtMs`). Nếu `< 1.5 giây` → nhận diện là script tự động và từ chối ngay.
2. **Lớp 2 — Chống Gửi Trùng Lặp (`Idempotency Key Deduplication`):**
   - Tạo mã băm định danh `idempotencyKey = phone + '|' + branch + '|' + date + '|' + time`.
   - Chặn mọi nỗ lực gửi trùng cùng một lịch đặt bàn trong vòng **10 phút**.
3. **Lớp 3 — Giới Hạn Tần Suất Trượt & Hàng Đợi Có Trần (`Sliding-Window Rate Limit & Bounded Offline Queue`):**
   - **Cooldown:** Khóa nút gửi khi đang xử lý và bắt buộc nghỉ **30 giây** giữa 2 lần đặt bàn.
   - **Rate Limit:** Tối đa **3 yêu cầu đặt bàn / 15 phút** trên một thiết bị.
   - **Bounded Offline Queue:** Giới hạn tối đa **5 bản ghi** trong hàng đợi ngoại tuyến; khi có mạng trở lại, đồng bộ tuần tự kèm độ trễ tăng dần (**Exponential Backoff**) để không bao giờ gây nghẽn máy chủ.
4. **Lớp 4 — Bảo Vệ Tầng Biên (`Edge WAF / Nginx Rate Limiting`):**
   - Cung cấp cấu hình chuẩn cho Nginx / Cloudflare WAF áp dụng `limit_req` cho endpoint `POST /dat-ban` theo địa chỉ IP.

## 4. Hệ Quả (Consequences)
- **Tích cực:** Giữ được sự gọn nhẹ, tốc độ 0ms và khả năng hoạt động Offline 100% của Hướng 1, đồng thời khóa chặt các lỗ hổng Spam / Flood / DoS trên luồng Đặt bàn.
