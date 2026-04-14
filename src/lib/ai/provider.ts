// AI Provider adapter for Ollama
// Supports structured tutoring with progressive modes

export interface AIProviderConfig {
    baseUrl: string;
    model: string;
}

export interface AIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AICompletionResponse {
    content: string;
    model: string;
    done: boolean;
}

const defaultConfig: AIProviderConfig = {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.1",
};

export async function generateCompletion(
    messages: AIMessage[],
    config: AIProviderConfig = defaultConfig
): Promise<string> {
    try {
        const response = await fetch(`${config.baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: config.model,
                messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    num_predict: 2048,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        return data.message?.content || "Không thể tạo phản hồi.";
    } catch (error) {
        console.error("AI Provider error:", error);
        return "⚠️ Không thể kết nối với AI. Vui lòng kiểm tra Ollama đang chạy.";
    }
}

export async function checkOllamaHealth(
    config: AIProviderConfig = defaultConfig
): Promise<boolean> {
    try {
        const response = await fetch(`${config.baseUrl}/api/tags`);
        return response.ok;
    } catch {
        return false;
    }
}
