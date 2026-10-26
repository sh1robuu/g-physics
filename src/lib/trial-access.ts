export type MemberFeature = "tutor" | "resources" | "profile" | "settings" | "feedback" | "progress";

export const MEMBER_FEATURES: Record<MemberFeature, { vi: string; en: string }> = {
    tutor: { vi: "Gia sư AI", en: "AI tutor" },
    resources: { vi: "Tài liệu cá nhân", en: "Personal resources" },
    profile: { vi: "Hồ sơ học tập", en: "Learning profile" },
    settings: { vi: "Cài đặt học tập", en: "Learning preferences" },
    feedback: { vi: "Gửi góp ý", en: "Send feedback" },
    progress: { vi: "Nhịp học của bạn", en: "Your learning rhythm" },
};

/** Public curriculum and practice stay available; member screens require a session. */
export function getMemberFeature(pathname: string): MemberFeature | null {
    const routes: Record<string, MemberFeature> = {
        "/tutor": "tutor", "/profile": "profile", "/settings": "settings", "/feedback": "feedback",
    };
    return routes[pathname.replace(/\/+$/, "")] ?? null;
}
