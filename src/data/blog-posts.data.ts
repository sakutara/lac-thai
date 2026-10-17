import { BlogPost } from '../domain/models';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'nha-hang-thai-nao-co-khong-khi-le-hoi-songkran-tot-nhat-o-sai-gon',
    title: 'Nhà hàng Thái nào có không khí lễ hội Songkran tốt nhất ở Sài Gòn?',
    publishedDate: '27/03/2026',
    publishedIso: '2026-03-27',
    excerpt:
      'Lễ hội Songkran – Tết cổ truyền của người Thái – không chỉ là những màn té nước sôi động mà còn là dịp để gia đình, bạn bè quây quần bên những mâm cơm nồng nàn hương vị xứ Chùa Vàng. Giữa lòng Sài Gòn nhộn nhịp, nếu bạn đang tìm kiếm một "tiểu Bangkok" thu nhỏ để tận hưởng trọn vẹn tinh thần Songkran, Lạc Thái chính là câu trả lời hoàn hảo nhất.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/image-20260327132619-1.jpeg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Lễ hội Songkran – Tết cổ truyền của người Thái – không chỉ là những màn té nước sôi động mà còn là dịp để gia đình, bạn bè quây quần bên những mâm cơm nồng nàn hương vị xứ Chùa Vàng. Giữa lòng Sài Gòn nhộn nhịp, nếu bạn đang tìm kiếm một "tiểu Bangkok" thu nhỏ để tận hưởng trọn vẹn tinh thần Songkran, Lạc Thái chính là câu trả lời hoàn hảo nhất.',
      },
      {
        type: 'image',
        imageUrl: 'https://lacthai.vn/www/uploads/images/image-20260327132619-1.jpeg',
        imageAlt: 'Không khí lễ hội Songkran rộn ràng tại nhà hàng Lạc Thái Sài Gòn',
      },
      {
        type: 'paragraph',
        text: 'Tại cả hai chi nhánh 71/1 Mạc Thị Bưởi (Quận 1) và 48bis Xuân Thủy (Thảo Điền), thực khách sẽ được đắm mình trong không gian trang hoàng đậm sắc màu văn hóa Thái Lan cùng thực đơn lễ hội đặc sắc do chính đầu bếp người Thái hơn 20 năm kinh nghiệm chuẩn bị.',
      },
    ],
    relatedKeywords: [
      'Lễ hội Songkran Sài Gòn',
      'Nhà hàng Thái chuẩn vị',
      'Lạc Thái Thảo Điền',
      'Tết cổ truyền Thái Lan',
    ],
  },
  {
    id: 'post-2',
    slug: 'menu-tiec-cuoi-lac-thai-sai-gon-am-thuc-thai-lan-doc-dao-cho-ngay-vui-hoan-hao',
    title: 'Menu Tiệc Cưới Lạc Thái Sài Gòn - Ẩm Thực Thái Lan Độc Đáo Cho Ngày Vui Hoàn Hảo',
    publishedDate: '06/10/2025',
    publishedIso: '2025-10-06',
    excerpt:
      'Lạc Thái nổi bật với hai khu vực chính: không gian trong nhà tinh tế và sân vườn xanh tươi, lý tưởng cho tiệc cưới ngoài trời dưới ánh đèn lung linh. Thiết kế kết hợp truyền thống Thái Lan và hiện đại, tạo nên bầu không khí ấm cúng, riêng tư – hoàn hảo cho tiệc cưới thân mật hoặc quy mô lớn.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/TOM_7569-HDR%20copy(1).jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Lạc Thái nổi bật với hai khu vực chính: không gian trong nhà tinh tế và sân vườn xanh tươi, lý tưởng cho tiệc cưới ngoài trời dưới ánh đèn lung linh. Thiết kế kết hợp truyền thống Thái Lan và hiện đại, tạo nên bầu không khí ấm cúng, riêng tư – hoàn hảo cho tiệc cưới thân mật hoặc quy mô lớn.',
      },
      {
        type: 'image',
        imageUrl: 'https://lacthai.vn/www/uploads/images/TOM_7569-HDR%20copy(1).jpg',
        imageAlt: 'Không gian tiệc cưới sân vườn lung linh tại Lạc Thái',
      },
      {
        type: 'paragraph',
        text: 'Thực đơn tiệc cưới tại Lạc Thái được thiết kế riêng biệt, kết hợp hài hòa giữa các món khai vị thanh tao như Gỏi Cá Trê Chiên Xù, Gà Cuộn Lá Dứa, các món chính đậm đà như Cà Ri Xanh Tôm Càng, Cá Chẽm Sốt Xoài và tráng miệng Xôi Xoài truyền thống.',
      },
    ],
    relatedKeywords: [
      'Menu tiệc cưới Thái Lan',
      'Tiệc cưới sân vườn Sài Gòn',
      'Nhà hàng tiệc cưới Thảo Điền',
      'Lạc Thái Sài Gòn',
    ],
  },
  {
    id: 'post-3',
    slug: 'tiec-cuoi-cao-cap-tai-thao-dien',
    title: 'Tiệc Cưới Cao Cấp Tại Thảo Điền',
    publishedDate: '31/03/2025',
    publishedIso: '2025-03-31',
    excerpt:
      'Nhà hàng Lạc Thái - 48bis Xuân Thủy là địa điểm tổ chức tiệc cưới lý tưởng với không gian cao cấp, sân vườn xanh mát và phong cách ẩm thực Thái chuẩn vị. Thực đơn đa dạng, dịch vụ chuyên nghiệp và vị trí thuận tiện giúp tạo nên một ngày cưới trọn vẹn. Liên hệ ngay để đặt tiệc!',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/472713610_1180064604129028_2555607006823821743_n.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Nhà hàng Lạc Thái - 48bis Xuân Thủy là địa điểm tổ chức tiệc cưới lý tưởng với không gian cao cấp, sân vườn xanh mát và phong cách ẩm thực Thái chuẩn vị. Thực đơn đa dạng, dịch vụ chuyên nghiệp và vị trí thuận tiện giúp tạo nên một ngày cưới trọn vẹn.',
      },
      {
        type: 'image',
        imageUrl: 'https://lacthai.vn/www/uploads/images/472713610_1180064604129028_2555607006823821743_n.jpg',
        imageAlt: 'Tiệc cưới cao cấp tại Lạc Thái Thảo Điền',
      },
    ],
    relatedKeywords: [
      'Tiệc cưới cao cấp Thảo Điền',
      'Nhà hàng sân vườn Quận 2',
      '48bis Xuân Thủy',
    ],
  },
  {
    id: 'post-4',
    slug: 'top-5-nha-hang-noi-bat-tai-xuan-thuy-thao-dien-ban-khong-nen-bo-lo',
    title: 'Top 5 nhà hàng nổi bật tại Xuân Thủy, Thảo Điền bạn không nên bỏ lỡ',
    publishedDate: '16/01/2025',
    publishedIso: '2025-01-16',
    excerpt:
      'Khu vực Thảo Điền, đặc biệt là tuyến đường Xuân Thủy, là địa điểm quy tụ nhiều nhà hàng cao cấp và độc đáo, mang đến những trải nghiệm ẩm thực đặc sắc. Dưới đây là danh sách top 5 nhà hàng tại Xuân Thủy, Thảo Điền mà bạn nên thử qua.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/TOM_7731-HDR%20copy.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Khu vực Thảo Điền, đặc biệt là tuyến đường Xuân Thủy, là địa điểm quy tụ nhiều nhà hàng cao cấp và độc đáo, mang đến những trải nghiệm ẩm thực đặc sắc. Nổi bật hàng đầu là Nhà hàng Lạc Thái tại số 48bis Xuân Thủy với không gian biệt thự sân vườn xanh mát và hương vị Thái truyền thống suốt hơn 25 năm.',
      },
    ],
    relatedKeywords: [
      'Nhà hàng Xuân Thủy Thảo Điền',
      'Ăn gì ở Thảo Điền',
      'Nhà hàng Thái ngon Quận 2',
    ],
  },
  {
    id: 'post-5',
    slug: 'chuong-trinh-khuyen-mai-mung-ngay-nha-giao-viet-nam-tang-xoi-xoai-thai-lan-ngon-mieng',
    title: 'Chương Trình Khuyến Mãi Mừng Ngày Nhà Giáo Việt Nam - Tặng Xôi Xoài Thái Lan Ngon Miệng',
    publishedDate: '19/11/2024',
    publishedIso: '2024-11-19',
    excerpt:
      'Tri ân Ngày Nhà Giáo Việt Nam 20/11, Nhà hàng Lạc Thái dành tặng món tráng miệng Xôi Xoài Thái Lan trứ danh cho các bàn đặt trước đến thưởng thức ẩm thực cùng thầy cô và gia đình.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/20%20Thang%2011-01(1).png',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Nhân dịp kỷ niệm Ngày Nhà Giáo Việt Nam 20/11, Nhà hàng Lạc Thái gửi lời tri ân sâu sắc tới các thầy cô giáo bằng chương trình ưu đãi đặc biệt: Tặng ngay phần Xôi Xoài Thái Lan dẻo thơm chuẩn vị khi đặt bàn dùng bữa tại hệ thống nhà hàng Lạc Thái.',
      },
    ],
    relatedKeywords: ['Khuyến mãi 20/11', 'Xôi xoài Thái Lan', 'Ưu đãi nhà hàng Lạc Thái'],
  },
  {
    id: 'post-6',
    slug: 'nha-hang-lac-thai-huong-vi-chuan-thai-giua-long-thao-dien',
    title: 'Nhà hàng Lạc Thái - Hương vị chuẩn Thái giữa lòng Thảo Điền',
    publishedDate: '11/11/2024',
    publishedIso: '2024-11-11',
    excerpt:
      'Nếu bạn đang tìm kiếm một nhà hàng Thái với hương vị chuẩn Thái, thì Lạc Thái là lựa chọn hoàn hảo. Tại đây, chúng tôi mang đến những món ăn đặc trưng như Tom Yum, Pad Thai, Som Tam, và Green Curry, được chế biến từ nguyên liệu tươi ngon và công thức truyền thống.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/TOM_7590-HDR%20copy(1).jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Nếu bạn đang tìm kiếm một nhà hàng Thái có không gian rộng rãi để tổ chức tiệc công ty, tiệc cuối năm, hoặc họp mặt đối tác, Lạc Thái chính là điểm đến lý tưởng. Chúng tôi cung cấp nhiều gói dịch vụ đặt tiệc, từ tiệc buffet đến thực đơn set menu, đáp ứng nhu cầu đa dạng của khách hàng. Đội ngũ nhân viên chuyên nghiệp, tận tâm sẽ giúp bạn có một buổi tiệc hoàn hảo và thành công.',
      },
      {
        type: 'image',
        imageUrl: 'https://lacthai.vn/www/uploads/images/TOM_7587-HDR%20copy.jpg',
        imageAlt: 'Không gian sân vườn Lạc Thái Thảo Điền',
      },
      {
        type: 'paragraph',
        text: 'Lạc Thái không chỉ hấp dẫn bởi món ăn ngon mà còn là nhà hàng sân vườn lớn nhất tại Thảo Điền, Quận 2. Với không gian mở, xanh mát, và thoáng đãng, khách hàng sẽ có cảm giác thư giãn ngay khi bước vào nhà hàng. Đây là địa điểm lý tưởng để tổ chức các sự kiện ngoài trời, tiệc gia đình, tiệc sinh nhật, hay những buổi họp mặt bạn bè.',
      },
      {
        type: 'paragraph',
        text: 'Nhà hàng Lạc Thái cam kết mang đến những món ăn chuẩn vị Thái Lan, được chế biến từ nguyên liệu tươi ngon nhập khẩu trực tiếp từ Thái. Các món ăn tại Lạc Thái như Tom Yum, Pad Thai, Som Tam, và Mango Sticky Rice đều được đánh giá cao bởi sự cân bằng giữa vị chua, cay, ngọt và mặn.',
      },
      {
        type: 'paragraph',
        text: 'Nhà hàng Lạc Thái nổi bật với thiết kế nội thất mang phong cách Thái Lan đặc trưng, từ đèn lồng truyền thống, bàn ghế gỗ cao cấp đến các chi tiết trang trí tinh tế. Không gian được thiết kế riêng biệt với từng khu vực ăn uống, mang đến cho khách hàng cảm giác ấm cúng và sang trọng.',
      },
    ],
    relatedKeywords: [
      'Nhà hàng nội thất đẹp tại Thảo Điền',
      'Nhà hàng thiết kế phong cách Thái',
      'Nhà hàng không gian sang trọng ở Quận 2',
      'Địa chỉ ăn tối lãng mạn tại Thảo Điền',
    ],
  },
  {
    id: 'post-7',
    slug: 'set-menu-nha-hang-lac-thai',
    title: 'Set Menu - Nhà Hàng Lạc Thái',
    publishedDate: '15/09/2024',
    publishedIso: '2024-09-15',
    excerpt:
      'Khám phá các gói Set Menu đa dạng tại Nhà hàng Lạc Thái được thiết kế cân bằng dinh dưỡng và trọn vẹn tứ vị Chua - Cay - Mặn - Ngọt cho nhóm từ 2 đến 10 thực khách.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Pad%20Thai.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Các gói Set Menu tại Nhà hàng Lạc Thái được bếp trưởng người Thái tuyển chọn kỹ lưỡng, kết hợp đầy đủ từ khai vị, súp Tom Yum, các món gỏi Som Tam, món chính hải sản/thịt và tráng miệng truyền thống giúp thực khách dễ dàng thưởng thức trọn vẹn tinh hoa ẩm thực Thái.',
      },
    ],
    relatedKeywords: ['Set Menu Lạc Thái', 'Thực đơn nhóm nhà hàng Thái', 'Đặt bàn tiệc Thái'],
  },
  {
    id: 'post-8',
    slug: 'to-chuc-tiec-thai-lan-nha-hang-lac-thai',
    title: 'Tổ Chức Tiệc Thái Lan - Nhà Hàng Lạc Thái',
    publishedDate: '28/08/2024',
    publishedIso: '2024-08-28',
    excerpt:
      'Dịch vụ tổ chức tiệc liên hoan công ty, tiệc sinh nhật và tiệc tất niên mang đậm phong cách Hoàng gia Thái Lan tại hệ thống nhà hàng Lạc Thái Quận 1 và Thảo Điền.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/TOM_7374-HDR%20copy(1).jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Với sức chứa linh hoạt từ phòng VIP riêng tư đến khu sân vườn thoáng rộng, Lạc Thái cung cấp giải pháp tổ chức tiệc trọn gói chuyên nghiệp từ trang trí, âm thanh ánh sáng đến thực đơn thiết kế riêng theo ngân sách của doanh nghiệp và gia đình.',
      },
    ],
    relatedKeywords: ['Tổ chức tiệc Thái Lan', 'Tiệc công ty Sài Gòn', 'Phòng VIP nhà hàng Thái'],
  },
  {
    id: 'post-9',
    slug: 'cach-lam-mon-xoi-xoai-o-san-bay-thai-lan',
    title: 'Cách làm món Xôi Xoài ở sân bay Thái Lan',
    publishedDate: '10/07/2024',
    publishedIso: '2024-07-10',
    excerpt:
      'Bí quyết đồ xôi nếp Thái hạt bóng mẩy, dẻo thơm hương lá dứa quyện cùng sốt cốt dừa sánh mịn và xoài cát chín vàng ngọt lịm như tại Bangkok.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Ca%20Cuon%20La%20Dua.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Xôi xoài (Khao Niew Mamuang) là món tráng miệng biểu tượng của xứ sở Chùa Vàng. Bí quyết làm nên đĩa xôi xoài chuẩn vị tại Lạc Thái nằm ở hạt nếp Thái dài được ngâm đủ giờ, hấp chín bằng xửng tre với lá dứa tươi rồi trộn đều cùng nước cốt dừa ép nhất thêm chút muối biển tinh tế.',
      },
    ],
    relatedKeywords: ['Xôi xoài Thái Lan', 'Khao Niew Mamuang', 'Tráng miệng Thái Lan'],
  },
  {
    id: 'post-10',
    slug: 'y-nghia-le-hoi-te-nuoc-thai-lan-songkran',
    title: 'Ý Nghĩa Lễ Hội Té Nước Thái Lan - Songkran',
    publishedDate: '12/04/2024',
    publishedIso: '2024-04-12',
    excerpt:
      'Tìm hiểu nguồn gốc và ý nghĩa văn hóa tốt đẹp của Lễ hội té nước Songkran – dịp lễ đón năm mới truyền thống thiêng liêng và rộn ràng nhất tại Thái Lan.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/56.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Diễn ra từ ngày 13 đến 15 tháng 4 hàng năm, lễ hội Songkran mang ý nghĩa gột rửa những điều không may của năm cũ và cầu chúc bình an, tài lộc cho năm mới. Đây cũng là thời điểm người Thái thưởng thức những món ăn truyền thống mát lành và đậm vị.',
      },
    ],
    relatedKeywords: ['Ý nghĩa lễ hội Songkran', 'Văn hóa Thái Lan', 'Lễ hội té nước'],
  },
  {
    id: 'post-11',
    slug: 'ga-cuon-la-dua-mon-an-tru-danh-cua-nha-hang-lac-thai',
    title: 'GÀ CUỐN LÁ DỨA - Món ăn trứ danh của nhà hàng Lạc Thái',
    publishedDate: '20/02/2024',
    publishedIso: '2024-02-20',
    excerpt:
      'Gà cuốn lá dứa (Gai Hor Bai Toey) với lớp thịt gà mềm mọng thấm đẫm gia vị thảo mộc, bọc trong lá dứa thơm lừng dùng kèm sốt tương ngọt mè rang đặc trưng.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Ca%20Cuon%20La%20Dua.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Gà cuốn lá dứa là một trong những món ăn được yêu thích nhất tại Lạc Thái suốt hơn hai thập kỷ qua. Từng miếng đùi gà rút xương được tẩm ướp dầu hào, tỏi, rễ ngò rí, tiêu trắng rồi khéo léo gói trong lá dứa tươi trước khi chiên vừa lửa để giữ trọn độ mọng nước.',
      },
    ],
    relatedKeywords: ['Gà cuốn lá dứa', 'Gai Hor Bai Toey', 'Món ngon Lạc Thái'],
  },
  {
    id: 'post-12',
    slug: 'nha-hang-lac-thai-khong-gian-noi-that-an-tuong-tai-pho-trang-tien',
    title: 'Nhà hàng Lạc Thái - Không gian nội thất ấn tượng tại phố Tràng Tiền',
    publishedDate: '05/01/2024',
    publishedIso: '2024-01-05',
    excerpt:
      'Hành trình kiến tạo không gian kiến trúc đậm chất nghệ thuật Đông Dương giao thoa văn hóa Thái Lan của thương hiệu nhà hàng Lạc Thái.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/DSC00676(1).JPG',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Bắt đầu từ năm 1999, Lạc Thái luôn chú trọng kiến tạo không gian thưởng thức ẩm thực vừa sang trọng, tinh tế vừa gần gũi, ấm cúng với chất liệu gỗ tự nhiên, ánh đèn vàng ấm và những họa tiết trang trí thủ công mang hồn cốt xứ Chùa Vàng.',
      },
    ],
    relatedKeywords: ['Không gian nhà hàng Lạc Thái', 'Kiến trúc Thái Lan', 'Lạc Thái Since 1999'],
  },
  {
    id: 'post-13',
    slug: 'kham-pha-nha-hang-thai-lan-lau-doi-bac-nhat-sai-gon',
    title: 'Khám phá nhà hàng Thái Lan lâu đời bậc nhất Sài Gòn',
    publishedDate: '18/11/2023',
    publishedIso: '2023-11-18',
    excerpt:
      'Ra đời từ năm 1999, Nhà hàng Lạc Thái tự hào là một trong những nhà hàng Thái Lan đầu tiên và lâu đời bậc nhất tại Sài Gòn, giữ vững tôn chỉ "Vị Thái chuẩn cho người sành".',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Goi%20Ca%20Tre.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Hơn 25 năm gắn bó với thực khách Sài Gòn, Lạc Thái vẫn giữ nguyên vẹn hương vị truyền thống nhờ đội ngũ đầu bếp người Thái giàu kinh nghiệm và nguồn nguyên liệu gia vị nhập khẩu chính gốc từ Thái Lan.',
      },
    ],
    relatedKeywords: ['Nhà hàng Thái lâu đời Sài Gòn', 'Lạc Thái 1999', 'Vị Thái chuẩn cho người sành'],
  },
  {
    id: 'post-14',
    slug: 'cac-loai-goi-mon-an-quoc-hon-quoc-tuy-thai-lan',
    title: 'Các loại Gỏi - Món ăn quốc hồn quốc túy Thái Lan',
    publishedDate: '02/10/2023',
    publishedIso: '2023-10-02',
    excerpt:
      'Từ Gỏi đu đủ Som Tam giòn sần sật đến Gỏi cá trê chiên xù Yam Plaa Dook Foo – khám phá thế giới gỏi Thái đầy mê hoặc tại Nhà hàng Lạc Thái.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Ca%20Chem%20Chien%20Sot%20Xoai.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Ẩm thực Thái Lan nổi tiếng với các món gỏi (Yam & Som Tam) đánh thức mọi giác quan nhờ sự bùng nổ của vị chua từ chanh tươi, vị cay nồng của ớt hiểm, vị mặn đậm đà của nước mắm Thái và vị ngọt dịu từ đường thốt nốt.',
      },
    ],
    relatedKeywords: ['Gỏi Thái Lan', 'Som Tam', 'Gỏi cá trê chiên xù'],
  },
  {
    id: 'post-15',
    slug: 'xoi-xoai-thai-tinh-te-am-thuc-xu-chua-vang',
    title: 'XÔI XOÀI THÁI - TINH TẾ ẨM THỰC XỨ CHÙA VÀNG',
    publishedDate: '15/08/2023',
    publishedIso: '2023-08-15',
    excerpt:
      'Sự giao hòa tinh tế giữa vị ngọt thanh của xoài chín, độ dẻo thơm của nếp mới và vị béo ngậy của nước cốt dừa tạo nên món tráng miệng trứ danh tại Lạc Thái.',
    thumbnailUrl: 'https://lacthai.vn/www/uploads/images/Ca%20Ri%20Xanh%20-%20Tom.jpg',
    contentParagraphs: [
      {
        type: 'paragraph',
        text: 'Mỗi phần Xôi Xoài tại Lạc Thái đều được chuẩn bị tươi mới mỗi ngày, kết thúc bữa tiệc ẩm thực Thái Lan bằng một dư vị ngọt ngào, thanh tao khó quên.',
      },
    ],
    relatedKeywords: ['Xôi xoài Thái', 'Ẩm thực xứ Chùa Vàng', 'Nhà hàng Lạc Thái'],
  },
];
