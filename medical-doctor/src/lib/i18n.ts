export const locales = ["en", "vi", "ja"] as const;
export type Locale = typeof locales[number];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export const languageNames = { en: "English", vi: "Tiếng Việt", ja: "日本語" };
export const dictionaries = {
  en: {
    profile: "Medical profile", eyebrow: "A PERSONAL CONNECTION. A THOUGHTFUL APPROACH.", doctor: "Medical Doctor", specialty: "Specialty", care: "Professional profile",
    degree: "Title", training: "Residency", expertise: "Specialty", workplace: "Workplace",
    contact: "Get in touch", contactNote: "A direct connection, whenever you need it.", phone: "Phone", email: "Email", website: "Website", location: "Practice location", directions: "Get directions", empty: "Contact details will be available here soon.",
    related: "Related information", relatedNote: "Professional articles, profiles and examination schedule.", authorProfile: "Author profile", articles: "Professional articles", instituteProfile: "IFR author page", examinationSchedule: "Examination schedule",
    save: "Save contact", saveNote: "Keep my details close at hand.", share: "Share profile", copied: "Link copied", fallback: "Copy the address from your browser to share.", skip: "Skip intro", intro: "Welcome", language: "Choose language", footer: "A small connection. A meaningful beginning.", identity: "PHYSICIAN · MUSCULOSKELETAL MEDICINE", image: "Medical illustration", skipContent: "Skip to content",
  },
  vi: {
    profile: "Hồ sơ bác sĩ", eyebrow: "KẾT NỐI GẦN GŨI. QUAN TÂM TỪ ĐIỀU NHỎ NHẤT.", doctor: "Bác sĩ", specialty: "Chuyên ngành", care: "Hồ sơ chuyên môn",
    degree: "Chức danh", training: "Đào tạo", expertise: "Chuyên ngành", workplace: "Nơi công tác",
    contact: "Kết nối với bác sĩ", contactNote: "Thông tin liên hệ trực tiếp dành cho bạn.", phone: "Điện thoại", email: "Email", website: "Website", location: "Địa chỉ công tác", directions: "Xem đường đi", empty: "Thông tin liên hệ sẽ sớm được cập nhật tại đây.",
    related: "Thông tin liên quan", relatedNote: "Hồ sơ tác giả, bài viết chuyên môn và lịch khám.", authorProfile: "Hồ sơ tác giả", articles: "Bài viết chuyên môn", instituteProfile: "Trang tác giả IFR", examinationSchedule: "Lịch khám bác sĩ",
    save: "Lưu danh bạ", saveNote: "Lưu thông tin để thuận tiện liên hệ.", share: "Chia sẻ hồ sơ", copied: "Đã sao chép liên kết", fallback: "Sao chép địa chỉ trên trình duyệt để chia sẻ.", skip: "Bỏ qua mở đầu", intro: "Chào mừng", language: "Chọn ngôn ngữ", footer: "Một kết nối nhỏ. Một khởi đầu ý nghĩa.", identity: "BÁC SĨ · Y HỌC CƠ XƯƠNG KHỚP", image: "Minh họa y khoa", skipContent: "Đến nội dung chính",
  },
  ja: {
    profile: "医師プロフィール", eyebrow: "身近なつながり。小さな思いやりから。", doctor: "医師", specialty: "専門分野", care: "専門プロフィール",
    degree: "職位", training: "研修", expertise: "専門分野", workplace: "勤務先",
    contact: "お問い合わせ", contactNote: "こちらから直接ご連絡いただけます。", phone: "電話", email: "メール", website: "ウェブサイト", location: "勤務先", directions: "アクセス", empty: "連絡先は近日中に掲載いたします。",
    related: "関連情報", relatedNote: "執筆者プロフィール、専門記事、診療予定。", authorProfile: "執筆者プロフィール", articles: "専門記事", instituteProfile: "IFR 執筆者ページ", examinationSchedule: "診療予定",
    save: "連絡先を保存", saveNote: "いつでも連絡できるように。", share: "プロフィールを共有", copied: "リンクをコピーしました", fallback: "ブラウザのアドレスをコピーして共有してください。", skip: "イントロをスキップ", intro: "ようこそ", language: "言語を選択", footer: "小さなつながりが、大切な始まりに。", identity: "医師 · 運動器医学", image: "医療イラスト", skipContent: "本文へ移動",
  },
};
