"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    BookOpen,
    Lightbulb,
    Zap,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MathRenderer } from "@/components/MathRenderer";

// ═══════════════════════════════════════════════════════════════
// CÔNG THỨC VẬT LÝ 12 — Nguồn: HOCMAI
// ═══════════════════════════════════════════════════════════════

interface FormulaItem { name: string; formula: string }
interface Section { title: string; formulas: FormulaItem[] }
interface Chapter { chapter: number; title: string; sections: Section[] }

const chapters: Chapter[] = [
    // ──────────── CHƯƠNG 1 ────────────
    {
        chapter: 1,
        title: "Dao động cơ",
        sections: [
            {
                title: "I. Dao động điều hòa",
                formulas: [
                    { name: "Phương trình dao động", formula: "$x = A\\cos(\\omega t + \\varphi)$" },
                    { name: "Phương trình vận tốc", formula: "$v = -\\omega A\\sin(\\omega t + \\varphi)$" },
                    { name: "Phương trình gia tốc", formula: "$a = -\\omega^2 A\\cos(\\omega t + \\varphi) = -\\omega^2 x$" },
                    { name: "Giá trị cực đại", formula: "$x_{max} = A;\\; v_{max} = \\omega A;\\; a_{max} = \\omega^2 A$" },
                    { name: "Hệ thức độc lập", formula: "$A^2 = x^2 + \\dfrac{v^2}{\\omega^2}$" },
                    { name: "Vận tốc theo li độ", formula: "$v = \\pm\\omega\\sqrt{A^2 - x^2}$" },
                    { name: "Tốc độ TB trong 1T", formula: "$\\bar{v} = \\dfrac{4A}{T}$" },
                    { name: "Liên hệ pha", formula: "$v$ sớm pha $\\dfrac{\\pi}{2}$ hơn $x$; $a$ ngược pha $x$" },
                ],
            },
            {
                title: "II. Con lắc lò xo",
                formulas: [
                    { name: "Tần số góc", formula: "$\\omega = \\sqrt{\\dfrac{k}{m}}$" },
                    { name: "Chu kỳ", formula: "$T = 2\\pi\\sqrt{\\dfrac{m}{k}}$" },
                    { name: "Tần số", formula: "$f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}$" },
                    { name: "Ghép khối lượng (+)", formula: "$m = m_1 + m_2 \\Rightarrow T^2 = T_1^2 + T_2^2$" },
                    { name: "Ghép khối lượng (−)", formula: "$m = m_1 - m_2 \\Rightarrow T^2 = T_1^2 - T_2^2$" },
                    { name: "Đo chu kỳ", formula: "$T = \\dfrac{t}{N},\\quad f = \\dfrac{N}{t}$" },
                    { name: "Cắt lò xo", formula: "$kl = k_1 l_1 = k_2 l_2$" },
                    { name: "Ghép nối tiếp", formula: "$\\dfrac{1}{k} = \\dfrac{1}{k_1} + \\dfrac{1}{k_2}$" },
                    { name: "Ghép song song", formula: "$k = k_1 + k_2$" },
                    { name: "Lực đàn hồi", formula: "$F_{đh} = k(\\Delta l + x)$" },
                    { name: "Lực đàn hồi cực đại", formula: "$F_{max} = k(\\Delta l + A)$" },
                    { name: "Lực hồi phục", formula: "$F_{hp} = |kx|;\\quad F_{hp\\,max} = kA$" },
                ],
            },
            {
                title: "III. Con lắc đơn",
                formulas: [
                    { name: "Tần số góc", formula: "$\\omega = \\sqrt{\\dfrac{g}{l}}$" },
                    { name: "Chu kỳ", formula: "$T = 2\\pi\\sqrt{\\dfrac{l}{g}}$" },
                    { name: "Tần số", formula: "$f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{g}{l}}$" },
                    { name: "PT cung lệch", formula: "$s = s_0\\cos(\\omega t + \\varphi)$" },
                    { name: "PT góc lệch", formula: "$\\alpha = \\alpha_0\\cos(\\omega t + \\varphi);\\; s = l\\alpha$" },
                    { name: "Hệ thức độc lập", formula: "$S_0^2 = s^2 + \\dfrac{v^2}{\\omega^2}$" },
                    { name: "Vận tốc tại góc α", formula: "$v = \\sqrt{2gl(\\cos\\alpha - \\cos\\alpha_0)}$" },
                    { name: "Vận tốc tại VTCB", formula: "$v_{max} = \\sqrt{2gl(1 - \\cos\\alpha_0)}$" },
                    { name: "Lực căng dây", formula: "$T = mg(3\\cos\\alpha - 2\\cos\\alpha_0)$" },
                    { name: "T tại VTCB", formula: "$T_{max} = mg(3 - 2\\cos\\alpha_0)$" },
                    { name: "T tại biên", formula: "$T_{min} = mg\\cos\\alpha_0$" },
                    { name: "Năng lượng dao động", formula: "$W = mgl(1 - \\cos\\alpha_0) \\approx \\dfrac{1}{2}mgl\\alpha_0^2$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 2 ────────────
    {
        chapter: 2,
        title: "Sóng cơ",
        sections: [
            {
                title: "I. Sóng cơ học",
                formulas: [
                    { name: "Vận tốc sóng", formula: "$v = \\lambda f = \\dfrac{\\lambda}{T}$" },
                    { name: "Phương trình sóng", formula: "$u = A\\cos\\!\\left(\\omega t - \\dfrac{2\\pi d}{\\lambda}\\right)$" },
                ],
            },
            {
                title: "II. Giao thoa sóng",
                formulas: [
                    { name: "Sóng tại M từ A", formula: "$u_1 = A\\cos\\!\\left(\\omega t - \\dfrac{2\\pi d_1}{\\lambda}\\right)$" },
                    { name: "Sóng tại M từ B", formula: "$u_2 = A\\cos\\!\\left(\\omega t - \\dfrac{2\\pi d_2}{\\lambda}\\right)$" },
                    { name: "Biên độ tổng hợp", formula: "$A_M = 2A\\left|\\cos\\dfrac{(d_2 - d_1)\\pi}{\\lambda}\\right|$" },
                    { name: "Cực đại giao thoa", formula: "$d_2 - d_1 = k\\lambda$" },
                    { name: "Cực tiểu giao thoa", formula: "$d_2 - d_1 = \\left(k + \\dfrac{1}{2}\\right)\\lambda$" },
                ],
            },
            {
                title: "III. Sóng dừng",
                formulas: [
                    { name: "Hai đầu cố định", formula: "$l = k\\dfrac{\\lambda}{2}$" },
                    { name: "Một cố định, một tự do", formula: "$l = \\left(k + \\dfrac{1}{2}\\right)\\dfrac{\\lambda}{2}$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 3 ────────────
    {
        chapter: 3,
        title: "Dòng điện xoay chiều",
        sections: [
            {
                title: "I. Đại cương",
                formulas: [
                    { name: "Cường độ dòng điện", formula: "$i = I_0\\cos(\\omega t + \\varphi_i)$" },
                    { name: "Điện áp", formula: "$u = U_0\\cos(\\omega t + \\varphi_u)$" },
                    { name: "Độ lệch pha u vs i", formula: "$\\varphi = \\varphi_u - \\varphi_i$" },
                    { name: "Giá trị hiệu dụng", formula: "$I = \\dfrac{I_0}{\\sqrt{2}};\\quad U = \\dfrac{U_0}{\\sqrt{2}}$" },
                ],
            },
            {
                title: "II. Các phần tử R, L, C",
                formulas: [
                    { name: "Mạch chỉ có R", formula: "$\\varphi = 0;\\; U_R = IR$" },
                    { name: "Cảm kháng", formula: "$Z_L = \\omega L;\\; \\varphi = +\\dfrac{\\pi}{2};\\; U_L = IZ_L$" },
                    { name: "Dung kháng", formula: "$Z_C = \\dfrac{1}{\\omega C};\\; \\varphi = -\\dfrac{\\pi}{2};\\; U_C = IZ_C$" },
                ],
            },
            {
                title: "III. Mạch RLC nối tiếp",
                formulas: [
                    { name: "Tổng trở", formula: "$Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$" },
                    { name: "Độ lệch pha", formula: "$\\tan\\varphi = \\dfrac{Z_L - Z_C}{R}$" },
                    { name: "Định luật Ohm", formula: "$U_0 = I_0 Z;\\quad U = IZ$" },
                    { name: "Điện áp hiệu dụng", formula: "$U = \\sqrt{U_R^2 + (U_L - U_C)^2}$" },
                    { name: "Hệ số công suất", formula: "$\\cos\\varphi = \\dfrac{R}{Z} = \\dfrac{U_R}{U}$" },
                    { name: "Công suất", formula: "$P = UI\\cos\\varphi = RI^2 = U_R I$" },
                ],
            },
            {
                title: "IV. Cộng hưởng điện",
                formulas: [
                    { name: "Điều kiện cộng hưởng", formula: "$Z_L = Z_C \\Rightarrow Z_{min} = R$" },
                    { name: "Dòng điện cực đại", formula: "$I_{max} = \\dfrac{U}{R}$" },
                    { name: "Công suất cực đại", formula: "$P_{max} = RI_{max}^2 = \\dfrac{U^2}{R}$" },
                ],
            },
            {
                title: "V. Cuộn dây có điện trở r",
                formulas: [
                    { name: "Tổng trở cuộn dây", formula: "$Z_d = \\sqrt{r^2 + Z_L^2}$" },
                    { name: "Pha cuộn dây", formula: "$\\tan\\varphi_d = \\dfrac{Z_L}{r}$" },
                    { name: "Công suất cuộn dây", formula: "$P_d = rI^2$" },
                    { name: "Tổng trở mạch", formula: "$Z = \\sqrt{(R+r)^2 + (Z_L - Z_C)^2}$" },
                    { name: "Hệ số công suất mạch", formula: "$\\cos\\varphi = \\dfrac{R + r}{Z}$" },
                ],
            },
            {
                title: "VI. Bài toán cực trị",
                formulas: [
                    { name: "Thay đổi R → P_max", formula: "$R = |Z_L - Z_C| \\Rightarrow P_{max} = \\dfrac{U^2}{2R}$" },
                    { name: "Thay đổi L → U_Lmax", formula: "$Z_L = \\dfrac{R^2 + Z_C^2}{Z_C} \\Rightarrow U_{L\\,max} = \\dfrac{U\\sqrt{R^2 + Z_C^2}}{R}$" },
                    { name: "Thay đổi C → U_Cmax", formula: "$Z_C = \\dfrac{R^2 + Z_L^2}{Z_L} \\Rightarrow U_{C\\,max} = \\dfrac{U\\sqrt{R^2 + Z_L^2}}{R}$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 4 ────────────
    {
        chapter: 4,
        title: "Dao động và sóng điện từ",
        sections: [
            {
                title: "I. Mạch dao động LC",
                formulas: [
                    { name: "Tần số góc", formula: "$\\omega = \\dfrac{1}{\\sqrt{LC}}$" },
                    { name: "Chu kỳ riêng", formula: "$T = 2\\pi\\sqrt{LC}$" },
                    { name: "Tần số riêng", formula: "$f = \\dfrac{1}{2\\pi\\sqrt{LC}}$" },
                    { name: "Bước sóng điện từ", formula: "$\\lambda = cT = \\dfrac{c}{f} = c \\cdot 2\\pi\\sqrt{LC}$" },
                ],
            },
            {
                title: "II. Năng lượng mạch LC",
                formulas: [
                    { name: "NL điện trường", formula: "$W_C = \\dfrac{1}{2}Cu^2 = \\dfrac{q^2}{2C}$" },
                    { name: "NL điện trường cực đại", formula: "$W_{C\\,max} = \\dfrac{1}{2}CU_0^2 = \\dfrac{Q_0^2}{2C}$" },
                    { name: "NL từ trường", formula: "$W_L = \\dfrac{1}{2}Li^2$" },
                    { name: "NL từ trường cực đại", formula: "$W_{L\\,max} = \\dfrac{1}{2}LI_0^2$" },
                    { name: "NL toàn phần", formula: "$W = \\dfrac{1}{2}CU_0^2 = \\dfrac{1}{2}LI_0^2 = \\dfrac{Q_0^2}{2C}$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 5 ────────────
    {
        chapter: 5,
        title: "Giao thoa ánh sáng",
        sections: [
            {
                title: "I. TN Young ánh sáng đơn sắc",
                formulas: [
                    { name: "Khoảng vân", formula: "$i = \\dfrac{\\lambda D}{a}$" },
                    { name: "Vị trí vân sáng bậc k", formula: "$x_k = k\\dfrac{\\lambda D}{a} = ki$" },
                    { name: "Vị trí vân tối bậc k", formula: "$x_k = \\left(k + \\dfrac{1}{2}\\right)i$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 6 ────────────
    {
        chapter: 6,
        title: "Lượng tử ánh sáng",
        sections: [
            {
                title: "I. Hiệu ứng quang điện",
                formulas: [
                    { name: "Năng lượng photon", formula: "$\\varepsilon = hf = \\dfrac{hc}{\\lambda}$" },
                    { name: "Công thoát", formula: "$A = \\dfrac{hc}{\\lambda_0}$" },
                    { name: "PT Anh-xtanh", formula: "$\\varepsilon = A + W_{đ\\,max}$" },
                    { name: "Động năng ban đầu max", formula: "$W_{đ\\,max} = e|U_h| = \\dfrac{1}{2}mv_0^2$" },
                    { name: "Cường độ dòng bão hòa", formula: "$I_{bh} = \\dfrac{n_e \\cdot e}{t}$" },
                    { name: "Công suất nguồn bức xạ", formula: "$P = \\dfrac{n_p \\cdot \\varepsilon}{t}$" },
                    { name: "Hiệu suất lượng tử", formula: "$H = \\dfrac{n_e}{n_p}$" },
                ],
            },
            {
                title: "II. Quang phổ nguyên tử Hydro",
                formulas: [
                    { name: "NL bức xạ hay hấp thụ", formula: "$\\dfrac{hc}{\\lambda} = E_{cao} - E_{thấp}$" },
                    { name: "Mức năng lượng", formula: "$E_n = -\\dfrac{13{,}6}{n^2}\\;(eV)$" },
                    { name: "Bước sóng các vạch", formula: "$\\lambda_{31} = \\dfrac{\\lambda_{32} \\cdot \\lambda_{21}}{\\lambda_{32} + \\lambda_{21}}$" },
                ],
            },
        ],
    },
    // ──────────── CHƯƠNG 7 ────────────
    {
        chapter: 7,
        title: "Vật lý hạt nhân",
        sections: [
            {
                title: "I. Cấu tạo hạt nhân",
                formulas: [
                    { name: "Ký hiệu hạt nhân", formula: "${}^A_Z X$: $A$ nuclon, $Z$ proton, $N = A - Z$ nơtron" },
                    { name: "Hệ thức Einstein", formula: "$E = mc^2$" },
                    { name: "Độ hụt khối", formula: "$\\Delta m = Zm_p + (A - Z)m_n - m_{hn}$" },
                    { name: "Năng lượng liên kết", formula: "$W_{lk} = \\Delta m \\cdot c^2$" },
                    { name: "NL liên kết riêng", formula: "$W_{lkr} = \\dfrac{W_{lk}}{A}$" },
                ],
            },
            {
                title: "II. Phóng xạ",
                formulas: [
                    { name: "Hằng số phóng xạ", formula: "$\\lambda = \\dfrac{\\ln 2}{T}$" },
                    { name: "Khối lượng còn lại", formula: "$m = m_0 \\cdot 2^{-t/T} = m_0 e^{-\\lambda t}$" },
                    { name: "Số nguyên tử còn lại", formula: "$N = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}$" },
                    { name: "Độ phóng xạ", formula: "$H = \\lambda N_0 \\cdot 2^{-t/T} = H_0 \\cdot 2^{-t/T}$" },
                    { name: "Số nguyên tử", formula: "$N_0 = \\dfrac{m_0}{A}N_A;\\quad N = \\dfrac{m}{A}N_A$" },
                    { name: "Khối lượng bị phân rã", formula: "$\\Delta m = m_0\\!\\left(1 - 2^{-t/T}\\right)$" },
                    { name: "Số hạt nhân bị phân rã", formula: "$\\Delta N = N_0\\!\\left(1 - 2^{-t/T}\\right)$" },
                ],
            },
            {
                title: "III. Phản ứng hạt nhân",
                formulas: [
                    { name: "Bảo toàn số khối", formula: "$A_1 + A_2 = A_3 + A_4$" },
                    { name: "Bảo toàn điện tích", formula: "$Z_1 + Z_2 = Z_3 + Z_4$" },
                    { name: "Năng lượng phản ứng", formula: "$W = (m_1 + m_2 - m_3 - m_4)c^2$" },
                    { name: "Tính theo đơn vị u", formula: "$W = (m_1 + m_2 - m_3 - m_4) \\times 931{,}5\\;MeV$" },
                    { name: "Hằng số", formula: "$1u = 931{,}5\\;\\dfrac{MeV}{c^2};\\; m_p = 1{,}0073u;\\; m_n = 1{,}0087u$" },
                ],
            },
        ],
    },
];

// ═══════════════════════════════════════════════════════════════

export function SmartAssistant() {
    const [activeTab, setActiveTab] = useState<"formulas" | "insights">("formulas");
    const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
    const [expandedSection, setExpandedSection] = useState<string | null>("I. Dao động điều hòa");

    return (
        <div className="glass-panel flex flex-col h-full overflow-hidden relative shadow-2xl border border-white/10">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Smart Assistant</h3>
                        <p className="text-xs text-white/50">Tra cứu công thức nhanh</p>
                    </div>
                </div>
            </div>

            <div className="flex p-2 gap-2 border-b border-white/5 bg-white/[0.01]">
                <button
                    onClick={() => setActiveTab("formulas")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                        activeTab === "formulas" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    )}
                >
                    <BookOpen className="w-3.5 h-3.5" /> Công thức
                </button>
                <button
                    onClick={() => setActiveTab("insights")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                        activeTab === "insights" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    )}
                >
                    <Lightbulb className="w-3.5 h-3.5" /> Insights
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === "formulas" && (
                        <motion.div
                            key="formulas"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-1.5"
                        >
                            {chapters.map((ch) => (
                                <div key={ch.chapter} className="rounded-xl border border-white/5 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setExpandedChapter(expandedChapter === ch.chapter ? null : ch.chapter);
                                            setExpandedSection(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
                                    >
                                        <ChevronRight className={cn(
                                            "w-3 h-3 transition-transform text-white/30 shrink-0",
                                            expandedChapter === ch.chapter && "rotate-90"
                                        )} />
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/10 text-indigo-400 font-mono shrink-0">
                                            Ch.{ch.chapter}
                                        </span>
                                        <span className="text-xs font-medium text-white/80 flex-1">{ch.title}</span>
                                    </button>
                                    {expandedChapter === ch.chapter && (
                                        <div className="px-2 pb-2 space-y-1">
                                            {ch.sections.map((sec) => (
                                                <div key={sec.title} className="rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => setExpandedSection(expandedSection === sec.title ? null : sec.title)}
                                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-white/[0.02] transition-colors rounded-lg"
                                                    >
                                                        <Zap className={cn(
                                                            "w-2.5 h-2.5 transition-transform text-indigo-400/50 shrink-0",
                                                            expandedSection === sec.title && "rotate-90"
                                                        )} />
                                                        <span className="text-[11px] font-medium text-white/60">{sec.title}</span>
                                                        <span className="text-[9px] text-white/20 ml-auto">{sec.formulas.length}</span>
                                                    </button>
                                                    {expandedSection === sec.title && (
                                                        <div className="px-1 pb-1 space-y-1">
                                                            {sec.formulas.map((f, idx) => (
                                                                <div key={idx} className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                                                    <span className="text-[10px] text-white/40 block mb-0.5">{f.name}</span>
                                                                    <MathRenderer content={f.formula} className="text-sm text-cyan-200" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "insights" && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center py-10 text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-2">Chưa có dữ liệu phân tích</h4>
                            <p className="text-xs text-white/40 max-w-[200px] leading-relaxed">
                                Hãy bắt đầu chat với AI và luyện đề để hệ thống phân tích điểm mạnh/yếu của bạn.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
