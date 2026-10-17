# ADR-005: Quy Trình SDD + TDD Nghiêm Ngặt & Cổng Kiểm Soát Chất Lượng >= 90% Real Coverage

- **Mã ADR:** `ADR-005`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `Proposed (Chờ chốt)`
- **Ngày:** `2026-10-17`
- **Liên kết:** `BR v1.0.0` (`NFR-05`), `SA v1.0.0`, `SDD v1.0.0`

---

## 1. Bối Cảnh (Context)
Dự án yêu cầu:
- Phát triển theo phương pháp **SDD (Specification-Driven Development)** và **TDD (Test-Driven Development)**.
- Xây dựng theo mô hình **Agile**: Viết test trước (`Red`) → Viết code (`Green`) → Tối ưu hóa (`Refactor`) và lặp lại cho từng tính năng.
- Độ phủ kiểm thử (**Test Coverage**) phải đạt **>= 90%** trên toàn bộ mã nguồn, đồng thời **nghiêm cấm farm coverage** (viết test giả tạo chỉ để tăng chỉ số phần trăm).

## 2. Quyết Định Kiến Trúc & Quy Trình (Decision)

### 2.1. Công cụ Kiểm thử
- **Test Runner:** `Vitest` (cấu hình môi trường `jsdom`).
- **Component & DOM Testing:** `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom`.
- **Coverage Engine:** `@vitest/coverage-v8` với cấu hình ngưỡng cứng (Hard Thresholds) trong `vite.config.ts`:
  ```typescript
  coverage: {
    provider: 'v8',
    thresholds: {
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
    include: ['src/**/*.{ts,tsx}'],
    exclude: [
      'src/**/*.d.ts',
      'src/**/*.test.{ts,tsx}',
      'src/**/index.ts',      // Barrel exports thuần túy
      'src/domain/models/**', // Pure TypeScript interfaces (không có runtime code)
    ],
  }
  ```

### 2.2. Chính sách Chống Farm Coverage (Anti-Coverage-Farming Policy)
1. **Cấm Snapshot Testing vô nghĩa:** Không dùng `toMatchSnapshot()` để lấy coverage.
2. **Cấm Render-only Tests:** Mọi bài test giao diện bắt buộc phải mô phỏng tương tác người dùng thực tế (`userEvent.click`, `userEvent.type`, `userEvent.selectOptions`) và kiểm chứng kết quả đầu ra trên DOM hoặc trạng thái nghiệp vụ.
3. **Cấm dùng chú thích bỏ qua coverage:** Không sử dụng `/* v8 ignore */` hoặc `/* istanbul ignore */` trong mã nguồn nghiệp vụ.
4. **Kiểm thử đầy đủ các nhánh lỗi (Branch Coverage >= 90%):** Phải viết test cho cả luồng thành công (Happy Path) và các luồng lỗi/ngoại lệ (Validation thất bại, mất mạng Offline, trang 404, tìm kiếm không ra kết quả, đóng/mở bàn phím `Escape`).

## 3. Hệ Quả (Consequences)
- **Tích cực:** Mọi dòng code được viết ra đều có mục đích rõ ràng, bám sát đặc tả `SDD.md` và được bảo vệ bởi bộ kiểm thử tự động thực chất. Nếu bất kỳ chỉ số nào dưới 90%, lệnh kiểm thử sẽ báo lỗi ngay lập tức.
