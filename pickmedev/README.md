# Pick Me Dev — NFC digital card

Website danh thiếp số gọn trong một khung hồ sơ, bằng **Next.js App Router + TypeScript + pnpm**. Motion điều khiển ba lá khẩu xanh theo cơ chế camera iris; mép các lá trực tiếp mở khoảng rỗng để lộ trang cố định phía dưới. Canvas tạo mạng lưới kết nối chuyển động theo mặt trước card. Font Be Vietnam Pro được đóng gói cùng ứng dụng.

## Chạy trên máy

Yêu cầu Node.js 20.9+ và pnpm 10+.

```sh
pnpm install
# Nếu chưa có .env:
cp .env.example .env
pnpm dev
```

PowerShell dùng `Copy-Item .env.example .env` thay cho `cp` nếu cần. Dự án đã có sẵn `.env` mẫu; không ghi đè nếu đã điền thông tin.

Mở **http://localhost:3000** (mặc định tiếng Anh, tự chuyển đến `/en`). Dùng nút **VI / EN / 日本語** trên đầu trang để đổi ngôn ngữ. Nếu dự án đã có server đang chạy, mở URL hiện tại hoặc dừng nó bằng Ctrl+C trước khi chạy `pnpm dev` lần nữa.

## Ngôn ngữ

Ba bản tĩnh `/vi`, `/en`, `/ja` có giao diện, chức danh, giới thiệu và metadata tương ứng. Chuyển ngôn ngữ dùng liên kết bình thường nên hoạt động cả khi tắt JavaScript. Thuộc tính `lang` của trang và nhãn truy cập theo ngôn ngữ đã chọn. Tên tiếng Việt và tên phiên âm tiếng Nhật luôn hiển thị cùng nhau.

Bản dịch giao diện nằm trong `src/lib/i18n.ts`. Chức danh và lời giới thiệu từng người dùng các biến môi trường bên dưới; website không tự dịch văn bản tùy chỉnh khi chạy.

## Đổi thông tin cho từng người

Chỉnh `.env` ở thư mục gốc dự án. Dùng dấu ngoặc kép cho nội dung có khoảng trắng; giữ URL đầy đủ bắt đầu bằng `https://`.

| Biến | Nội dung |
| --- | --- |
| `PERSONAL_NAME` | Tên cá nhân |
| `PERSONAL_NAME_JA` | Tên phiên âm tiếng Nhật, hiện dưới tên tiếng Việt |
| `PERSONAL_TITLE` | Chức danh |
| `PERSONAL_TITLE_VI` / `_EN` / `_JA` | Chức danh theo từng ngôn ngữ; ưu tiên hơn biến chung |
| `PERSONAL_BIO` | Lời giới thiệu cá nhân |
| `PERSONAL_BIO_VI` / `_EN` / `_JA` | Lời giới thiệu theo từng ngôn ngữ |
| `COMPANY_NAME` | Tên công ty |
| `COMPANY_SLOGAN` | Biểu ngữ công ty |
| `EMAIL` | Địa chỉ Gmail hoặc email khác |
| `PHONE` | Điện thoại, ví dụ `+84 912 345 678` |
| `WEBSITE_URL` | Website công ty |
| `YOUTUBE_URL` | URL kênh YouTube |
| `TIKTOK_URL` | URL trang TikTok |
| `FACEBOOK_URL` | URL trang Facebook |
| `YOUTUBE_ALIAS` / `TIKTOK_ALIAS` / `FACEBOOK_ALIAS` | Tên hiển thị dưới nền tảng, ví dụ `@pick.me.dev`, `pickmedevofficial` |
| `AVATAR_PATH` | Mặc định `/avatar/avatar.png` |
| `LOGO_PATH` | Mặc định `/card_visit_image/logo.png` |
| `SITE_URL` | URL website danh thiếp sau deploy, phục vụ metadata |

