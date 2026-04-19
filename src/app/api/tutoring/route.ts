import { NextRequest, NextResponse } from "next/server";
import { processQuestion } from "@/lib/ai/engine";
import type { TutoringMode } from "@/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, mode, history, topicContext, imageDescription, imageBase64, model, aiPrefs } = body;

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Vui lòng nhập câu hỏi" },
                { status: 400 }
            );
        }

        const result = await processQuestion({
            question,
            mode: (mode as TutoringMode) || "AUTO",
            conversationHistory: history,
            topicContext,
            imageDescription,
            imageBase64,
            modelOverride: model,
            aiPrefs,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Tutoring API error:", error);
        return NextResponse.json(
            { error: "Lỗi hệ thống. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
