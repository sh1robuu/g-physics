"use client";

import { Sun, Moon, Settings } from "lucide-react";
import { useThemeStore } from "@/lib/store/theme";
import { useLanguageStore } from "@/lib/store/language";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

interface SettingsTogglesProps {
    compact?: boolean;
}

export function SettingsToggles({ compact = false }: SettingsTogglesProps) {
    const { theme, toggleTheme } = useThemeStore();
    const { locale, setLocale } = useLanguageStore();
    const { t } = useTranslation();

    if (compact) {
        // Compact inline version (for header etc.)
        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-full transition-colors text-white/40 hover:text-white/80 hover:bg-white/5"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
                <button
                    onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
                    className="px-1.5 py-0.5 text-[10px] rounded-full transition-colors font-medium border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5"
                    aria-label="Toggle language"
                >
                    {locale === "vi" ? "EN" : "VI"}
                </button>
            </div>
        );
    }

    // Full sidebar version — big toggle rows
    return (
        <div className="space-y-1">
            {/* Theme Toggle Row */}
            <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
            >
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="flex-1 text-left">{theme === "dark" ? t("theme.dark") : t("theme.light")}</span>
                {/* Segmented pill switch */}
                <div className="flex rounded-full bg-white/10 p-0.5">
                    <span className={`px-2 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${theme === "light" ? "bg-amber-500/30 text-amber-300" : "text-white/30"
                        }`}><Sun className="w-3.5 h-3.5" /></span>
                    <span className={`px-2 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${theme === "dark" ? "bg-indigo-500/30 text-indigo-300" : "text-white/30"
                        }`}><Moon className="w-3.5 h-3.5" /></span>
                </div>
            </button>

            {/* Language Toggle Row */}
            <button
                onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
            >
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">🌐</span>
                <span className="flex-1 text-left">{locale === "vi" ? "Tiếng Việt" : "English"}</span>
                {/* EN/VN pill switch */}
                <div className="flex rounded-full bg-white/10 p-0.5 text-[11px] font-semibold">
                    <span className={`px-2 py-0.5 rounded-full transition-all duration-200 ${locale === "en" ? "bg-indigo-500/30 text-indigo-300" : "text-white/30"
                        }`}>EN</span>
                    <span className={`px-2 py-0.5 rounded-full transition-all duration-200 ${locale === "vi" ? "bg-indigo-500/30 text-indigo-300" : "text-white/30"
                        }`}>VN</span>
                </div>
            </button>

            {/* Settings Link */}
            <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
            >
                <Settings className="w-5 h-5" />
                Cài đặt
            </Link>
        </div>
    );
}
