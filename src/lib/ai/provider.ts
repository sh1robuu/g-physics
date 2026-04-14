// AI Provider - Ollama Cloud API with API key support

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
    baseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com/api",
    apiKey: process.env.OLLAMA_API_KEY || "",
    model: process.env.OLLAMA_MODEL || "gemini-3-flash-preview:cloud",
};

export async function generateCompletion(
    messages: AIMessage[],
    config: AIProviderConfig = defaultConfig
): Promise<string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (config.apiKey) {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    // baseUrl is already https://ollama.com/api, so append /chat directly
    const url = `${config.baseUrl.replace(/\/+$/, "")}/chat`;

    const response = await fetch(url, {
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
        throw new Error(`AI API error: ${response.status} - ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    return data.message?.content || "Không thể tạo phản hồi.";
}

export async function checkOllamaHealth(
    config: AIProviderConfig = defaultConfig
): Promise<boolean> {
    try {
        const headers: Record<string, string> = {};
        if (config.apiKey) {
            headers["Authorization"] = `Bearer ${config.apiKey}`;
        }
        const url = `${config.baseUrl.replace(/\/+$/, "").replace(/\/api$/, "")}/api/tags`;
        const response = await fetch(url, { headers });
        return response.ok;
    } catch {
        return false;
    }
}
