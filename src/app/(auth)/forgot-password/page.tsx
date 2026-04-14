"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setSent(true);
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative">
            <div className="gradient-orb w-[300px] h-[300px] bg-violet-500 top-[-50px] right-[-50px]" />

            <motion.div
                className="w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Atom className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold text-white">G-Physics</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Quên mật khẩu</h1>
                    <p className="text-white/50 text-sm">Nhập email để nhận link đặt lại mật khẩu</p>
                </div>

                <div className="glass-panel p-8">
                    {sent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Đã gửi email!</h3>
                            <p className="text-sm text-white/50 mb-6">
                                Kiểm tra hộp thư của bạn tại <strong className="text-white/70">{email}</strong>
                            </p>
                            <Link href="/login" className="btn-secondary inline-flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="glass-input pl-10"
                                        placeholder="student@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Gửi link đặt lại"
                                )}
                            </button>

                            <p className="text-center">
                                <Link href="/login" className="text-sm text-white/40 hover:text-white/60 inline-flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
