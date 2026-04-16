"use client";

import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: "dark",
    setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("g-physics-theme", theme);
        set({ theme });
    },
    toggleTheme: () => {
        set((state) => {
            const next = state.theme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("g-physics-theme", next);
            return { theme: next };
        });
    },
}));

// Initialize theme from localStorage on client
export function initializeTheme() {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("g-physics-theme") as Theme | null;
    const theme = stored || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    useThemeStore.setState({ theme });
}
