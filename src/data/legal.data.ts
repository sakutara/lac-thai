export interface LegalDocumentContent {
  id: 'policy' | 'terms';
  route: '/chinh-sach' | '/quy-dinh';
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
}

export const LEGAL_DOCUMENTS: Record<'policy' | 'terms', LegalDocumentContent> = {
  policy: {
    id: 'policy',
    route: '/chinh-sach',
    title: 'Chính sách',
    subtitle: 'Chính sách bảo mật thông tin & Quyền riêng tư của thực khách tại Nhà hàng Lạc Thái',
    lastUpdated: '17/10/2026',
    sections: [
      {
        heading: '1. Mục đích thu thập thông tin đặt bàn',
        paragraphs: [
          'Nhà hàng Lạc Thái thu thập thông tin cá nhân cơ bản (Họ tên, Số điện thoại, Email, Ngày giờ đến, Số lượng khách và Ghi chú) khi Quý khách sử dụng tính năng Đặt bàn trực tuyến tại lacthai.vn nhằm mục đích duy nhất là xác nhận và sắp xếp vị trí bàn chu đáo nhất tại chi nhánh Mạc Thị Bưởi hoặc Xuân Thủy.',
        ],
      },
      {
        heading: '2. Cam kết bảo mật & Lưu trữ dữ liệu',
        paragraphs: [
          'Mọi thông tin đặt bàn của Quý khách được bảo mật tuyệt đối trong hệ thống quản lý lễ tân nội bộ của Nhà hàng Lạc Thái và không bao giờ chia sẻ cho bên thứ ba vì mục đích thương mại.',
          'Ứng dụng PWA hỗ trợ lưu phiếu xác nhận đặt bàn ngay trên thiết bị của Quý khách để thuận tiện tra cứu khi không có kết nối mạng.',
        ],
      },
      {
        heading: '3. Liên hệ hỗ trợ',
        paragraphs: [
          'Mọi thắc mắc về chính sách bảo mật và thông tin đặt bàn, Quý khách vui lòng liên hệ Hotline: 0906 67 82 83 (Chi nhánh Quận 1) hoặc 0909 89 80 64 (Chi nhánh Thảo Điền).',
        ],
      },
    ],
  },
  terms: {
    id: 'terms',
    route: '/quy-dinh',
    title: 'Quy định',
    subtitle: 'Quy định đặt bàn trước, giữ chỗ và phục vụ tại hệ thống Nhà hàng Lạc Thái',
    lastUpdated: '17/10/2026',
    sections: [
      {
        heading: '1. Quy định xác nhận & Giữ bàn',
        paragraphs: [
          'Sau khi Quý khách gửi yêu cầu đặt bàn trên website lacthai.vn, bộ phận Lễ tân của chi nhánh tương ứng sẽ liên hệ xác nhận qua số điện thoại trong khung giờ làm việc (10:00 – 22:00).',
          'Nhà hàng giữ bàn tối đa 15 phút kể từ giờ hẹn. Nếu Quý khách có thay đổi về thời gian hoặc số lượng người, vui lòng báo trước qua Hotline để nhà hàng hỗ trợ sắp xếp tốt nhất.',
        ],
      },
      {
        heading: '2. Quy định đặt tiệc đoàn & Phòng riêng VIP',
        paragraphs: [
          'Đối với các đoàn khách từ 10 người trở lên hoặc có yêu cầu trang trí tiệc sinh nhật, tiệc cưới, phòng riêng VIP, bộ phận sự kiện của Lạc Thái sẽ tư vấn trực tiếp thực đơn Set Menu và chính sách đặt cọc giữ sảnh.',
        ],
      },
    ],
  },
};
