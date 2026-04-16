"use client";

import { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
    content: string;
    className?: string;
}

/**
 * Renders text with LaTeX math expressions AND markdown formatting.
 * Supports:
 * - Display math: $$...$$
 * - Inline math: $...$  (but not inside words like a$b)
 * - Markdown: **bold**, *italic*, ### headings, - lists, paragraphs
 */
export function MathRenderer({ content, className = "" }: MathRendererProps) {
    const rendered = useMemo(() => {
        if (!content) return "";

        // ── Step 1: Protect math expressions ──
        // Replace math blocks with placeholders so markdown processing doesn't break them
        const mathBlocks: string[] = [];
        const placeholder = (i: number) => `%%MATH_BLOCK_${i}%%`;

        // Display math: $$...$$
        let result = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
            const idx = mathBlocks.length;
            try {
                mathBlocks.push(`<div class="math-display">${katex.renderToString(tex.trim(), {
                    displayMode: true,
                    throwOnError: false,
                    trust: true,
                })}</div>`);
            } catch {
                mathBlocks.push(`<div class="math-display math-error">${tex}</div>`);
            }
            return placeholder(idx);
        });

        // Inline math: $...$ (but not $$)
        result = result.replace(/(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)/g, (_, tex) => {
            const idx = mathBlocks.length;
            try {
                mathBlocks.push(katex.renderToString(tex.trim(), {
                    displayMode: false,
                    throwOnError: false,
                    trust: true,
                }));
            } catch {
                mathBlocks.push(`<span class="math-error">${tex}</span>`);
            }
            return placeholder(idx);
        });

        // ── Step 2: Convert markdown to HTML ──
        result = markdownToHtml(result);

        // ── Step 3: Restore math blocks ──
        for (let i = 0; i < mathBlocks.length; i++) {
            result = result.replace(placeholder(i), mathBlocks[i]);
        }

        return result;
    }, [content]);

    return (
        <div
            className={`math-content markdown-body ${className}`}
            dangerouslySetInnerHTML={{ __html: rendered }}
        />
    );
}

/**
 * Lightweight markdown → HTML converter.
 * Handles: headings, bold, italic, bold-italic, strikethrough,
 * inline code, code blocks, unordered/ordered lists, blockquotes,
 * horizontal rules, links, and paragraphs.
 */
function markdownToHtml(md: string): string {
    // Normalize line endings
    let text = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // ── Code blocks: ```...```  (protect from other processing) ──
    const codeBlocks: string[] = [];
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const idx = codeBlocks.length;
        const escaped = escapeHtml(code.trimEnd());
        codeBlocks.push(`<pre class="md-code-block"><code class="language-${lang || "text"}">${escaped}</code></pre>`);
        return `%%CODE_BLOCK_${idx}%%`;
    });

    // ── Inline code: `...` ──
    text = text.replace(/`([^`\n]+)`/g, '<code class="md-inline-code">$1</code>');

    // Split into lines for block-level processing
    const lines = text.split("\n");
    const output: string[] = [];
    let inList = false;
    let listType = "";
    let inBlockquote = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Headings: ### ... (up to h6)
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
            if (inList) { output.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
            if (inBlockquote) { output.push("</blockquote>"); inBlockquote = false; }
            const level = headingMatch[1].length;
            output.push(`<h${level} class="md-heading md-h${level}">${inlineMarkdown(headingMatch[2])}</h${level}>`);
            continue;
        }

        // Horizontal rule: ---, ***, ___
        if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
            if (inList) { output.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
            output.push('<hr class="md-hr" />');
            continue;
        }

        // Blockquote
        const bqMatch = line.match(/^>\s?(.*)/);
        if (bqMatch) {
            if (!inBlockquote) { output.push('<blockquote class="md-blockquote">'); inBlockquote = true; }
            output.push(`<p>${inlineMarkdown(bqMatch[1])}</p>`);
            continue;
        } else if (inBlockquote) {
            output.push("</blockquote>");
            inBlockquote = false;
        }

        // Unordered list: - item or * item
        const ulMatch = line.match(/^\s*[-*+]\s+(.*)/);
        if (ulMatch) {
            if (!inList || listType !== "ul") {
                if (inList) output.push(listType === "ul" ? "</ul>" : "</ol>");
                output.push('<ul class="md-list">');
                inList = true;
                listType = "ul";
            }
            output.push(`<li>${inlineMarkdown(ulMatch[1])}</li>`);
            continue;
        }

        // Ordered list: 1. item
        const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
        if (olMatch) {
            if (!inList || listType !== "ol") {
                if (inList) output.push(listType === "ul" ? "</ul>" : "</ol>");
                output.push('<ol class="md-list md-ol">');
                inList = true;
                listType = "ol";
            }
            output.push(`<li>${inlineMarkdown(olMatch[1])}</li>`);
            continue;
        }

        // Close list if we hit a non-list line
        if (inList) {
            output.push(listType === "ul" ? "</ul>" : "</ol>");
            inList = false;
        }

        // Empty line → paragraph break
        if (line.trim() === "") {
            output.push("");
            continue;
        }

        // Regular paragraph
        output.push(`<p class="md-paragraph">${inlineMarkdown(line)}</p>`);
    }

    // Close any open tags
    if (inList) output.push(listType === "ul" ? "</ul>" : "</ol>");
    if (inBlockquote) output.push("</blockquote>");

    let html = output.join("\n");

    // Restore code blocks
    for (let i = 0; i < codeBlocks.length; i++) {
        html = html.replace(`%%CODE_BLOCK_${i}%%`, codeBlocks[i]);
    }

    return html;
}

/** Process inline markdown: bold, italic, strikethrough, links */
function inlineMarkdown(text: string): string {
    let result = text;

    // Bold + Italic: ***text*** or ___text___
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

    // Bold: **text** or __text__
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_  (not inside words for _)
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
    result = result.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>');

    // Strikethrough: ~~text~~
    result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>');

    return result;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
