// Tutoring engine - orchestrates AI tutoring with progressive modes

import { generateCompletion, type AIMessage } from "./provider";
import { getSystemPrompt, type AIPreferences } from "./prompts";
import type { TutoringMode } from "@/types";

export interface TutoringRequest {
    question: string;
    mode: TutoringMode;
    conversationHistory?: { role: "user" | "assistant"; content: string }[];
    topicContext?: string;
    imageDescription?: string;
    modelOverride?: string;
    aiPrefs?: AIPreferences;
}

export interface TutoringResponse {
    content: string;
    mode: TutoringMode;
    confidence: number;
    isGrounded: boolean;
    suggestedNextMode?: TutoringMode;
    detectedTopic?: string;
    detectedSubtopic?: string;
}

const MODE_PROGRESSION: TutoringMode[] = ["HINT", "CONCEPT", "GUIDED", "FULL_SOLUTION"];

export function getNextMode(currentMode: TutoringMode): TutoringMode | null {
    const currentIndex = MODE_PROGRESSION.indexOf(currentMode);
    if (currentIndex < 0 || currentIndex >= MODE_PROGRESSION.length - 1) return null;
    return MODE_PROGRESSION[currentIndex + 1];
}

export async function processQuestion(
    request: TutoringRequest
): Promise<TutoringResponse> {
    const { question, mode, conversationHistory, topicContext, imageDescription, modelOverride, aiPrefs } = request;

    const effectiveMode = mode === "AUTO" ? "HINT" : mode;
    const systemPrompt = getSystemPrompt(effectiveMode, aiPrefs);

    const messages: AIMessage[] = [
        { role: "system", content: systemPrompt },
    ];

    if (topicContext) {
        messages.push({
            role: "system",
            content: `Ngữ cảnh chủ đề: ${topicContext}`,
        });
    }

    if (conversationHistory) {
        for (const msg of conversationHistory) {
            messages.push({ role: msg.role, content: msg.content });
        }
    }

    let userContent = question;
    if (imageDescription) {
        userContent += `\n\n[Mô tả hình ảnh/tài liệu: ${imageDescription}]`;
    }
    messages.push({ role: "user", content: userContent });

    const config = modelOverride
        ? { baseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com/api", apiKey: process.env.OLLAMA_API_KEY || "", model: modelOverride }
        : undefined;
    const content = await generateCompletion(messages, config);

    const suggestedNextMode = getNextMode(effectiveMode);

    return {
        content,
        mode: effectiveMode,
        confidence: estimateConfidence(content),
        isGrounded: true,
        suggestedNextMode: suggestedNextMode ?? undefined,
        detectedTopic: extractTopic(question),
        detectedSubtopic: undefined,
    };
}

function estimateConfidence(response: string): number {
    const uncertainPhrases = [
        "không chắc",
        "có thể",
        "có lẽ",
        "cần xác nhận",
        "em kiểm tra lại",
        "không rõ",
    ];
    const hasUncertainty = uncertainPhrases.some((p) =>
        response.toLowerCase().includes(p)
    );
    return hasUncertainty ? 0.6 : 0.9;
}

function extractTopic(question: string): string | undefined {
    const topicKeywords: Record<string, string[]> = {
        "Dao động cơ": ["dao động", "con lắc", "lò xo", "chu kỳ", "tần số", "biên độ"],
        "Sóng cơ": ["sóng", "giao thoa", "nhiễu xạ", "sóng dừng", "bước sóng"],
        "Dòng điện xoay chiều": ["xoay chiều", "RLC", "cộng hưởng", "trở kháng", "công suất"],
        "Dao động và sóng điện từ": ["điện từ", "mạch LC", "sóng điện từ"],
        "Sóng ánh sáng": ["ánh sáng", "quang phổ", "tán sắc", "giao thoa ánh sáng"],
        "Lượng tử ánh sáng": ["photon", "quang điện", "lượng tử", "hiệu ứng quang điện"],
        "Vật lý hạt nhân": ["hạt nhân", "phóng xạ", "phân rã", "phản ứng hạt nhân", "năng lượng liên kết"],
    };

    const lowerQ = question.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some((kw) => lowerQ.includes(kw))) {
            return topic;
        }
    }
    return undefined;
}
