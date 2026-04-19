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
    imageBase64?: string[]; // base64-encoded image data (without data:image/... prefix)
    modelOverride?: string;
    aiPrefs?: AIPreferences;
}

export interface DiagnosisData {
    topic?: string;
    concept?: string;
    breakdown?: string;
}

export interface TutoringResponse {
    content: string;
    mode: TutoringMode;
    confidence: number;
    isGrounded: boolean;
    suggestedNextMode?: TutoringMode;
    detectedTopic?: string;
    detectedSubtopic?: string;
    diagnosis?: DiagnosisData;
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
    const { question, mode, conversationHistory, topicContext, imageDescription, imageBase64, modelOverride, aiPrefs } = request;

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
    if (imageBase64 && imageBase64.length > 0) {
        userContent += `\n\n[Học sinh đã gửi ${imageBase64.length} hình ảnh. Hãy phân tích kĩ hình ảnh để hiểu đề bài và bài giải của học sinh.]`;
    } else if (imageDescription) {
        userContent += `\n\n[Mô tả hình ảnh/tài liệu: ${imageDescription}]`;
    }

    const userMessage: AIMessage = { role: "user", content: userContent };
    if (imageBase64 && imageBase64.length > 0) {
        userMessage.images = imageBase64;
    }
    messages.push(userMessage);

    const config = modelOverride
        ? { baseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com/api", apiKey: process.env.OLLAMA_API_KEY || "", model: modelOverride }
        : undefined;
    const rawContent = await generateCompletion(messages, config);

    const suggestedNextMode = getNextMode(effectiveMode);
    const diagnosis = parseDiagnosis(rawContent);

    return {
        content: rawContent,
        mode: effectiveMode,
        confidence: estimateConfidence(rawContent),
        isGrounded: true,
        suggestedNextMode: suggestedNextMode ?? undefined,
        detectedTopic: diagnosis?.topic || extractTopic(question),
        detectedSubtopic: undefined,
        diagnosis,
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

function parseDiagnosis(content: string): DiagnosisData | undefined {
    // Look for the 📊 **Chẩn đoán:** block in the AI response
    const diagnosisMatch = content.match(/📊\s*\*\*Chẩn đoán[:\s]*\*\*/i);
    if (!diagnosisMatch) return undefined;

    const startIdx = diagnosisMatch.index! + diagnosisMatch[0].length;
    // Extract lines after the diagnosis header until next section (starting with emoji or ═══)
    const remaining = content.slice(startIdx);
    const endMatch = remaining.match(/\n(?:📋|📐|📝|🔢|✅|💡|🔹|═══|\n\n)/m);
    const block = endMatch ? remaining.slice(0, endMatch.index!) : remaining.slice(0, 500);

    const topicMatch = block.match(/[-•]\s*Chủ đề\s*[:：]\s*(.+)/i);
    const conceptMatch = block.match(/[-•]\s*Khái niệm(?:\s+kiểm tra)?\s*[:：]\s*(.+)/i);
    const breakdownMatch = block.match(/[-•]\s*Điểm vướng mắc\s*[:：]\s*(.+)/i);

    const topic = topicMatch?.[1]?.trim();
    const concept = conceptMatch?.[1]?.trim();
    const breakdown = breakdownMatch?.[1]?.trim();

    if (!topic && !concept && !breakdown) return undefined;

    return { topic, concept, breakdown };
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
