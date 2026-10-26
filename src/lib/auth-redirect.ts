const FALLBACK_PATH = "/dashboard";
const RETURN_PATHS = new Set(["/dashboard", "/library", "/tutor", "/practice", "/profile", "/settings", "/feedback"]);

/** Keep login return destinations inside known learning pages. */
export function getSafeReturnPath(value: string | null | undefined): string {
    if (!value || value.length > 2048 || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return FALLBACK_PATH;
    try {
        const decoded = decodeURIComponent(value);
        if (/[\\\u0000-\u001f]/.test(decoded)) return FALLBACK_PATH;
        const url = new URL(value, "https://g-physics.local");
        if (url.origin !== "https://g-physics.local" || !RETURN_PATHS.has(url.pathname)) return FALLBACK_PATH;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return FALLBACK_PATH;
    }
}

export function buildAuthHref(page: "/login" | "/signup", returnPath?: string | null): string {
    return `${page}?next=${encodeURIComponent(getSafeReturnPath(returnPath))}`;
}
