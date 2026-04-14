"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Lightbulb,
  BookOpen,
  Target,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Users,
  ChevronRight,
  Atom,
  Menu,
  X,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// ==================== NAVBAR ====================

const navLinks = [
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "So sánh", href: "#compare" },
  { label: "Tài nguyên", href: "#trust" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-full border transition-all duration-300 ${scrolled
            ? "bg-[#0c0d1f]/85 backdrop-blur-2xl border-white/10 shadow-xl shadow-black/30"
            : "bg-[#0c0d1f]/60 backdrop-blur-xl border-white/[0.06]"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Atom className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-white hidden sm:inline">G-Physics</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-white/50 hover:text-white/90 transition-colors rounded-full hover:bg-white/[0.05]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm font-medium bg-white text-[#0c0d1f] hover:bg-white/90 transition-colors"
            >
              Đăng nhập
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 pt-24 px-6 bg-[#0a0b1a]/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-base text-white/70 hover:text-white rounded-2xl hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-white/5 mt-2 pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-base text-white/70 rounded-2xl hover:bg-white/5 text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-base font-medium text-[#0c0d1f] bg-white rounded-2xl text-center hover:bg-white/90"
                >
                  Bắt đầu miễn phí
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==================== HERO ====================

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background orbs */}
      <div className="gradient-orb w-[500px] h-[500px] bg-indigo-500 top-[-100px] left-[-100px]" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
      <div className="gradient-orb w-[400px] h-[400px] bg-cyan-500 bottom-[-50px] right-[-50px]" style={{ animation: "pulse-glow 5s ease-in-out infinite 1s" }} />
      <div className="gradient-orb w-[300px] h-[300px] bg-violet-500 top-[40%] right-[20%]" style={{ animation: "pulse-glow 6s ease-in-out infinite 2s" }} />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Atom className="w-4 h-4" />
            Nền tảng học Vật lý thông minh
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          <span className="gradient-text">G-Physics</span>
          <br />
          <span className="text-white/90">Gia sư AI cho Vật lý 12</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Không chỉ là chatbot AI — đây là hệ thống học tập có cấu trúc giúp bạn
          hiểu sâu, luyện đề hiệu quả, và tự tin bước vào kỳ thi THPT Quốc gia.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
          >
            Bắt đầu học miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
          >
            Đăng nhập
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "4", label: "Chế độ hỗ trợ" },
            { value: "7+", label: "Chương Vật lý" },
            { value: "24/7", label: "Sẵn sàng hỗ trợ" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==================== FEATURES ====================

const features = [
  {
    icon: Lightbulb,
    title: "Gợi ý thông minh",
    description: "Đưa ra câu hỏi dẫn dắt giúp bạn tự tìm ra hướng giải, không đưa đáp án ngay.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: BookOpen,
    title: "Giải thích khái niệm",
    description: "Nhắc lại định luật, nguyên lý và công thức liên quan — giúp bạn hiểu BẢN CHẤT vật lý.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  {
    icon: Target,
    title: "Hướng dẫn từng bước",
    description: "Chia bài toán phức tạp thành các bước nhỏ, yêu cầu bạn tham gia giải từng phần.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: GraduationCap,
    title: "Giải đầy đủ",
    description: "Lời giải hoàn chỉnh theo format bài thi — trình bày rõ ràng từ tóm tắt đến kết luận.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            4 chế độ hỗ trợ <span className="gradient-text">thông minh</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Hệ thống gia sư AI tiến hóa — từ gợi ý nhẹ đến giải đầy đủ, đảm bảo bạn luôn tư duy trước khi xem đáp án.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass-card p-6 relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              <div className="absolute top-4 right-4 text-xs text-white/20 font-mono">
                Mode {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== HOW IT WORKS ====================

const steps = [
  {
    icon: FileText,
    title: "Nhập câu hỏi",
    description: "Gửi câu hỏi, ảnh chụp đề bài, hoặc tài liệu cần hỗ trợ",
  },
  {
    icon: Brain,
    title: "AI phân tích",
    description: "Hệ thống xác định chủ đề, độ khó, và chọn mức hỗ trợ phù hợp",
  },
  {
    icon: Sparkles,
    title: "Hướng dẫn có cấu trúc",
    description: "Nhận gợi ý, giải thích khái niệm, hoặc hướng dẫn từng bước",
  },
  {
    icon: BarChart3,
    title: "Theo dõi tiến bộ",
    description: "Hệ thống ghi nhận điểm yếu và đề xuất bài tập phù hợp",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div className="gradient-orb w-[400px] h-[400px] bg-indigo-600 left-[-200px] top-0" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cách <span className="gradient-text">G-Physics</span> hoạt động
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-indigo-400" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/40">{step.description}</p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute top-8 -right-4 w-5 h-5 text-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== DIFFERENTIATOR ====================

function DifferentiatorSection() {
  const comparisons = [
    {
      generic: "Đưa đáp án ngay lập tức",
      gphysics: "Hướng dẫn tư duy trước, đáp án sau",
    },
    {
      generic: "Không kiểm tra tính chính xác",
      gphysics: "Đối chiếu với kiến thức SGK đã xác minh",
    },
    {
      generic: "Trò chuyện tự do, không có cấu trúc",
      gphysics: "4 chế độ hỗ trợ có mục tiêu rõ ràng",
    },
    {
      generic: "Không theo dõi tiến bộ",
      gphysics: "Ghi nhận điểm yếu, đề xuất ôn tập cá nhân",
    },
    {
      generic: "Không có ngân hàng đề thi",
      gphysics: "Luyện đề theo chủ đề + tạo đề thi thử AI",
    },
  ];

  return (
    <section id="compare" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tại sao chọn <span className="gradient-text">G-Physics</span>?
          </h2>
          <p className="text-white/50">So sánh với các công cụ AI thông thường</p>
        </motion.div>

        <motion.div
          className="glass-panel p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center text-sm font-semibold text-white/40 uppercase tracking-wider">AI thông thường</div>
            <div className="text-center text-sm font-semibold text-indigo-400 uppercase tracking-wider">G-Physics</div>
          </div>
          {comparisons.map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 py-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
                {item.generic}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item.gphysics}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==================== CTA ====================

function CTASection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="gradient-orb w-[500px] h-[500px] bg-indigo-500 top-0 left-[50%] translate-x-[-50%]" />
      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Sẵn sàng học Vật lý <span className="gradient-text">thông minh hơn</span>?
        </h2>
        <p className="text-white/50 mb-10">
          Tham gia hàng nghìn học sinh đã chọn G-Physics để chuẩn bị cho kỳ thi THPT Quốc gia
        </p>
        <Link
          href="/signup"
          className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-5 rounded-2xl"
        >
          Tạo tài khoản miễn phí
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white">G-Physics</span>
            </div>
            <p className="text-sm text-white/40 max-w-sm">
              Nền tảng học Vật lý thông minh dành cho học sinh lớp 12 Việt Nam. Kết hợp AI có cấu trúc với sư phạm nghiêm túc.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="/tutor" className="hover:text-white/70 transition-colors">Gia sư AI</Link></li>
              <li><Link href="/practice" className="hover:text-white/70 transition-colors">Luyện đề</Link></li>
              <li><Link href="/library" className="hover:text-white/70 transition-colors">Thư viện</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="#" className="hover:text-white/70 transition-colors">Hướng dẫn</Link></li>
              <li><Link href="#" className="hover:text-white/70 transition-colors">Liên hệ</Link></li>
              <li><Link href="#" className="hover:text-white/70 transition-colors">Điều khoản</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/30">
          © 2026 G-Physics. Được xây dựng cho học sinh Việt Nam.
        </div>
      </div>
    </footer>
  );
}

// ==================== TRUST SECTION ====================

function TrustSection() {
  const trustItems = [
    { icon: Shield, title: "Kiến thức đã xác minh", desc: "Dựa trên SGK chính thống" },
    { icon: Zap, title: "Phản hồi tức thì", desc: "Hỗ trợ 24/7 không giới hạn" },
    { icon: Users, title: "Sư phạm nghiêm túc", desc: "Thiết kế bởi chuyên gia giáo dục" },
  ];

  return (
    <section id="trust" className="py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="glass-card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <item.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-white/40">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ==================== MAIN PAGE ====================

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DifferentiatorSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}
