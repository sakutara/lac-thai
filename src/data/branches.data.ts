import { Branch } from '../domain/models';

export const BRANCHES: Branch[] = [
  {
    id: 'mac-thi-buoi',
    name: 'Chi nhánh Mạc Thị Bưởi - HCM',
    shortName: 'Mạc Thị Bưởi (Quận 1)',
    address: '71/1 Mạc Thị Bưởi, Phường Bến Nghé, Quận 1, TP.HCM',
    legacyContactAddress: '71/2 Mạc Thị Bưởi, Bến Nghé, quận 1',
    reservationOptionValue: '71/1 Mạc Thị Bưởi, Bến Nghé, Q1, HCM',
    hotline: '0906 67 82 83',
    hotlineTel: '0906678283',
    openingHours: '10:00 - 22:00 (Thứ Hai - Chủ Nhật)',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.481868303814!2d106.70218491542254!3d10.77435759232298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46ed624351%3A0x926e0ee982909f3e!2zTmjDoCBow6BuZyBM4bqhYyBUaMOhaQ!5e0!3m2!1svi!2sus!4v1658254207470!5m2!1svi!2sus',
    menuRoute: '/thuc-don-lac-thai-mac-thi-buoi',
    spaceRoute: '/khong-gian-lac-thai-mac-thi-buoi',
    highlights: [
      'Không gian kiến trúc Thái cổ điển giao thoa đương đại ngay trung tâm Quận 1',
      'Phòng VIP sang trọng, ấm cúng cho tiếp khách đối tác và họp mặt gia đình',
      'Đầu bếp người Thái hơn 20 năm kinh nghiệm trực tiếp đứng bếp',
    ],
  },
  {
    id: 'xuan-thuy',
    name: 'Chi nhánh Xuân Thuỷ - HCM',
    shortName: 'Xuân Thủy (Thảo Điền)',
    address: '48bis Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP.HCM',
    legacyContactAddress: '48bis Xuân Thuỷ, Thảo Điền, Thủ Đức',
    reservationOptionValue: '48bis Xuân Thủy, Thảo Điền, TP Thủ Đức, HCM',
    hotline: '0909 89 80 64',
    hotlineTel: '0909898064',
    openingHours: '10:00 - 22:00 (Thứ Hai - Chủ Nhật)',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.092857321891!2d106.731884!3d10.804198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317526199142c5c5%3A0x926e0ee982909f3e!2zNDhiaXMgWHXDom4gVGjhu6d5LCBUaOG6o28gxJBp4buBbiwgVGjhu6cgxJDhu6lj!5e0!3m2!1svi!2sus!4v1700000000000!5m2!1svi!2sus',
    menuRoute: '/thuc-don-lac-thai-xuan-thuy',
    spaceRoute: '/khong-gian-lac-thai-xuan-thuy-thao-dien',
    highlights: [
      'Nhà hàng Thái có không gian sân vườn nhiệt đới lớn nhất tại Thảo Điền',
      'Địa điểm hoàn hảo cho tiệc cưới ngoài trời, tiệc công ty & lễ hội Songkran',
      'Khu vực bàn trong nhà sang trọng và sân vườn lung linh dưới ánh đèn lồng',
    ],
  },
];

export const BRAND_INFO = {
  name: 'Nhà hàng Lạc Thái',
  taglineVi: 'Vị Thái chuẩn cho người sành',
  taglineEn: 'Best Thai food in Viet Nam',
  establishedYear: 1999,
  heritageBadge: 'Since 1999 — Hơn 25 năm phục vụ thực khách',
  philosophyQuote: 'Make food, not war',
  heroQuoteVi:
    'Một kho báu tiềm ẩn của Sài Gòn, Lạc Thái đem đến những món ăn Thái chuẩn vị trong không gian sang trọng, ấm cúng.',
  heroQuoteEn:
    "One of Saigon's hidden treasures, Lac Thai serves excellent Thai food in a truly gorgeous atmosphere.",
  primaryHotline: '0906 67 82 83',
  primaryHotlineTel: '0906678283',
  facebookUrl: 'https://www.facebook.com/lacthaiSG',
  instagramUrl: 'https://www.instagram.com/lacthai.vn/',
  facebookPageId: '482323218545316',
  gtmId: 'GTM-WDNLDMWF',
  googleAdsId: 'AW-11425296834',
  googleAdsConversionSendTo: 'AW-11425296834/Z7U8CJ-hi_wYEMLjgMgq',
  aboutParagraphs: [
    'Mê ẩm thực Thái Lan là trót mê sự hòa trộn tinh tế của thảo dược, gia vị, nguyên liệu tươi ngon và phong cách chế biến đặc trưng.',
    'Sành vị Thái nằm ở sự am hiểu sâu rộng, cảm quan và cảm nhận tinh tế cùng một chút khó tính trong khẩu vị, từ khâu chọn nguyên liệu sạch, tươi, được chế biến tỉ mỉ bởi đầu bếp Thái cho đến sự hoàn mỹ trong hình thức và hương vị.',
    'Người Sài Gòn sành ẩm thực Thái luôn chọn Lạc Thái để thưởng thức trọn vẹn văn hóa Xứ sở Chùa Vàng bởi đến Lạc Thái là đến với không gian, kiến trúc đậm chất nghệ thuật, được đắm chìm vào mỹ vị đa dạng, đậm đà và tròn trịa do chính tay đầu bếp người Thái chế biến, trình bày.',
    'Lạc Thái còn là điểm đến hoàn hảo cho những buổi tụ họp gia đình, cuộc gặp gỡ bạn bè, hẹn hò lãng mạn của những cặp đôi hay cho những bữa tiệc giao lưu quan trọng.',
    'Đến ngay Lạc Thái để trải nghiệm trọn vẹn sức hấp dẫn riêng biệt của ẩm thực chuẩn vị Thái!',
  ],
};
