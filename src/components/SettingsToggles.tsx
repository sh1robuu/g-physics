"use client";

import { Sun, Moon, Globe } from "lucide-react";
import { useThemeStore } from "@/lib/store/theme";
import { useLanguageStore } from "@/lib/store/language";

interface SettingsTogglesProps {
    compact?: boolean;
}

export function SettingsToggles({ compact = false }: SettingsTogglesProps) {
    const { theme, toggleTheme } = useThemeStore();
    const { locale, setLocale } = useLanguageStore();

    return (
        <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`${compact ? "p-1.5" : "p-2"} rounded-full transition-colors text-white/40 hover:text-white/80 hover:bg-white/5`}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle theme"
            >
                {theme === "dark" ? (
                    <Sun className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
                ) : (
                    <Moon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
                )}
            </button>

            {/* Language Toggle */}
            <button
                onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
                className={`${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"} rounded-full transition-colors font-medium border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5`}
                title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                aria-label="Toggle language"
            >
                {locale === "vi" ? "EN" : "VI"}
            </button>
        </div>
    );
}
