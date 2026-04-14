"use client";

import { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
    content: string;
    className?: string;
}

/**
 * Renders text with LaTeX math expressions.
 * Supports:
 * - Display math: $$...$$
 * - Inline math: $...$
 * - Regular text passes through as-is
 */
export function MathRenderer({ content, className = "" }: MathRendererProps) {
    const rendered = useMemo(() => {
        if (!content) return "";

        // Split by display math first ($$...$$), then inline math ($...$)
        // Process display math: $$...$$
        let result = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
            try {
                return `<div class="math-display">${katex.renderToString(tex.trim(), {
                    displayMode: true,
                    throwOnError: false,
                    trust: true,
                })}</div>`;
            } catch {
                return `<div class="math-display math-error">${tex}</div>`;
            }
        });

        // Process inline math: $...$  (but not $$)
        result = result.replace(/(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)/g, (_, tex) => {
            try {
                return katex.renderToString(tex.trim(), {
                    displayMode: false,
                    throwOnError: false,
                    trust: true,
                });
            } catch {
                return `<span class="math-error">${tex}</span>`;
            }
        });

        return result;
    }, [content]);

    return (
        <div
            className={`math-content ${className}`}
            dangerouslySetInnerHTML={{ __html: rendered }}
        />
    );
}
