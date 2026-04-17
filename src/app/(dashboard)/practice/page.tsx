"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Clock,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Play,
    Trophy,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    FileText,
    Check,
    X as XIcon,
    Minus,
    Shuffle,
    Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MathRenderer } from "@/components/MathRenderer";
import {
    generateExam,
    chapterNames,
    type MCQQuestion,
    type TFQuestion,
    type ShortAnswer,
    type Question,
} from "@/lib/data/questionBank";

// ─── Scoring ───
function scoreTF(statements: { correct: boolean }[], answers: Record<string, boolean>): { correct: number; score: number } {
    let correct = 0;
    statements.forEach((s, i) => {
        const key = String.fromCharCode(97 + i);
        if (answers[key] === s.correct) correct++;
    });
    const scoreMap: Record<number, number> = { 0: 0, 1: 0.1, 2: 0.25, 3: 0.5, 4: 1 };
    return { correct, score: scoreMap[correct] || 0 };
}

const EXAM_TIME_MINUTES = 50;

// ═══ Component ═══
type ExamView = "intro" | "exam" | "result";

export default function PracticePage() {
    const [view, setView] = useState<ExamView>("intro");
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
    const [currentQ, setCurrentQ] = useState(0);

    // MCQ answers: { questionId: "A"|"B"|... }
    const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
    // TF answers: { questionId: { a: true, b: false, ... } }
    const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
    // Short answers: { questionId: "3.18" }
    const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(EXAM_TIME_MINUTES * 60);
    const [showExplanation, setShowExplanation] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const dotsRef = useRef<HTMLDivElement>(null);

    const mcqs = examQuestions.filter((q): q is MCQQuestion => q.type === "mcq");
    const tfs = examQuestions.filter((q): q is TFQuestion => q.type === "tf");
    const shorts = examQuestions.filter((q): q is ShortAnswer => q.type === "short");

    // Timer
    useEffect(() => {
        if (view === "exam" && !isSubmitted) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [view, isSubmitted]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const startExam = (chapter?: number) => {
        setExamQuestions(generateExam(chapter));
        setView("exam");
        setCurrentPart(1);
        setCurrentQ(0);
        setMcqAnswers({});
        setTfAnswers({});
        setShortAnswers({});
        setIsSubmitted(false);
        setTimeLeft(EXAM_TIME_MINUTES * 60);
        setShowExplanation(null);
        setFlagged(new Set());
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (timerRef.current) clearInterval(timerRef.current);
        setView("result");
    };

    // Get current question list based on part
    const getPartQuestions = () => {
        switch (currentPart) {
            case 1: return mcqs;
            case 2: return tfs;
            case 3: return shorts;
        }
    };

    const partQuestions = getPartQuestions();
    const currentQuestion = partQuestions[currentQ];

    // Navigation
    const goNext = () => {
        if (currentQ < partQuestions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else if (currentPart < 3) {
            setCurrentPart((currentPart + 1) as 2 | 3);
            setCurrentQ(0);
        }
    };
    const goPrev = () => {
        if (currentQ > 0) {
            setCurrentQ(currentQ - 1);
        } else if (currentPart > 1) {
            const prevPart = (currentPart - 1) as 1 | 2;
            setCurrentPart(prevPart);
            const prevQuestions = prevPart === 1 ? mcqs : tfs;
            setCurrentQ(prevQuestions.length - 1);
        }
    };

    // Auto-scroll question dots to current
    useEffect(() => {
        if (dotsRef.current) {
            const activeBtn = dotsRef.current.children[currentQ] as HTMLElement;
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [currentQ, currentPart]);

    // Count answered
    const totalAnswered = () => {
        const mcqCount = mcqs.filter((q) => mcqAnswers[q.id]).length;
        const tfCount = tfs.filter((q) => {
            const a = tfAnswers[q.id];
            return a && Object.keys(a).length === 4;
        }).length;
        const shortCount = shorts.filter((q) => shortAnswers[q.id]?.trim()).length;
        return mcqCount + tfCount + shortCount;
    };

    // Score calculation
    const calcScore = () => {
        // MCQ: each = 0.25 points (18 × 0.25 = 4.5)
        let mcqScore = 0;
        mcqs.forEach((q) => { if (mcqAnswers[q.id] === q.correctAnswer) mcqScore += 0.25; });

        // TF: special scoring
        let tfScore = 0;
        tfs.forEach((q) => {
            const a = tfAnswers[q.id] || {};
            const result = scoreTF(q.statements, a);
            tfScore += result.score;
        });

        // Short: each = 0.5 points
        let shortScore = 0;
        shorts.forEach((q) => {
            const userAns = parseFloat(shortAnswers[q.id] || "");
            if (!isNaN(userAns) && Math.abs(userAns - q.correctAnswer) <= q.tolerance) shortScore += 0.5;
        });

        return { mcqScore, tfScore, shortScore, total: mcqScore + tfScore + shortScore };
    };

    // ─── INTRO ───
    if (view === "intro") {
        return (
            <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                        <Target className="w-6 h-6 text-indigo-400" /> Tự kiểm tra
                    </h1>
                    <p className="text-white/50 text-sm">Luyện đề theo cấu trúc THPT Quốc gia 2025</p>
                </motion.div>

                <motion.div className="glass-panel p-6 space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Đề luyện tập — Vật lý 12 (THPT QG 2025)</h2>
                            <p className="text-xs text-white/40">Cấu trúc chuẩn THPT QG 2025</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="glass-card p-4 rounded-xl">
                            <p className="text-2xl font-bold text-indigo-400">28</p>
                            <p className="text-xs text-white/40 mt-1">câu hỏi</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl">
                            <p className="text-2xl font-bold text-amber-400">40</p>
                            <p className="text-xs text-white/40 mt-1">lệnh hỏi</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl">
                            <p className="text-2xl font-bold text-emerald-400">50</p>
                            <p className="text-xs text-white/40 mt-1">phút</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { part: "Phần I", desc: "Trắc nghiệm nhiều lựa chọn", count: "18 câu", color: "text-indigo-400", bg: "bg-indigo-400/10" },
                            { part: "Phần II", desc: "Đúng / Sai (mỗi câu 4 ý)", count: "4 câu", color: "text-amber-400", bg: "bg-amber-400/10" },
                            { part: "Phần III", desc: "Trả lời ngắn (điền kết quả)", count: "6 câu", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        ].map((p) => (
                            <div key={p.part} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", p.bg, p.color)}>{p.part}</span>
                                <span className="text-sm text-white/70 flex-1">{p.desc}</span>
                                <span className="text-xs text-white/30">{p.count}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/80">
                        <p className="font-medium mb-1">📋 Quy tắc chấm Đúng/Sai:</p>
                        <p className="text-xs text-white/40">1 ý đúng = 0,1đ • 2 ý = 0,25đ • 3 ý = 0,5đ • 4 ý = 1đ</p>
                    </div>

                    <button onClick={() => startExam()} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
                        <Shuffle className="w-5 h-5" /> Ôn tổng hợp (random tất cả chương)
                    </button>
                </motion.div>

                {/* Chapter selection */}
                <motion.div className="glass-panel p-6 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-sm font-semibold text-white/60">Luyện theo chương</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(chapterNames).map(([ch, name]) => (
                            <button
                                key={ch}
                                onClick={() => startExam(Number(ch))}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/15 transition-all text-left group"
                            >
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">C{ch}</span>
                                <span className="text-sm text-white/70 flex-1 group-hover:text-white/90 transition-colors">{name}</span>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── RESULT ───
    if (view === "result") {
        const { mcqScore, tfScore, shortScore, total } = calcScore();
        const maxScore = mcqs.length * 0.25 + tfs.length * 1 + shorts.length * 0.5; // 3 + 4 + 3 = 10

        return (
            <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-6">
                <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Kết quả bài thi</h2>
                    <p className="text-white/40 text-sm">Thời gian còn lại: {formatTime(timeLeft)}</p>
                </motion.div>

                <div className="glass-panel p-6 text-center">
                    <p className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {total.toFixed(2)}
                    </p>
                    <p className="text-white/40 text-sm mt-1">/ {maxScore.toFixed(1)} điểm</p>
                    <div className="w-full bg-white/5 rounded-full h-2 mt-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all" style={{ width: `${(total / maxScore) * 100}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="glass-panel p-4 text-center">
                        <p className="text-lg font-bold text-indigo-400">{mcqScore.toFixed(2)}</p>
                        <p className="text-[10px] text-white/30">Phần I (TN)</p>
                    </div>
                    <div className="glass-panel p-4 text-center">
                        <p className="text-lg font-bold text-amber-400">{tfScore.toFixed(2)}</p>
                        <p className="text-[10px] text-white/30">Phần II (Đ/S)</p>
                    </div>
                    <div className="glass-panel p-4 text-center">
                        <p className="text-lg font-bold text-emerald-400">{shortScore.toFixed(1)}</p>
                        <p className="text-[10px] text-white/30">Phần III (TL)</p>
                    </div>
                </div>

                {/* Review answers */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Chi tiết đáp án</h3>

                    {/* MCQ review */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-indigo-400">Phần I — Trắc nghiệm</p>
                        {mcqs.map((q, i) => {
                            const userAns = mcqAnswers[q.id];
                            const isCorrect = userAns === q.correctAnswer;
                            return (
                                <div key={q.id} className={cn("p-3 rounded-xl border text-sm", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
                                    <div className="flex items-start gap-2">
                                        {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
                                        <div className="flex-1">
                                            <p className="text-white/60 text-xs">Câu {i + 1}: <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>{userAns || "—"}</span> {!isCorrect && <span className="text-white/30">(Đáp án: {q.correctAnswer})</span>}</p>
                                            <button onClick={() => setShowExplanation(showExplanation === q.id ? null : q.id)} className="text-[10px] text-indigo-400 mt-1">
                                                {showExplanation === q.id ? "Ẩn giải thích" : "Xem giải thích"}
                                            </button>
                                            {showExplanation === q.id && (
                                                <div className="mt-2 p-2 rounded-lg bg-white/[0.03] text-xs">
                                                    <MathRenderer content={q.explanation} className="text-white/50 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* TF review */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-amber-400">Phần II — Đúng/Sai</p>
                        {tfs.map((q, i) => {
                            const a = tfAnswers[q.id] || {};
                            const result = scoreTF(q.statements, a);
                            return (
                                <div key={q.id} className="p-3 rounded-xl border bg-white/[0.02] border-white/5 text-sm">
                                    <p className="text-white/60 text-xs mb-1">Câu {i + 1}: Đúng {result.correct}/4 ý — <span className="text-amber-400">{result.score}đ</span></p>
                                    <button onClick={() => setShowExplanation(showExplanation === q.id ? null : q.id)} className="text-[10px] text-indigo-400">
                                        {showExplanation === q.id ? "Ẩn giải thích" : "Xem giải thích"}
                                    </button>
                                    {showExplanation === q.id && (
                                        <div className="mt-2 p-2 rounded-lg bg-white/[0.03] text-xs">
                                            <MathRenderer content={q.explanation} className="text-white/50 text-xs" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Short review */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-emerald-400">Phần III — Trả lời ngắn</p>
                        {shorts.map((q, i) => {
                            const userVal = parseFloat(shortAnswers[q.id] || "");
                            const isCorrect = !isNaN(userVal) && Math.abs(userVal - q.correctAnswer) <= q.tolerance;
                            return (
                                <div key={q.id} className={cn("p-3 rounded-xl border text-sm", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
                                    <p className="text-white/60 text-xs">
                                        Câu {i + 1}: <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>{shortAnswers[q.id] || "—"}</span>
                                        {!isCorrect && <span className="text-white/30"> (Đáp án: {q.correctAnswer})</span>}
                                    </p>
                                    <button onClick={() => setShowExplanation(showExplanation === q.id ? null : q.id)} className="text-[10px] text-indigo-400 mt-1">
                                        {showExplanation === q.id ? "Ẩn giải thích" : "Xem giải thích"}
                                    </button>
                                    {showExplanation === q.id && (
                                        <div className="mt-2 p-2 rounded-lg bg-white/[0.03] text-xs">
                                            <MathRenderer content={q.explanation} className="text-white/50 text-xs" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button onClick={() => startExam()} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Làm lại
                </button>
            </div>
        );
    }

    // ─── EXAM ───
    return (
        <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-4 h-full flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-lg",
                        currentPart === 1 ? "bg-indigo-400/10 text-indigo-400" :
                            currentPart === 2 ? "bg-amber-400/10 text-amber-400" :
                                "bg-emerald-400/10 text-emerald-400"
                    )}>
                        Phần {currentPart === 1 ? "I" : currentPart === 2 ? "II" : "III"}
                    </span>
                    <span className="text-sm text-white/50">
                        Câu {currentQ + 1}/{partQuestions.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm font-mono">
                        <Clock className={cn("w-4 h-4", timeLeft < 300 ? "text-red-400" : "text-white/40")} />
                        <span className={cn(timeLeft < 300 ? "text-red-400" : "text-white/60")}>{formatTime(timeLeft)}</span>
                    </div>
                    <span className="text-xs text-white/30">{totalAnswered()}/28</span>
                </div>
            </div>

            {/* Part tabs */}
            <div className="flex gap-2 shrink-0">
                {([1, 2, 3] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => { setCurrentPart(p); setCurrentQ(0); }}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium rounded-xl transition-all border",
                            currentPart === p
                                ? p === 1 ? "bg-indigo-400/10 text-indigo-400 border-indigo-400/20"
                                    : p === 2 ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                        : "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                                : "bg-white/[0.02] text-white/30 border-white/5 hover:bg-white/[0.04]"
                        )}
                    >
                        {p === 1 ? "Trắc nghiệm" : p === 2 ? "Đúng/Sai" : "Trả lời ngắn"}
                    </button>
                ))}
            </div>

            {/* Question content */}
            <div className="flex-1 glass-panel p-5 lg:p-6 overflow-y-auto rounded-2xl custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                        {/* Question number badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-mono text-white/30">Câu {currentPart === 1 ? currentQ + 1 : currentPart === 2 ? currentQ + 19 : currentQ + 23}</span>
                            <button
                                onClick={() => {
                                    setFlagged((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
                                        else next.add(currentQuestion.id);
                                        return next;
                                    });
                                }}
                                className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border",
                                    flagged.has(currentQuestion.id)
                                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                        : "bg-white/[0.03] border-white/5 text-white/25 hover:text-white/50 hover:bg-white/[0.06]"
                                )}
                            >
                                <Flag className="w-3 h-3" />
                                {flagged.has(currentQuestion.id) ? "Đã đánh dấu" : "Đánh dấu"}
                            </button>
                        </div>

                        {/* Question text */}
                        <div className="mb-5">
                            <MathRenderer content={currentQuestion.text} className="text-sm md:text-base text-white/90 leading-relaxed" />
                        </div>

                        {/* ── MCQ options ── */}
                        {currentQuestion.type === "mcq" && (
                            <div className="space-y-2.5">
                                {(currentQuestion as MCQQuestion).options.map((opt) => {
                                    const selected = mcqAnswers[currentQuestion.id] === opt.key;
                                    return (
                                        <button
                                            key={opt.key}
                                            onClick={() => setMcqAnswers((prev) => ({ ...prev, [currentQuestion.id]: opt.key }))}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border",
                                                selected
                                                    ? "bg-indigo-500/15 border-indigo-500/30 text-white"
                                                    : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.05] hover:border-white/10"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border",
                                                selected ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-white/[0.03] border-white/10 text-white/40"
                                            )}>
                                                {opt.key}
                                            </span>
                                            <MathRenderer content={opt.text} className="text-sm" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── TF statements ── */}
                        {currentQuestion.type === "tf" && (
                            <div className="space-y-3">
                                {(currentQuestion as TFQuestion).statements.map((s) => {
                                    const current = tfAnswers[currentQuestion.id]?.[s.key];
                                    return (
                                        <div key={s.key} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-xs font-bold text-white/30 mt-1 w-4 shrink-0">{s.key})</span>
                                            <div className="flex-1">
                                                <MathRenderer content={s.text} className="text-sm text-white/70" />
                                            </div>
                                            <div className="flex gap-1.5 shrink-0">
                                                <button
                                                    onClick={() => setTfAnswers((prev) => ({
                                                        ...prev,
                                                        [currentQuestion.id]: { ...prev[currentQuestion.id], [s.key]: true }
                                                    }))}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                                        current === true ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/[0.06]"
                                                    )}
                                                >
                                                    Đúng
                                                </button>
                                                <button
                                                    onClick={() => setTfAnswers((prev) => ({
                                                        ...prev,
                                                        [currentQuestion.id]: { ...prev[currentQuestion.id], [s.key]: false }
                                                    }))}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                                        current === false ? "bg-red-500/15 border-red-500/30 text-red-400" : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/[0.06]"
                                                    )}
                                                >
                                                    Sai
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Short answer ── */}
                        {currentQuestion.type === "short" && (
                            <div className="mt-2">
                                <label className="block text-sm text-white/50 mb-2">Nhập kết quả (số):</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={shortAnswers[currentQuestion.id] || ""}
                                    onChange={(e) => setShortAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                    className="glass-input text-lg font-mono text-center max-w-[200px]"
                                    placeholder="..."
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between shrink-0">
                <button onClick={goPrev} disabled={currentPart === 1 && currentQ === 0} className="btn-secondary flex items-center gap-1.5 px-4 py-2.5 disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" /> Trước
                </button>

                {/* Question dots */}
                <div ref={dotsRef} className="flex gap-1 overflow-x-auto max-w-[55%] custom-scrollbar py-1 px-0.5">
                    {partQuestions.map((q, i) => {
                        const isAnswered =
                            q.type === "mcq" ? !!mcqAnswers[q.id] :
                                q.type === "tf" ? Object.keys(tfAnswers[q.id] || {}).length === 4 :
                                    !!shortAnswers[q.id]?.trim();
                        const isFlagged = flagged.has(q.id);
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQ(i)}
                                className={cn(
                                    "w-7 h-7 rounded-lg text-[10px] font-mono transition-all shrink-0 relative",
                                    i === currentQ ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 ring-1 ring-indigo-500/20" :
                                        isAnswered ? "bg-white/10 text-white/60 border border-white/10" : "bg-white/[0.03] text-white/20 border border-transparent"
                                )}
                            >
                                {i + 1}
                                {isFlagged && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {currentPart === 3 && currentQ === shorts.length - 1 ? (
                    <button onClick={handleSubmit} className="btn-primary flex items-center gap-1.5 px-4 py-2.5">
                        <CheckCircle2 className="w-4 h-4" /> Nộp bài
                    </button>
                ) : (
                    <button onClick={goNext} className="btn-secondary flex items-center gap-1.5 px-4 py-2.5">
                        Tiếp <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
