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
import { useTranslation } from "@/lib/i18n";
import { SettingsToggles } from "@/components/SettingsToggles";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// ==================== NAVBAR ====================

function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.compare"), href: "#compare" },
    { label: t("nav.resources"), href: "#trust" },
  ];

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
          <Link href="/" className="flex items-center gap-2 pl-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Atom className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-white hidden sm:inline">G-Physics</span>
          </Link>

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

          <div className="flex items-center gap-2">
            <SettingsToggles compact />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm font-medium bg-white text-[#0c0d1f] hover:bg-white/90 transition-colors"
            >
              {t("common.login")}
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
                  {t("common.login")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-base font-medium text-[#0c0d1f] bg-white rounded-2xl text-center hover:bg-white/90"
                >
                  {t("common.startFree")}
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
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
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
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          <span className="gradient-text">{t("hero.title1")}</span>
          <br />
          <span className="text-white/90">{t("hero.title2")}</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
          >
            {t("hero.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
          >
            {t("common.login")}
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: t("hero.stat1.value"), label: t("hero.stat1.label") },
            { value: t("hero.stat2.value"), label: t("hero.stat2.label") },
            { value: t("hero.stat3.value"), label: t("hero.stat3.label") },
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

function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Lightbulb,
      title: t("features.hint.title"),
      description: t("features.hint.desc"),
      color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20",
    },
    {
      icon: BookOpen,
      title: t("features.concept.title"),
      description: t("features.concept.desc"),
      color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20",
    },
    {
      icon: Target,
      title: t("features.guided.title"),
      description: t("features.guided.desc"),
      color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20",
    },
    {
      icon: GraduationCap,
      title: t("features.full.title"),
      description: t("features.full.desc"),
      color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20",
    },
  ];

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
            {t("features.title")} <span className="gradient-text">{t("features.titleHighlight")}</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            {t("features.subtitle")}
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

function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    { icon: FileText, title: t("how.step1.title"), description: t("how.step1.desc") },
    { icon: Brain, title: t("how.step2.title"), description: t("how.step2.desc") },
    { icon: Sparkles, title: t("how.step3.title"), description: t("how.step3.desc") },
    { icon: BarChart3, title: t("how.step4.title"), description: t("how.step4.desc") },
  ];

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
            {t("how.title")} <span className="gradient-text">{t("how.titleHighlight")}</span> {t("how.titleEnd")}
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
  const { t } = useTranslation();

  const comparisons = [
    { generic: t("compare.row1.generic"), gphysics: t("compare.row1.gphysics") },
    { generic: t("compare.row2.generic"), gphysics: t("compare.row2.gphysics") },
    { generic: t("compare.row3.generic"), gphysics: t("compare.row3.gphysics") },
    { generic: t("compare.row4.generic"), gphysics: t("compare.row4.gphysics") },
    { generic: t("compare.row5.generic"), gphysics: t("compare.row5.gphysics") },
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
            {t("compare.title")} <span className="gradient-text">{t("compare.titleHighlight")}</span>?
          </h2>
          <p className="text-white/50">{t("compare.subtitle")}</p>
        </motion.div>

        <motion.div
          className="glass-panel p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center text-sm font-semibold text-white/40 uppercase tracking-wider">{t("compare.generic")}</div>
            <div className="text-center text-sm font-semibold text-indigo-400 uppercase tracking-wider">{t("compare.gphysics")}</div>
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
  const { t } = useTranslation();

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
          {t("cta.title")} <span className="gradient-text">{t("cta.titleHighlight")}</span>?
        </h2>
        <p className="text-white/50 mb-10">
          {t("cta.subtitle")}
        </p>
        <Link
          href="/signup"
          className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-5 rounded-2xl"
        >
          {t("cta.button")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white">G-Physics</span>
            </div>
            <p className="text-sm text-white/40 max-w-sm">
              {t("footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="/login" className="hover:text-white/70 transition-colors">{t("footer.aiTutor")}</Link></li>
              <li><Link href="/login" className="hover:text-white/70 transition-colors">{t("footer.practice")}</Link></li>
              <li><Link href="/login" className="hover:text-white/70 transition-colors">{t("footer.library")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/30 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <a href="mailto:quocnam03.31@gmail.com" className="hover:text-white/70 transition-colors">quocnam03.31@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/30 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                <a href="https://instagram.com/sh1robu" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">@sh1robu</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">Made by <span className="text-white/50 font-medium">GiCoffee Team</span></p>
          <p className="text-xs text-white/20 mt-1">Contact: Pham Quoc Nam</p>
        </div>
      </div>
    </footer>
  );
}

// ==================== TRUST SECTION ====================

function TrustSection() {
  const { t } = useTranslation();

  const trustItems = [
    { icon: Shield, title: t("trust.verified.title"), desc: t("trust.verified.desc") },
    { icon: Zap, title: t("trust.instant.title"), desc: t("trust.instant.desc") },
    { icon: Users, title: t("trust.pedagogy.title"), desc: t("trust.pedagogy.desc") },
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