Email, điện thoại và URL để trống hoặc không hợp lệ sẽ tự ẩn. Điện thoại chấp nhận 6–15 chữ số, dấu `+` ở đầu và khoảng trắng, dấu chấm/gạch ngang/ngoặc để định dạng. Số Việt Nam được hiển thị dạng **`+84 839.191.315`** từ đầu vào như `+84839191315`, `84839191315` hoặc `0839191315`; liên kết gọi và vCard giữ nguyên số quay đã bỏ dấu phân cách. Số quốc gia khác giữ định dạng bạn nhập. Các trường tên, chức danh và giới thiệu có nội dung mẫu nếu để trống.

Nếu alias để trống, website lấy tên từ URL của nền tảng. Với URL chia sẻ không có handle rõ ràng (ví dụ Facebook `profile.php?id=...`), nên điền alias riêng để khách dễ nhận biết. Alias không thay đổi URL đích. Phần “Về chúng tôi” đã bỏ; biến cũ `COMPANY_DESCRIPTION` không còn được sử dụng.

**Sau khi sửa `.env`:** dừng và chạy lại `pnpm dev`. Trên production cần **build và deploy lại**. Thông tin được đặt tại `.env` là nội dung công khai trên website; không thêm mật khẩu hay khóa API. `.env` đã được loại khỏi Git, `.env.example` có thể chia sẻ cùng source.

## Đổi ảnh

- Avatar: thay `avatar/avatar.png`.
- Logo: thay `card_visit_image/logo.png`.
- `pnpm dev` và `pnpm build` tự đồng bộ hai ảnh vào `public/`; các ảnh nguồn được giữ nguyên.
- Nếu thay ảnh trong lúc server đang chạy: chạy `pnpm assets`, rồi tải lại trình duyệt.
- Nếu dùng tên ảnh khác: đặt ảnh trong `public/`, rồi chỉnh `AVATAR_PATH`/`LOGO_PATH` thành đường dẫn bắt đầu bằng `/`. Không dùng đường dẫn ổ đĩa Windows hay URL ảnh bên ngoài.
- Avatar bị thiếu hoặc tải lỗi sẽ hiện chữ viết tắt tên khi JavaScript hoạt động.

Hai mặt card visit gốc được giữ trong `card_visit_image/` làm tài liệu nhận diện, không tải xuống trang để tránh làm nặng website.

## Animation và thao tác

Intro khoảng 4,4 giây theo hai pha: ba dải xoắn xanh dương–navy có đầu thuôn cuộn vào tâm trong 1,9 giây, để lại một lỗ nhỏ; sau đó đảo chiều và bung khoảng mở ra toàn màn hình trong 2,5 giây. Hình dạng đường xoắn thay đổi theo từng khung hình. Chỉ có ba dải với sáu mặt SVG, không vòng logo giữa hay tia sáng phụ. Không flash; trang thông tin phía dưới giữ nguyên vị trí, kích thước và độ hiển thị. Hình học hiện tại nằm trong `src/lib/card-swirl.ts`; các helper khẩu độ cũ vẫn giữ để tương thích.

Trong pha cuộn vào, lớp trắng che toàn bộ nội dung; logo đứng yên ở tâm với vòng xanh quay quanh. Khi đảo chiều để mở, logo và vòng xanh mờ đi trước, lớp trắng tan dần để lộ trang. Các lớp có sẵn trong HTML server, tránh lộ nội dung trước khi JavaScript tải xong.

Người xem có thể bấm **Skip intro / Bỏ qua mở đầu** hoặc **Escape**. Khẩu độ mở một lần trong mỗi tab và không lặp khi chuyển ngôn ngữ. Script nhỏ trong head kiểm tra phiên trước khung hình đầu tiên để lần xem lại không nháy lớp intro. Khi tắt JavaScript, CSS noscript bỏ qua lớp khẩu độ; khi bộ nhớ phiên bị chặn, lần mở vẫn hoàn tất bình thường.

Nền có các nút mạng và sợi kết nối chuyển động, có những điểm sáng chạy dọc đường nối. Nền giữ tĩnh trong lúc khẩu độ mở và tiếp tục chuyển động sau khi hoàn tất; cũng tạm dừng khi tab không hiển thị. Nếu bật Reduce Motion trên hệ điều hành, intro được bỏ qua và mạng lưới hiển thị tĩnh. Nội dung HTML không bị ẩn khi JavaScript bị tắt.

