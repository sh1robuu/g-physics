"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    Filter,
    Play,
    Trophy,
    BarChart3,
    Sparkles,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock questions
const mockQuestions = [
    {
        id: "1",
        topic: "Dao động cơ",
        questionText: "Một con lắc lò xo dao động điều hòa với biên độ A = 5cm, tần số f = 2Hz. Tại thời điểm t=0, vật đi qua vị trí cân bằng theo chiều dương. Phương trình dao động của vật là:",
        options: [
            { key: "A", text: "x = 5cos(4πt - π/2) cm" },
            { key: "B", text: "x = 5cos(4πt + π/2) cm" },
            { key: "C", text: "x = 5cos(4πt) cm" },
            { key: "D", text: "x = 5cos(2πt - π/2) cm" },
        ],
        correctAnswer: "A",
        explanation: "ω = 2πf = 4π rad/s. Tại t=0, x=0 và v>0 → φ = -π/2. Vậy x = 5cos(4πt - π/2) cm.",
        difficulty: "MEDIUM" as const,
    },
    {
        id: "2",
        topic: "Sóng cơ",
        questionText: "Hai nguồn sóng kết hợp S1, S2 cách nhau 10cm dao động cùng pha với bước sóng λ = 2cm. Số điểm cực đại trên đoạn S1S2 là:",
        options: [
            { key: "A", text: "9" },
            { key: "B", text: "11" },
            { key: "C", text: "10" },
            { key: "D", text: "21" },
        ],
        correctAnswer: "B",
        explanation: "d1 - d2 = kλ. Ta có -S1S2/λ ≤ k ≤ S1S2/λ → -5 ≤ k ≤ 5. Có 11 giá trị k nguyên.",
        difficulty: "EASY" as const,
    },
    {
        id: "3",
        topic: "Dòng điện xoay chiều",
        questionText: "Cho mạch RLC nối tiếp có R = 100Ω, L = 1/π H, C = 10⁻⁴/π F. Đặt vào hai đầu mạch điện áp u = 200cos(100πt) V. Cường độ dòng điện hiệu dụng là:",
        options: [
            { key: "A", text: "1A" },
            { key: "B", text: "√2 A" },
            { key: "C", text: "2A" },
            { key: "D", text: "1/√2 A" },
        ],
        correctAnswer: "B",
        explanation: "ZL = ωL = 100Ω, ZC = 1/(ωC) = 100Ω. Z = √(R² + (ZL-ZC)²) = R = 100Ω. I = U/Z = 200/(√2·100) = √2 A.",
        difficulty: "MEDIUM" as const,
    },
    {
        id: "4",
        topic: "Lượng tử ánh sáng",
        questionText: "Giới hạn quang điện của kim loại kali là λ₀ = 0,55μm. Công thoát electron khỏi kim loại kali là: (h = 6,625×10⁻³⁴ Js, c = 3×10⁸ m/s)",
        options: [
            { key: "A", text: "3,6×10⁻¹⁹ J" },
            { key: "B", text: "36×10⁻¹⁹ J" },
            { key: "C", text: "2,26 eV" },
            { key: "D", text: "A và C đều đúng" },
        ],
        correctAnswer: "D",
        explanation: "A = hc/λ₀ = 6,625×10⁻³⁴ × 3×10⁸ / (0,55×10⁻⁶) = 3,6×10⁻¹⁹ J ≈ 2,26 eV.",
        difficulty: "EASY" as const,
    },
    {
        id: "5",
        topic: "Hạt nhân nguyên tử",
        questionText: "Chất phóng xạ X có chu kỳ bán rã T = 8 ngày. Ban đầu có 100g chất X. Sau 24 ngày, khối lượng chất X còn lại là:",
        options: [
            { key: "A", text: "12,5g" },
            { key: "B", text: "25g" },
            { key: "C", text: "6,25g" },
            { key: "D", text: "50g" },
        ],
        correctAnswer: "A",
        explanation: "Sau t = 24 ngày = 3T: m = m₀/2³ = 100/8 = 12,5g.",
        difficulty: "EASY" as const,
    },
];

