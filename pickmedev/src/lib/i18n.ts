export const locales = ["vi", "en", "ja"] as const;
export type Locale = typeof locales[number];

export function isLocale(value: string): value is Locale {
  return locales.some(locale => locale === value);
}

export const languageNames: Record<Locale, string> = { vi: "Tiếng Việt", en: "English", ja: "日本語" };

const vi = {
  language: "Ngôn ngữ", skipToContent: "Đến nội dung chính", greeting: "RẤT VUI ĐƯỢC KẾT NỐI",
  profileLabel: "Hồ sơ cá nhân", contacts: "Kết nối với tôi", contactHint: "Chọn kênh thuận tiện nhất cho bạn.",
  emptyContacts: "Lưu danh bạ để giữ kết nối với tôi.", email: "Email", phone: "Điện thoại", website: "Website",
  saveContact: "Lưu danh bạ", vcardHint: "Lưu thông tin trực tiếp vào điện thoại", share: "Chia sẻ hồ sơ",
  copied: "Đã sao chép liên kết.", shareFallback: "Bạn có thể sao chép đường dẫn trên thanh địa chỉ để chia sẻ.",
  introSkip: "Bỏ qua mở đầu", introWelcome: "Chào mừng đến", introTagline: "MỘT KẾT NỐI MỚI BẮT ĐẦU",
  portraitAlt: "Ảnh chân dung", portraitTag: "ĐỒNG HÀNH CÙNG", connection: "Một chạm. Một kết nối.",
};

export type Dictionary = { [K in keyof typeof vi]: string };

export const dictionaries: Record<Locale, Dictionary> = {
  vi,
  en: {
    language: "Language", skipToContent: "Skip to main content", greeting: "GREAT TO CONNECT WITH YOU",
    profileLabel: "Personal profile", contacts: "Let's connect", contactHint: "Reach me wherever works best for you.",
    emptyContacts: "Save my contact details to stay in touch.", email: "Email", phone: "Phone", website: "Website",
    saveContact: "Save contact", vcardHint: "Add my details directly to your phone", share: "Share profile",
    copied: "Link copied.", shareFallback: "Copy the link from your address bar to share this profile.",
    introSkip: "Skip intro", introWelcome: "Welcome to", introTagline: "A NEW CONNECTION BEGINS",
    portraitAlt: "Portrait of", portraitTag: "TOGETHER WITH", connection: "One tap. A new connection.",
  },
  ja: {
    language: "言語", skipToContent: "本文へスキップ", greeting: "つながりを、ここから。",
    profileLabel: "プロフィール", contacts: "お問い合わせ", contactHint: "ご都合のよい方法でお気軽にご連絡ください。",
    emptyContacts: "連絡先を保存して、これからもつながりましょう。", email: "メール", phone: "電話", website: "ウェブサイト",
    saveContact: "連絡先を保存", vcardHint: "スマートフォンの連絡先に追加", share: "プロフィールを共有",
    copied: "リンクをコピーしました。", shareFallback: "アドレスバーのリンクをコピーして共有できます。",
    introSkip: "イントロをスキップ", introWelcome: "ようこそ", introTagline: "新しいつながりが、ここから始まる。",
    portraitAlt: "プロフィール写真：", portraitTag: "ともに歩む", connection: "ワンタッチで、つながる。",
  },
};
