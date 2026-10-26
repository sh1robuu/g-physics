"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, LockKeyhole, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTranslation } from "@/lib/i18n";
import { buildAuthHref, getSafeReturnPath } from "@/lib/auth-redirect";
import { getMemberFeature, MEMBER_FEATURES, type MemberFeature } from "@/lib/trial-access";

type AccessContext = { requireAccess: (feature: MemberFeature, destination?: string) => boolean };
const TrialContext = createContext<AccessContext | null>(null);

export function useTrialAccess() {
    const context = useContext(TrialContext);
    if (!context) throw new Error("useTrialAccess must be used within TrialAccessProvider");
    return context;
}

export function TrialAccessProvider({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const { locale } = useTranslation();
    const vi = locale === "vi";
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const [request, setRequest] = useState<{ feature: MemberFeature; destination: string } | null>(null);
    const requireAccess = useCallback((feature: MemberFeature, destination?: string) => {
        if (user) return true;
        setRequest({ feature, destination: getSafeReturnPath(destination ?? window.location.pathname + window.location.search) });
        return false;
    }, [user]);

    useEffect(() => {
        if (!request) return;
        if (user) {
            dialog.current?.close();
            router.push(request.destination);
        } else if (!dialog.current?.open) {
            dialog.current?.showModal();
        }
    }, [request, user, router]);

    const interceptMemberLink = (event: MouseEvent<HTMLDivElement>) => {
        if (user || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
        if (!link || link.hasAttribute("download") || link.target === "_blank") return;
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        const feature = getMemberFeature(url.pathname);
        if (!feature) return;
        event.preventDefault(); event.stopPropagation();
        requireAccess(feature, url.pathname + url.search + url.hash);
    };
    const close = () => dialog.current?.close();
    const featureName = request ? MEMBER_FEATURES[request.feature][vi ? "vi" : "en"] : "";

    return <TrialContext.Provider value={{ requireAccess }}>
        <div className="contents" onClickCapture={interceptMemberLink}>{children}</div>
        <dialog ref={dialog} aria-labelledby="trial-login-title" aria-describedby="trial-login-description" onClose={() => setRequest(null)} onClick={(event) => { if (event.target === event.currentTarget) close(); }} className="trial-login-dialog m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-0 text-[var(--ink)] shadow-xl backdrop:bg-black/35">
            <div className="relative p-7 sm:p-8" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="icon-button absolute right-4 top-4" onClick={close} aria-label={vi ? "Đóng yêu cầu đăng nhập" : "Close sign-in request"}><X size={19}/></button>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]"><LockKeyhole size={23}/></span>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">{vi ? "BẠN ĐANG HỌC THỬ" : "YOU’RE EXPLORING THE DEMO"}</p>
                <h2 id="trial-login-title" className="text-2xl font-semibold tracking-tight">{isLoading ? (vi ? "Đang kiểm tra đăng nhập…" : "Checking your session…") : (vi ? "Đăng nhập để học tiếp" : "Sign in to continue")}</h2>
                <p id="trial-login-description" className="mt-3 text-sm leading-6 text-[var(--muted)]">{vi ? `${featureName} dành cho người dùng đã đăng nhập. Bạn vẫn có thể xem kiến thức và luyện tập trong phần học thử.` : `${featureName} is available after sign-in. You can still explore the curriculum and practice in the demo.`}</p>
                {request && !isLoading && <div className="mt-6 grid gap-3">
                    <Link href={buildAuthHref("/login", request.destination)} onClick={close} className="btn-primary justify-center">{vi ? "Đăng nhập" : "Log in"}<ArrowRight size={17}/></Link>
                    <Link href={buildAuthHref("/signup", request.destination)} onClick={close} className="btn-secondary justify-center">{vi ? "Tạo tài khoản" : "Create account"}</Link>
                </div>}
                <button type="button" onClick={close} className="mt-5 w-full text-center text-sm text-[var(--muted)] hover:text-[var(--ink)]">{vi ? "Tiếp tục học thử" : "Keep exploring"}</button>
            </div>
        </dialog>
    </TrialContext.Provider>;
}

/** Prevents member pages (and their effects) from mounting through a direct URL. */
export function TrialRouteGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const params = useSearchParams();
    const { user, isLoading } = useAuth();
    const { requireAccess } = useTrialAccess();
    const { locale } = useTranslation();
    const vi = locale === "vi";
    const feature = getMemberFeature(pathname);
    const destination = pathname + (params.size ? `?${params.toString()}` : "");
    useEffect(() => {
        if (feature && !user && !isLoading) requireAccess(feature, destination);
    }, [feature, destination, user, isLoading, requireAccess]);
    if (!feature || user) return children;
    if (isLoading) return <p role="status" className="p-8 text-sm text-[var(--muted)]">{vi ? "Đang kiểm tra đăng nhập…" : "Checking your session…"}</p>;
    return <section className="mx-auto my-10 max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
        <LockKeyhole size={28} className="mx-auto mb-4 text-[var(--brand)]"/>
        <h1 className="text-2xl font-semibold">{MEMBER_FEATURES[feature][vi ? "vi" : "en"]}</h1>
        <p className="my-4 text-sm leading-6 text-[var(--muted)]">{vi ? "Đăng nhập để sử dụng tính năng này, hoặc tiếp tục khám phá kiến thức và bài luyện." : "Sign in to use this feature, or keep exploring the curriculum and practice."}</p>
        <button className="btn-primary mx-auto" onClick={() => requireAccess(feature, destination)}>{vi ? "Đăng nhập để sử dụng" : "Sign in to use"}<ArrowRight size={16}/></button>
        <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--brand)]"><BookOpen size={16}/>{vi ? "Về phần học thử" : "Back to the demo"}</Link>
    </section>;
}