const topics = ["Tất cả", "Dao động cơ", "Sóng cơ", "Dòng điện xoay chiều", "Sóng ánh sáng", "Lượng tử ánh sáng", "Hạt nhân nguyên tử"];
const difficulties = ["Tất cả", "EASY", "MEDIUM", "HARD"];

type ViewMode = "setup" | "practice" | "review";

export default function PracticePage() {
    const [view, setView] = useState<ViewMode>("setup");
    const [selectedTopic, setSelectedTopic] = useState("Tất cả");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const filteredQuestions = mockQuestions.filter((q) => {
        if (selectedTopic !== "Tất cả" && q.topic !== selectedTopic) return false;
        if (selectedDifficulty !== "Tất cả" && q.difficulty !== selectedDifficulty) return false;
        return true;
    });

    const currentQ = filteredQuestions[currentIndex];
    const totalCorrect = Object.entries(answers).filter(
        ([id, ans]) => mockQuestions.find((q) => q.id === id)?.correctAnswer === ans
    ).length;

    const startPractice = () => {
        setView("practice");
        setCurrentIndex(0);
        setAnswers({});
        setShowExplanation(false);
        setIsSubmitted(false);
    };

    const selectAnswer = (key: string) => {
        if (isSubmitted) return;
        setAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
    };

    const submitAnswer = () => {
        setIsSubmitted(true);
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIndex < filteredQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setIsSubmitted(false);
            setShowExplanation(false);
        } else {
            setView("review");
        }
    };

    const diffLabel = (d: string) => {
        switch (d) {
            case "EASY": return "Dễ";
            case "MEDIUM": return "Trung bình";
            case "HARD": return "Khó";
            default: return d;
        }
    };

    // ==================== SETUP VIEW ====================
    if (view === "setup") {
        return (
            <div className="max-w-4xl mx-auto space-y-6 p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white mb-1">Luyện đề Vật lý</h1>
                    <p className="text-white/50 text-sm">Chọn chủ đề và mức độ để bắt đầu phiên luyện tập</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Topic Filter */}
                    <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-indigo-400" />
                            Chủ đề
                        </h3>
                        <div className="space-y-2">
                            {topics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTopic(t)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all",
                                        selectedTopic === t
                                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                                            : "text-white/50 hover:text-white/70 hover:bg-white/[0.04]"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Difficulty + Start */}
                    <div className="space-y-6">
                        <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                Mức độ
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {difficulties.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDifficulty(d)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                                            selectedDifficulty === d
                                                ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                                : "text-white/40 border-white/5 hover:text-white/60 hover:bg-white/[0.04]"
                                        )}
                                    >
                                        {d === "Tất cả" ? d : diffLabel(d)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{filteredQuestions.length}</div>
                                <div className="text-sm text-white/40 mb-4">câu hỏi phù hợp</div>
                                <button
                                    onClick={startPractice}
                                    disabled={filteredQuestions.length === 0}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                >
                                    <Play className="w-4 h-4" />
                                    Bắt đầu luyện tập
                                </button>
                            </div>
                        </motion.div>

                        {/* AI Mock Test */}
                        <motion.div className="glass-card p-6 border border-violet-500/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Tạo đề thi thử AI</h3>
                                    <p className="text-xs text-white/40">Đề được tạo dựa trên điểm yếu của bạn</p>
                                </div>
                            </div>
                            <button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                                <Sparkles className="w-4 h-4" />
                                Tạo đề thử thông minh
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== PRACTICE VIEW ====================
    if (view === "practice" && currentQ) {
        const selectedOpt = answers[currentQ.id];
        const isCorrect = selectedOpt === currentQ.correctAnswer;

        return (
            <div className="max-w-3xl mx-auto space-y-6 p-6 lg:p-8">
                {/* Progress bar */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setView("setup")} className="text-white/40 hover:text-white/70 text-sm flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Thoát
                    </button>
                    <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div
                            className="h-full rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm text-white/50 font-mono">
                        {currentIndex + 1}/{filteredQuestions.length}
                    </span>
                </div>

                {/* Question */}
                <motion.div
                    key={currentQ.id}
                    className="glass-panel p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full border",
                            currentQ.difficulty === "EASY" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                                currentQ.difficulty === "MEDIUM" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                                    "bg-red-400/10 text-red-400 border-red-400/20"
                        )}>
                            {diffLabel(currentQ.difficulty)}
                        </span>
                        <span className="text-xs text-white/30">{currentQ.topic}</span>
                    </div>

                    <p className="text-white/90 leading-relaxed mb-6">{currentQ.questionText}</p>

                    <div className="space-y-3">
                        {currentQ.options?.map((opt) => {
                            const isSelected = selectedOpt === opt.key;
                            const isAnswer = opt.key === currentQ.correctAnswer;
                            let optClass = "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]";
                            if (isSubmitted) {
                                if (isAnswer) optClass = "bg-emerald-400/10 border-emerald-400/30 text-emerald-300";
                                else if (isSelected && !isAnswer) optClass = "bg-red-400/10 border-red-400/30 text-red-300";
                            } else if (isSelected) {
                                optClass = "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
                            }

                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => selectAnswer(opt.key)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3",
                                        optClass
                                    )}
                                >
                                    <span className={cn(
                                        "w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0",
                                        isSelected && !isSubmitted ? "border-indigo-400 text-indigo-300" : "border-white/10 text-white/30"
                                    )}>
                                        {opt.key}
                                    </span>
                                    <span className="text-sm">{opt.text}</span>
                                    {isSubmitted && isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                                    {isSubmitted && isSelected && !isAnswer && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Explanation */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            className={cn(
                                "glass-panel p-5 border-l-4",
                                isCorrect ? "border-l-emerald-400" : "border-l-red-400"
                            )}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect ? (
                                    <><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-sm font-medium text-emerald-400">Chính xác!</span></>
                                ) : (
                                    <><XCircle className="w-5 h-5 text-red-400" /><span className="text-sm font-medium text-red-400">Chưa đúng</span></>
                                )}
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">{currentQ.explanation}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex justify-between">
                    <div />
                    {!isSubmitted ? (
                        <button
                            onClick={submitAnswer}
                            disabled={!selectedOpt}
                            className="btn-primary flex items-center gap-2"
                        >
                            Kiểm tra đáp án
                        </button>
                    ) : (
                        <button onClick={nextQuestion} className="btn-primary flex items-center gap-2">
                            {currentIndex < filteredQuestions.length - 1 ? (
                                <>Câu tiếp theo <ChevronRight className="w-4 h-4" /></>
                            ) : (
                                <>Xem kết quả <Trophy className="w-4 h-4" /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ==================== REVIEW VIEW ====================
    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6 lg:p-8">
            <motion.div className="glass-panel p-8 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Hoàn thành!</h2>
                <p className="text-white/50 mb-6">Kết quả phiên luyện tập của bạn</p>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                    <div className="glass-card p-4">
                        <div className="text-2xl font-bold text-emerald-400">{totalCorrect}</div>
                        <div className="text-xs text-white/40">Đúng</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-2xl font-bold text-red-400">{filteredQuestions.length - totalCorrect}</div>
                        <div className="text-xs text-white/40">Sai</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-2xl font-bold text-indigo-400">
                            {filteredQuestions.length > 0 ? Math.round((totalCorrect / filteredQuestions.length) * 100) : 0}%
                        </div>
                        <div className="text-xs text-white/40">Tỉ lệ đúng</div>
                    </div>
                </div>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => { setView("setup"); }} className="btn-secondary flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Luyện lại
                    </button>
                    <button onClick={startPractice} className="btn-primary flex items-center gap-2">
                        <Play className="w-4 h-4" /> Phiên mới
                    </button>
                </div>
            </motion.div>

            {/* Detailed review */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/70">Chi tiết từng câu</h3>
                {filteredQuestions.map((q, i) => {
                    const ans = answers[q.id];
                    const correct = ans === q.correctAnswer;
                    return (
                        <div key={q.id} className={cn(
                            "glass-card p-4 border-l-4",
                            correct ? "border-l-emerald-400" : "border-l-red-400"
                        )}>
                            <div className="flex items-start gap-3">
                                <span className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                                    correct ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                                )}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white/70 line-clamp-2">{q.questionText}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                                        <span>Chọn: <strong className={correct ? "text-emerald-400" : "text-red-400"}>{ans || "—"}</strong></span>
                                        <span>Đáp án: <strong className="text-indigo-400">{q.correctAnswer}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
