# Cấu hình Kênh Nhận Đặt Bàn (Google Sheets & Email)

> **File cấu hình nguồn (Source of Truth):** [`config/reservation-channels.json`](../config/reservation-channels.json)  
> **Cơ chế hoạt động:** Khi chạy lệnh `npm run build`, `npm run dev` hoặc khi **GitHub Actions Deploy**, script [`scripts/sync-env-from-config.ts`](../scripts/sync-env-from-config.ts) sẽ tự động đọc file [`config/reservation-channels.json`](../config/reservation-channels.json) để sinh ra file `.env` chuẩn (`VITE_RESERVATION_*`) cho ứng dụng đọc qua `import.meta.env`.

---

## 1. Bảng Theo Dõi Cấu Hình Hiện Tại

Anh chỉ cần sửa trực tiếp trong file [`config/reservation-channels.json`](../config/reservation-channels.json):

| Hạng mục | Khóa trong `config/reservation-channels.json` | Biến `.env` được sinh tự động khi Deploy | Mô tả |
| :--- | :--- | :--- | :--- |
| **Link Google Sheet** | `googleSheet.spreadsheetUrl` | `VITE_RESERVATION_SHEET_URL` | Đường dẫn mở bảng Google Sheet để dễ tra cứu |
| **Webhook URL (Apps Script)** | `googleSheet.webhookUrl` | `VITE_RESERVATION_WEBHOOK_URL` | URL `https://script.google.com/macros/s/.../exec` nhận dữ liệu đặt bàn |
| **Email Quản lý chung** | `emails.generalManager` | `VITE_RESERVATION_EMAIL_MANAGER` | Nhận thông báo của cả 2 chi nhánh (Mặc định: `info@lacthai.com.vn`) |
| **Email Lễ tân Quận 1** | `emails.branchMacThiBuoi` | `VITE_RESERVATION_EMAIL_MTB` | Nhận thông báo khi khách chọn CN 71/1 Mạc Thị Bưởi |
| **Email Lễ tân Thảo Điền** | `emails.branchXuanThuy` | `VITE_RESERVATION_EMAIL_XT` | Nhận thông báo khi khách chọn CN 48bis Xuân Thủy |
| **Gửi Email xác nhận cho Khách** | `emails.sendGuestConfirmation` | `VITE_RESERVATION_SEND_GUEST_EMAIL` | `true` / `false` — Tự động gửi phiếu xác nhận cho email của khách |
| **Gửi kèm POST `/dat-ban` cũ** | `legacyEndpoint.enableLegacyPost` | `VITE_RESERVATION_ENABLE_LEGACY_POST` | `true` / `false` — Bật khi chạy chung với backend PHP cũ |

---

## 2. Mã Google Apps Script (Đọc Email Động Từ App Gửi Lên)

Vì ứng dụng đã đọc danh sách Email từ `.env` và đính kèm thẳng vào gói tin `payload.recipients`, đoạn mã Google Apps Script trong Google Sheet hoàn toàn **không cần sửa lại mỗi khi anh đổi Email**:

### Hướng dẫn cài đặt 1 lần duy nhất trên Google Sheet:
1. Mở Google Sheet **Sổ Đặt Bàn Lạc Thái** $\rightarrow$ tạo tiêu đề cột ở dòng 1 (`A1:J1`):
   `Thời gian tạo` | `Mã đặt bàn` | `Chi nhánh` | `Họ tên khách` | `Số điện thoại` | `Email khách` | `Ngày đến` | `Giờ đến` | `Số khách` | `Ghi chú`
2. Vào menu **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**, dán đoạn mã sau:

```javascript
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const r = payload.record;
  const subject = payload.subject;
  const recipientsConfig = payload.recipients || {};

  // 1. Ghi dòng mới vào Google Sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    r.createdAtIso,
    r.id,
    r.title,
    r.fullname,
    "'" + r.phone,
    r.email || '',
    r.date,
    r.time,
    r.quantity,
    r.message || '',
  ]);

  // 2. Gửi Email tới Quản lý & Lễ tân chi nhánh (đọc tự động từ cấu hình .env của App)
  const targetEmails = [
    recipientsConfig.managerEmail,
    recipientsConfig.branchEmail,
  ]
    .filter(Boolean)
    .join(',');

  const body = [
    'PHIẾU ĐẶT BÀN MỚI TỪ WEBSITE LACTHAI.VN',
    '----------------------------------------',
    '• Mã đặt bàn: ' + r.id,
    '• Chi nhánh: ' + r.title,
    '• Khách hàng: ' + r.fullname,
    '• Số điện thoại: ' + r.phone,
    '• Email khách: ' + (r.email || 'Không cung cấp'),
    '• Thời gian đến: ' + r.time + ' ngày ' + r.date,
    '• Số lượng khách: ' + r.quantity + ' người',
    '• Ghi chú: ' + (r.message || 'Không có'),
  ].join('\n');

  if (targetEmails) {
    MailApp.sendEmail(targetEmails, subject, body);
  }

  // 3. Gửi Email xác nhận cho khách hàng (nếu bật sendGuestConfirmation và khách có nhập email)
  if (recipientsConfig.sendGuestConfirmation && r.email) {
    MailApp.sendEmail(
      r.email,
      '[Nhà hàng Lạc Thái] Xác nhận yêu cầu đặt bàn ' + r.id,
      'Cảm ơn Quý khách ' +
        r.fullname +
        ' đã đặt bàn tại Nhà hàng Lạc Thái!\n\n' +
        body +
        '\n\nBộ phận Lễ tân (Hotline: ' +
        r.branchHotline +
        ') sẽ liên hệ xác nhận trong ít phút.'
    );
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

3. Bấm **Triển khai (Deploy)** $\rightarrow$ **Tạo mục triển khai mới (New deployment)** $\rightarrow$ chọn **Ứng dụng web (Web app)**:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Copy URL `https://script.google.com/macros/s/.../exec` dán vào trường `"webhookUrl"` trong [`config/reservation-channels.json`](../config/reservation-channels.json) rồi commit/push lên GitHub.

---

## 3. Quy Trình Chuyển Đổi Sang `.env` Khi Deploy

Khi chạy `npm run sync:env` (được tích hợp tự động trong `npm run build` và trong `.github/workflows/deploy.yml`), hệ thống sẽ tạo file `.env` ở thư mục gốc với nội dung:

```dotenv
# Auto-generated from config/reservation-channels.json
VITE_RESERVATION_SHEET_URL="https://docs.google.com/spreadsheets/d/THAY_ID_GOOGLE_SHEET_TAI_DAY/edit"
VITE_RESERVATION_WEBHOOK_URL=""
VITE_RESERVATION_EMAIL_MANAGER="info@lacthai.com.vn"
VITE_RESERVATION_EMAIL_MTB="letan.q1@lacthai.com.vn"
VITE_RESERVATION_EMAIL_XT="letan.thaodien@lacthai.com.vn"
VITE_RESERVATION_SEND_GUEST_EMAIL="true"
VITE_RESERVATION_ENABLE_LEGACY_POST="false"
```
