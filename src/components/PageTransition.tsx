import type { ReactNode } from "react";

/** Layout wrapper only. RouteTransition owns the single, app-wide animation. */
export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`page-transition ${className}`}>{children}</div>;
}
