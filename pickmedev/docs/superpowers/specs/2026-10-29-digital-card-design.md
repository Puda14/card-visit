# Pick Me Dev — thiết kế danh thiếp số

## Mục đích

Website một trang mở từ URL trong thẻ NFC, giúp khách biết người đại diện và công ty, sau đó gọi điện, gửi email hoặc truy cập mạng xã hội nhanh chóng. Mã nguồn nằm trong thư mục pickmedev, dùng Next.js, TypeScript và pnpm.

## Hướng thiết kế

Đề xuất đã được người dùng phản hồi “oke”: danh thiếp số cao cấp với nền trắng, xanh dương sáng và xanh navy theo logo. Phương án thay thế là nền xanh đậm và vòng xoáy ánh sáng mạnh hơn; phương án trắng được đề xuất vì gần với card hiện có và dễ đọc sau khi quét NFC. Chi tiết dưới đây chờ người dùng duyệt.

## Bố cục và nội dung

- Header gọn: logo thật và tên Pick Me Dev, liên kết tới phần liên hệ.
- Phần đầu: slogan “We reach the top together”, lời giới thiệu ngắn, tên Phùng Tiến Đạt, chức danh Business Development Executive, ảnh avatar/avatar.png. Máy tính dùng hai cột, điện thoại dùng một cột với danh tính và liên hệ xuất hiện sớm.
- Các nút gọi điện, gửi email và lưu danh bạ vCard khi đã có dữ liệu hợp lệ.
- Phần công ty: logo thật, tên, slogan và đoạn giới thiệu có thể cấu hình. Không tự bịa dịch vụ, thành tích hay khách hàng.
- Liên hệ và mạng xã hội: Gmail/email, điện thoại, YouTube, TikTok và Facebook. Chỉ hiển thị mục đã được cấu hình; không tạo liên kết giả.
- Footer tối giản với tên công ty.

## Animation

Dùng thư viện Motion. Màn mở đầu khoảng 2 giây gồm ba dải xanh xoay và thu vào tâm, chuyển thành logo gốc rồi mở ra nội dung. Tạo hình bằng SVG/CSS, không dùng video nặng hoặc yêu cầu WebGL. Có nút bỏ qua, tránh chặn truy cập liên hệ khi JavaScript lỗi. Mỗi tab chỉ xem intro một lần; tải lại vẫn truy cập được nội dung. Tôn trọng prefers-reduced-motion bằng cách bỏ vòng xoáy và hiện ngay nội dung. Các mục xuất hiện nhẹ khi cuộn; không để chuyển động liên tục gây khó đọc.

## Cấu hình

Tập trung đọc biến môi trường trong một module phía server và truyền dữ liệu công khai cần thiết xuống giao diện. Cung cấp .env và .env.example với tên cá nhân, chức danh, lời giới thiệu, tên công ty, slogan, giới thiệu công ty, email, điện thoại, URL website, YouTube, TikTok, Facebook, đường dẫn avatar và logo. .env bị gitignore. Những giá trị xuất hiện trên website là thông tin công khai, không phải nơi đặt mật khẩu. Hướng dẫn rõ việc khởi động lại hoặc build/deploy lại sau khi sửa .env.

Ảnh nguồn được giữ nguyên trong avatar/ và card_visit_image/. Đồng bộ ảnh cần dùng vào public/ bằng script để đổi avatar/avatar.png rồi chạy dev/build là nhận ảnh mới. Có fallback chữ viết tắt nếu avatar không tồn tại hoặc tải lỗi.

## Chất lượng và phạm vi

Thiết kế responsive ở điện thoại, tablet và desktop, không tràn ngang; hỗ trợ bàn phím, focus rõ, tên truy cập cho các nút biểu tượng và tương phản chữ tốt. Metadata lấy từ thông tin cấu hình. Kiểm tra TypeScript và production build; kiểm tra hành vi liên kết, vCard và animation ở mức công cụ có sẵn.

Không có CMS, đăng nhập hoặc database. Chưa triển khai lên dịch vụ hosting vì người dùng đang yêu cầu mã nguồn Next.js trong thư mục; cung cấp hướng dẫn chạy và deploy để lấy URL công khai dùng cho NFC. Lựa chọn này là đề xuất của người thực hiện, không phải yêu cầu thêm từ người dùng.

## Những lựa chọn giao người thực hiện

Chọn font, khoảng cách, icon, chi tiết SVG và breakpoint theo thiết kế trên; dùng package ổn định tương thích được kiểm tra tại lúc triển khai. Không cần hỏi thêm cho những chi tiết này. Email, điện thoại và URL mạng xã hội để trống cho người dùng điền vào .env.
