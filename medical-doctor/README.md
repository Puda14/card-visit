# Medical Doctor — danh thiếp số

Website Next.js + TypeScript + pnpm riêng cho bác sĩ Phùng Văn Anh Đức, màu xanh lá và trắng theo card mẫu. Mặc định tiếng Anh, có Tiếng Việt và 日本語. Intro hai nửa màn trắng kéo sang hai bên; chữ thập xanh và slogan ở giữa mờ đi khi màn mở. Hồ sơ bên dưới đứng yên.

## Chạy

```powershell
cd medical-doctor
pnpm install --frozen-lockfile
pnpm dev
```

Mở http://localhost:3002. Bản Pick Me Dev dùng thư mục/cổng riêng. Nếu cổng 3002 đang có server cùng dự án thì dùng server đó, hoặc dừng server trước khi chạy lại.

## Đổi thông tin

Đã tạo `.env` từ `.env.example`. Chỉnh tên, chức danh/chuyên ngành/slogan cho từng ngôn ngữ, đơn vị công tác, địa chỉ, số điện thoại, email, website, mạng xã hội và alias tại đây. Hồ sơ mặc định hiển thị ThS.BSNT, đào tạo bác sĩ nội trú Y Hà Nội, chuyên ngành Cơ xương khớp và nơi công tác tại Viện Cơ Xương Khớp - Bệnh viện Bạch Mai. Sau khi sửa cần khởi động lại dev; production cần build/deploy lại. Đây là thông tin công khai, không đặt mật khẩu hoặc API key trong file này.

Số điện thoại Việt Nam tự hiển thị dạng `+84 839.191.315`; link gọi vẫn dùng số liền. Các kênh chưa cấu hình không tạo link trống. Chưa có số điện thoại, email, nơi công tác hoặc ảnh thật của bác sĩ nên các giá trị đó được để trống.

Muốn dùng ảnh: đặt file `avatar/avatar.png`, rồi đặt `AVATAR_PATH="/avatar/avatar.png"`. Script assets sẽ đồng bộ sang public khi chạy dev/build. Không có ảnh thì dùng hình khớp gối dạng nét; ảnh lỗi có chữ viết tắt dự phòng. Tên tiếng Nhật chỉ xuất hiện khi điền `PERSONAL_NAME_JA`.

Khối “Thông tin liên quan” lấy bốn URL từ `RELATED_RHEUMATOLOGY_URL`, `RELATED_MSK_CENTER_URL`, `RELATED_IFR_URL` và `RELATED_SCHEDULE_URL`; `WORKPLACE_URL` điều khiển liên kết nơi công tác. Nút lưu danh bạ tải `/contact.vcf` có tên, chuyên ngành, liên hệ, địa chỉ và các mạng xã hội đã cấu hình. Nút chia sẻ dùng tính năng chia sẻ của thiết bị hoặc sao chép URL. Intro chỉ chạy một lần mỗi tab, có bỏ qua/Escape, hỗ trợ reduced motion và trang vẫn đọc được khi tắt JavaScript.

## Kiểm tra và deploy

```powershell
pnpm test
pnpm typecheck
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm start
```

Có thể chỉ định Chromium sẵn có qua `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Script `scripts/inspect-preview.mjs` chụp desktop, ba ngôn ngữ trên mobile và video mở màn; cần FFmpeg của Playwright để quay (`pnpm exec playwright install ffmpeg`).

Deploy trên hosting hỗ trợ Next.js Node.js, chọn thư mục gốc `medical-doctor`, install `pnpm install --frozen-lockfile`, build `pnpm build`. Đặt các biến `.env.example` trên hosting, đặc biệt `SITE_URL` là URL HTTPS cuối cùng; dùng URL này cho NFC/QR. Chưa deploy lên hosting.
