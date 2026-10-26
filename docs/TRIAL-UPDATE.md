# Học thử và chuyển cảnh — 26/10/2026

- Chuyển trang bằng crossfade khoảng 300 ms cho cả nội dung và khung trang, gồm **Thử ngay / Học thử** từ trang chủ. Ảnh trang cũ và mới được chụp theo thời điểm React cập nhật trang; mỗi đường dẫn dùng tên riêng để không co giãn trang dài khi vào khu học tập.
- Trình duyệt chưa hỗ trợ View Transitions và lần Back/Forward khôi phục đồng bộ có hiệu ứng xuất hiện dự phòng 260 ms. Không chạy chuyển cảnh khi bật giảm chuyển động; không đặt lại bộ chọn lớp, đồng hồ hoặc trạng thái dùng chung.
- Thay hai link tải lại toàn trang trong Cài đặt bằng Next Link; bỏ điều hướng hai lần khi đăng xuất. Bỏ hiệu ứng xuất hiện ban đầu chồng lên chuyển trang ở các form và trang thành viên.
- Nút đầu trang: **Thử ngay**. Các lời mời bắt đầu học: **Học thử**.
- Khách có thể xem chương trình, công thức và luyện tập theo lớp/chủ đề.
- Gia sư AI, tài liệu cá nhân, hồ sơ, cài đặt, góp ý và phần theo dõi việc học yêu cầu đăng nhập. Bấm vào sẽ hiện popup có Đăng nhập, Tạo tài khoản và Tiếp tục học thử.
- Mở trực tiếp URL trang dành cho thành viên vẫn được chặn trước khi nội dung trang hoạt động.
- Sau đăng nhập/đăng ký, quay lại mục vừa chọn, giữ lớp và chủ đề. URL quay lại chỉ chấp nhận các trang học tập nội bộ.
- API gia sư kiểm tra phiên đăng nhập trên máy chủ và trả 401 cho khách.

## Kiểm tra

- 22/22 kiểm thử tự động đạt, gồm bảo vệ API gia sư và URL quay lại sau đăng nhập.
- TypeScript và build production đạt.
- Chưa kiểm tra thao tác bằng trình duyệt trong lượt này vì tính năng điều khiển trình duyệt đang tắt trong Work settings.
- Chưa thực hiện đăng nhập với database thật; cấu hình dịch vụ bên ngoài giữ nguyên.

Chuyển cảnh sử dụng tích hợp `experimental.viewTransition` được tài liệu Next.js 16.2.3 trong dự án hỗ trợ. Cần giữ cấu hình này khi nâng cấp framework. Hiệu ứng trực quan, Back/Forward và hành vi trên thiết bị thật vẫn cần kiểm tra bằng trình duyệt; kiểm tra build không thay thế bước đó.

Bản làm việc là thư mục `outputs/G-Physics`, hiện mang thương hiệu F-Physics và bảng màu do người dùng chỉnh sau bản bàn giao tháng 9. Những chỉnh sửa đó được giữ lại.
- Lint: 0 lỗi; còn 26 cảnh báo cũ về import chưa dùng và thẻ ảnh.
- Kiểm tra HTTP production: trang chủ, học thử, thư viện, luyện tập và đăng nhập trả 200; API gia sư với khách trả 401 / AUTH_REQUIRED.
