// AI Provider - Ollama API with API key support

export interface AIProviderConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
}

export interface AIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

const defaultConfig: AIProviderConfig = {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    apiKey: process.env.OLLAMA_API_KEY || "",
    model: process.env.OLLAMA_MODEL || "llama3.1",
};

export async function generateCompletion(
    messages: AIMessage[],
    config: AIProviderConfig = defaultConfig
): Promise<string> {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (config.apiKey) {
            headers["Authorization"] = `Bearer ${config.apiKey}`;
        }

        const response = await fetch(`${config.baseUrl}/api/chat`, {
            method: "POST",
            headers,
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
            const errorText = await response.text();
            console.error("Ollama API error:", response.status, errorText);
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
        const headers: Record<string, string> = {};
        if (config.apiKey) {
            headers["Authorization"] = `Bearer ${config.apiKey}`;
        }
        const response = await fetch(`${config.baseUrl}/api/tags`, { headers });
        return response.ok;
    } catch {
        return false;
    }
}
