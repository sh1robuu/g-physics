"use client";

import type {} from "react/canary";
import { useLayoutEffect, useRef, ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

/** One persistent boundary captures both sides of navigation, including layout changes. */
export function RouteTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const container = useRef<HTMLDivElement>(null);
    const historyDestination = useRef<string | null>(null);
    // Different snapshot names preserve each page's own size and scroll offset.
    // Changing the name (not a React key) leaves shared layouts and providers mounted.
    const snapshotName = `page-${encodeURIComponent(pathname).replace(/%/g, "_")}`;

    useLayoutEffect(() => {
        const rememberHistoryNavigation = () => { historyDestination.current = window.location.pathname; };
        window.addEventListener("popstate", rememberHistoryNavigation, true);
        return () => window.removeEventListener("popstate", rememberHistoryNavigation, true);
    }, []);

    useLayoutEffect(() => {
        // React handles the exit, the asynchronous route commit and the entry natively.
        // Cached Back/Forward restores can be synchronous, so React skips that capture.
        const element = container.current;
        const restoringHistory = historyDestination.current === pathname;
        historyDestination.current = null;
        const capturingNatively = element?.style.viewTransitionName && element.style.viewTransitionName !== "none";
        if (typeof document.startViewTransition === "function" && (!restoringHistory || capturingNatively)) return;
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!element?.animate || motionPreference.matches) return;
        const animation = element.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 260, easing: "ease-out" },
        );
        const cancelIfReduced = () => { if (motionPreference.matches) animation.cancel(); };
        motionPreference.addEventListener("change", cancelIfReduced);
        return () => {
            animation.cancel();
            motionPreference.removeEventListener("change", cancelIfReduced);
        };
    }, [pathname]);

    return (
        <MotionConfig reducedMotion="user">
            <ViewTransition name={snapshotName} default="none" update="page-crossfade">
                <div ref={container} className="app-page">{children}</div>
            </ViewTransition>
        </MotionConfig>
    );
}
