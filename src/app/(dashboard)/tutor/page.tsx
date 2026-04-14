"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Lightbulb,
    BookOpen,
    Target,
    GraduationCap,
    Sparkles,
    Upload,
    ImageIcon,
    ChevronRight,
    RotateCcw,
    Zap,
    CheckCircle2,
    AlertCircle,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TutoringMode } from "@/types";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    mode?: TutoringMode;
    confidence?: number;
    isGrounded?: boolean;
    timestamp: Date;
}

const modes: { key: TutoringMode; label: string; labelVi: string; icon: typeof Lightbulb; color: string; bg: string; desc: string }[] = [
    {
        key: "AUTO",
        label: "Auto",
        labelVi: "Tự động",
        icon: Sparkles,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10 border-indigo-400/20",
        desc: "AI chọn mức hỗ trợ phù hợp",
    },
    {
        key: "HINT",
        label: "Hint",
        labelVi: "Gợi ý",
        icon: Lightbulb,
        color: "text-amber-400",
        bg: "bg-amber-400/10 border-amber-400/20",
        desc: "Chỉ đưa ra gợi ý chiến lược",
    },
    {
        key: "CONCEPT",
        label: "Concept",
        labelVi: "Khái niệm",
        icon: BookOpen,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10 border-cyan-400/20",
        desc: "Giải thích nguyên lý và công thức liên quan",
    },
    {
        key: "GUIDED",
        label: "Guided",
        labelVi: "Hướng dẫn",
        icon: Target,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10 border-emerald-400/20",
        desc: "Hướng dẫn từng bước, yêu cầu tham gia",
    },
    {
        key: "FULL_SOLUTION",
        label: "Full",
        labelVi: "Giải đầy đủ",
        icon: GraduationCap,
        color: "text-violet-400",
        bg: "bg-violet-400/10 border-violet-400/20",
        desc: "Lời giải hoàn chỉnh theo format bài thi",
    },
];

// Concept cards for Grade 12 Physics topics
const conceptCards = [
    { topic: "Dao động cơ", formulas: ["x = Acos(ωt + φ)", "T = 2π/ω", "E = ½kA²"], chapter: 1 },
    { topic: "Sóng cơ", formulas: ["v = λf", "d = kλ (cực đại)", "d = (k+½)λ (cực tiểu)"], chapter: 2 },
    { topic: "Dòng điện xoay chiều", formulas: ["Z = √(R² + (ZL-ZC)²)", "P = UIcosφ", "cosφ = R/Z"], chapter: 3 },
    { topic: "Sóng điện từ", formulas: ["c = λf", "f = 1/(2π√LC)"], chapter: 4 },
    { topic: "Sóng ánh sáng", formulas: ["x_k = kλD/a", "Δx = λD/a"], chapter: 5 },
    { topic: "Lượng tử ánh sáng", formulas: ["ε = hf", "eU_h = hf - A"], chapter: 6 },
    { topic: "Hạt nhân nguyên tử", formulas: ["E = Δm·c²", "N = N₀·e^(-λt)", "T = ln2/λ"], chapter: 7 },
];

export default function TutorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [currentMode, setCurrentMode] = useState<TutoringMode>("AUTO");
    const [isLoading, setIsLoading] = useState(false);
    const [showConcepts, setShowConcepts] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Resize textarea back
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        try {
            const res = await fetch("/api/tutoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: userMsg.content,
                    mode: currentMode,
                    history: messages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content || "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
                mode: data.mode || currentMode,
                confidence: data.confidence,
                isGrounded: data.isGrounded,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "⚠️ Không thể kết nối với AI. Vui lòng kiểm tra Ollama đang chạy trên http://localhost:11434",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }

        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleTextareaInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
        }
    };

    const currentModeInfo = modes.find((m) => m.key === currentMode)!;

    return (
        <div className="w-full h-full flex flex-col relative z-10 p-4 lg:p-6">
            {/* Mode Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 shrink-0">
                {modes.map((mode) => (
                    <button
                        key={mode.key}
                        onClick={() => setCurrentMode(mode.key)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                            currentMode === mode.key
                                ? `${mode.bg} ${mode.color}`
                                : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                        )}
                    >
                        <mode.icon className="w-4 h-4" />
                        {mode.labelVi}
                    </button>
                ))}
            </div>

            {/* Mode Description */}
            <div className={cn("mb-4 px-4 py-2.5 rounded-xl border text-sm flex items-center gap-2 shrink-0", currentModeInfo.bg)}>
                <currentModeInfo.icon className={cn("w-4 h-4", currentModeInfo.color)} />
                <span className={currentModeInfo.color}>{currentModeInfo.desc}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto rounded-3xl glass-panel p-4 lg:p-6 space-y-6 mb-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
                            <Sparkles className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-3">Chào mừng đến với Gia sư AI</h3>
                        <p className="text-sm text-white/50 max-w-md leading-relaxed">
                            Gửi câu hỏi Vật lý lớp 12 và nhận hướng dẫn có cấu trúc. Chọn chế độ hỗ trợ phù hợp hoặc để AI tự chọn.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3 justify-center">
                            {["Con lắc lò xo dao động điều hòa", "Bài tập mạch RLC", "Giải thích hiệu ứng quang điện"].map((q) => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                                    className="text-sm px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white/90 hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] lg:max-w-[75%] rounded-3xl px-5 py-4 shadow-lg backdrop-blur-md",
                                        msg.role === "user"
                                            ? "bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 text-white rounded-tr-sm"
                                            : "bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-sm floating-panel"
                                    )}
                                >
                                    {msg.role === "assistant" && msg.mode && (
                                        <div className="flex items-center gap-2 mb-3">
                                            {(() => {
                                                const m = modes.find((md) => md.key === msg.mode);
                                                if (!m) return null;
                                                return (
                                                    <span className={cn("text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border", m.bg, m.color)}>
                                                        {m.labelVi}
                                                    </span>
                                                );
                                            })()}
                                            {msg.confidence != null && (
                                                <span className={cn("text-xs font-medium flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5",
                                                    msg.confidence > 0.8 ? "text-emerald-400" : "text-amber-400"
                                                )}>
                                                    {msg.confidence > 0.8 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                                    {Math.round(msg.confidence * 100)}%
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed tracking-wide font-sans">{msg.content}</div>
                                    <div className="text-[10px] text-white/30 mt-3 font-mono">
                                        {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="floating-panel rounded-3xl rounded-tl-sm px-6 py-4 flex items-center gap-3">
                                    <span className="text-sm font-medium text-white/50 mr-2">AI đang suy nghĩ</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-2" />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="floating-panel p-3 shrink-0 rounded-3xl mt-auto">
                <form onSubmit={handleSubmit} className="flex items-end gap-3 relative z-20">
                    <div className="flex gap-2">
                        <button type="button" className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all" title="Upload ảnh">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all" title="Upload tài liệu">
                            <Upload className="w-5 h-5" />
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onInput={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập câu hỏi Vật lý..."
                        className="flex-1 glass-input resize-none py-3.5 px-4 rounded-2xl min-h-[52px] max-h-[150px] text-base"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className={cn(
                            "p-3 rounded-2xl transition-all shadow-lg",
                            input.trim() && !isLoading
                                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 shadow-indigo-500/25 border border-indigo-400/50"
                                : "bg-white/[0.05] border border-white/5 text-white/20"
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