Tiện ích dịch như Immersive Translate có thể gắn `data-immersive-translate-page-theme` vào `<html>` trước khi React hydrate. Root layout giới hạn `suppressHydrationWarning` ở đúng `<html>` để tương thích trường hợp này; không xóa thuộc tính của tiện ích và không bỏ kiểm tra trên các thành phần bên trong. Có kiểm tra hồi quy mô phỏng việc chèn thuộc tính trước hydration. Xem [hướng dẫn hydration của Next.js](https://nextjs.org/docs/messages/react-hydration-error).

Trang giới thiệu và liên kết danh bạ vẫn dùng được khi tắt JavaScript. Nút **Lưu danh bạ** tải file vCard UTF-8; hành vi nhập danh bạ tùy trình duyệt/hệ điều hành. Nút chia sẻ dùng bảng chia sẻ hệ thống nếu có, hoặc sao chép URL trên HTTPS/localhost.

## Build và deploy

```sh
pnpm build
pnpm start
```

Có thể deploy lên một dịch vụ hỗ trợ Next.js Node.js, ví dụ Vercel:

1. Đưa source lên Git của bạn, chọn **Root Directory = `pickmedev`** nếu kho chứa thư mục cha.
2. Chọn framework Next.js, lệnh cài `pnpm install --frozen-lockfile`, lệnh build `pnpm build`.
3. Thêm các biến trong `.env.example` vào Environment Variables của dịch vụ; `.env` sẽ không đi theo Git.
4. Deploy, lấy URL HTTPS công khai và đặt `SITE_URL` thành URL đó; deploy lại.
5. Ghi URL HTTPS vào NFC dưới dạng bản ghi URL/NDEF. Kiểm tra bằng điện thoại chưa đăng nhập tài khoản hosting để chắc chắn khách mở được.

Mỗi người có một bộ biến môi trường và một deployment/URL riêng. Dự án hiện chưa deploy và chưa có domain được cấu hình. Route `/contact.vcf` dùng Node.js; dự án không cấu hình `output: 'export'`.

## Kiểm tra

```sh
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

Test hình học kiểm tra khoảng mở không bao giờ thu lại theo mọi hướng, ba điểm neo riêng, trượt ra ngoài, hình gần tròn ở cuối và toàn bộ góc màn hình được mở. Test trình duyệt kiểm tra lỗ hé thật ngay trong HTML server, chuyển động độc lập của các lá, khung nội dung không đổi vị trí/kích thước/opacity, mặc định tiếng Anh, ba ngôn ngữ, điện thoại 320/390px đến desktop 1440px, reduced motion, mạng lưới, bàn phím/Escape, storage bị chặn, avatar lỗi, trang không JavaScript và tải vCard.

Có thể dùng Chromium sẵn có bằng biến `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. `scripts/inspect-preview.mjs` lưu chuỗi khung hình và video `qa/aperture-preview.webm`; để quay video cần FFmpeg của Playwright (`pnpm exec playwright install ffmpeg`).

## Cấu trúc

```text
src/app/[locale]/        Trang và root layout từng ngôn ngữ, metadata
src/app/globals.css      Giao diện và responsive
src/app/experience.css   Nhận diện card, mạng lưới và dải xoáy
src/app/contact.vcf/     Route tải vCard
src/components/          Intro, avatar dự phòng, icon mạng xã hội, chia sẻ
                         Mạng lưới Canvas và ba lá khẩu SVG
src/lib/i18n.ts          Ba bộ bản dịch giao diện và danh sách ngôn ngữ
src/lib/aperture.ts      Hình học điểm neo, xoay và trượt của ba lá khẩu
src/lib/experience.ts    Tín hiệu hoàn tất để tiếp tục nền chuyển động
src/lib/profile.ts       Đọc và kiểm tra cấu hình công khai
src/lib/vcard.ts         Tạo danh bạ UTF-8
scripts/sync-assets.mjs  Đồng bộ ảnh nguồn
avatar/                  Ảnh chân dung nguồn
card_visit_image/        Logo và hai mặt card visit nguồn
public/                  Ảnh được phục vụ trên website
tests/                   Kiểm tra cấu hình và trình duyệt
```
