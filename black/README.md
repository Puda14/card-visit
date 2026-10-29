# Nguyễn Hữu Nhật — digital business card

Website Next.js + TypeScript + pnpm riêng trong thư mục `black`, thiết kế đen–vàng tối giản theo card mẫu. Tên dùng font viết tay Dancing Script được đóng gói cùng dự án và hỗ trợ dấu tiếng Việt. Intro là hai cánh thiệp đen/vàng mở sang hai bên; trang bên dưới đứng yên.

## Chạy local

```powershell
cd black
pnpm install --frozen-lockfile
pnpm dev
```

Mở http://localhost:3003. Hai dự án cũ dùng thư mục và cổng riêng.

## Thay thông tin

Chỉnh `.env` dựa trên `.env.example`: tên, tên Nhật, chức danh/bio theo ba ngôn ngữ, công ty, slogan, số điện thoại, email, website, Facebook, YouTube, TikTok và alias. Các giá trị đang để trống vì card chỉ cung cấp tên; website không tạo link rỗng hoặc thông tin giả.

Muốn dùng ảnh, đặt `avatar/avatar.png` rồi đặt `AVATAR_PATH="/avatar/avatar.png"`. Khi chạy dev/build, script assets đồng bộ ảnh sang `public/avatar/avatar.png`. Không có ảnh thì hiển thị monogram NHN màu vàng.

Mặc định English, có Tiếng Việt và 日本語. Nút lưu danh bạ tải vCard; nút chia sẻ dùng share sheet hoặc clipboard. Intro chạy một lần trong mỗi tab, hỗ trợ Skip/Escape, reduced motion và trang vẫn dùng được khi tắt JavaScript.

## Kiểm tra

```powershell
pnpm test
pnpm typecheck
pnpm test:e2e
pnpm build
```

`scripts/inspect-preview.mjs` tạo ảnh desktop/mobile và video `qa/invitation-preview.webm`. Khi deploy, chọn root directory `black`, install `pnpm install --frozen-lockfile`, build `pnpm build`, thêm các biến trong `.env.example`, đặt `SITE_URL` bằng URL HTTPS cuối cùng rồi ghi URL đó vào NFC/QR.
