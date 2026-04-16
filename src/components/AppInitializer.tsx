"use client";

import { useEffect } from "react";
import { initializeTheme } from "@/lib/store/theme";
import { initializeLanguage } from "@/lib/store/language";

export function AppInitializer() {
    useEffect(() => {
        initializeTheme();
        initializeLanguage();
    }, []);
    return null;
}
