import type { TranslationKey } from "./vi";

const en: Record<TranslationKey, string> = {
    // Common
    "common.appName": "G-Physics",
    "common.login": "Sign in",
    "common.signup": "Sign up",
    "common.logout": "Sign out",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.startFree": "Get started free",
    "common.admin": "Admin",

    // Navbar
    "nav.features": "Features",
    "nav.howItWorks": "How it works",
    "nav.compare": "Why us",
    "nav.resources": "Trust",

    // Hero
    "hero.badge": "Smart Physics Learning Platform",
    "hero.title1": "G-Physics",
    "hero.title2": "Your AI Physics Tutor",
    "hero.subtitle": "Not just another chatbot — G-Physics is a structured learning system that helps you truly understand physics, practice smarter, and walk into your national exam with confidence.",
    "hero.cta": "Start learning — it's free",
    "hero.stat1.value": "4",
    "hero.stat1.label": "Tutoring Modes",
    "hero.stat2.value": "7+",
    "hero.stat2.label": "Physics Chapters",
    "hero.stat3.value": "24/7",
    "hero.stat3.label": "Always Available",

    // Features
    "features.title": "4 tutoring modes,",
    "features.titleHighlight": "thoughtfully designed",
    "features.subtitle": "An AI tutor that evolves with you — from gentle nudges to complete walkthroughs, making sure you actually think before seeing the answer.",
    "features.hint.title": "Smart Hints",
    "features.hint.desc": "Poses guiding questions so you can find the approach on your own — no spoilers.",
    "features.concept.title": "Concept Review",
    "features.concept.desc": "Brings up the relevant laws, principles, and formulas so you grasp the core physics at play.",
    "features.guided.title": "Step-by-Step",
    "features.guided.desc": "Breaks tough problems into bite-sized steps and walks you through each one.",
    "features.full.title": "Full Solution",
    "features.full.desc": "A complete, exam-ready solution — neatly laid out from given data to final answer.",

    // How it works
    "how.title": "How",
    "how.titleHighlight": "G-Physics",
    "how.titleEnd": "works",
    "how.step1.title": "Ask a question",
    "how.step1.desc": "Type a question, snap a photo of your problem, or upload a document",
    "how.step2.title": "AI kicks in",
    "how.step2.desc": "The system detects the topic, gauges difficulty, and picks the right level of help",
    "how.step3.title": "Guided learning",
    "how.step3.desc": "Get hints, concept refreshers, or a step-by-step walkthrough",
    "how.step4.title": "Track your growth",
    "how.step4.desc": "The system spots your weak areas and suggests exercises tailored to you",

    // Compare
    "compare.title": "Why choose",
    "compare.titleHighlight": "G-Physics",
    "compare.subtitle": "See how we stack up against generic AI tools",
    "compare.generic": "Generic AI",
    "compare.gphysics": "G-Physics",
    "compare.row1.generic": "Hands you the answer right away",
    "compare.row1.gphysics": "Guides your thinking first, answer later",
    "compare.row2.generic": "No accuracy checks",
    "compare.row2.gphysics": "Cross-checked against verified textbooks",
    "compare.row3.generic": "Unstructured, free-form chat",
    "compare.row3.gphysics": "4 purposeful tutoring modes",
    "compare.row4.generic": "No progress tracking",
    "compare.row4.gphysics": "Tracks weak spots, suggests personalized review",
    "compare.row5.generic": "No question bank",
    "compare.row5.gphysics": "Practice by topic + AI-generated mock exams",

    // CTA
    "cta.title": "Ready to study Physics",
    "cta.titleHighlight": "the smart way",
    "cta.subtitle": "Join G-Physics and get a head start on your national exam prep",
    "cta.button": "Create your free account",

    // Trust
    "trust.verified.title": "Verified Content",
    "trust.verified.desc": "Grounded in official textbooks",
    "trust.instant.title": "Instant Help",
    "trust.instant.desc": "Available 24/7, no limits",
    "trust.pedagogy.title": "Real Pedagogy",
    "trust.pedagogy.desc": "Crafted by education professionals",

    // Footer
    "footer.desc": "A smart Physics learning platform for Vietnamese Grade 12 students. Structured AI meets serious pedagogy.",
    "footer.product": "Product",
    "footer.aiTutor": "AI Tutor",
    "footer.practice": "Practice",
    "footer.library": "Library",
    "footer.support": "Support",
    "footer.guide": "User Guide",
    "footer.contact": "Contact",
    "footer.terms": "Terms",
    "footer.copyright": "© 2026 G-Physics. Made for Vietnamese students.",

    // Auth
    "auth.login.title": "Welcome back",
    "auth.login.subtitle": "Pick up where you left off",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.remember": "Keep me signed in",
    "auth.login.forgot": "Forgot password?",
    "auth.login.button": "Sign in",
    "auth.login.noAccount": "New here?",
    "auth.login.signupLink": "Create an account",
    "auth.login.emailPlaceholder": "student@example.com",

    "auth.signup.title": "Create your account",
    "auth.signup.subtitle": "Start your Physics journey today",
    "auth.signup.name": "Full name",
    "auth.signup.namePlaceholder": "John Doe",
    "auth.signup.email": "Email",
    "auth.signup.password": "Password",
    "auth.signup.passwordHint": "At least 8 characters",
    "auth.signup.confirm": "Confirm password",
    "auth.signup.confirmPlaceholder": "Type your password again",
    "auth.signup.button": "Create account",
    "auth.signup.hasAccount": "Already have an account?",
    "auth.signup.loginLink": "Sign in",
    "auth.signup.passwordMismatch": "Passwords don't match",
    "auth.signup.weakPassword": "Password needs to be at least 8 characters",

    "auth.forgot.title": "Forgot your password?",
    "auth.forgot.subtitle": "Enter your email and we'll send a reset link",
    "auth.forgot.button": "Send reset link",
    "auth.forgot.back": "Back to sign in",

    "auth.errorCode": "Error code",

    // Dashboard
    "dashboard.greeting": "Hey,",
    "dashboard.subtitle": "Let's dive into Physics 12 with your AI tutor.",
    "dashboard.askAI": "Ask AI",
    "dashboard.askAIDesc": "Got a Physics question? Fire away",
    "dashboard.practice": "Practice",
    "dashboard.practiceDesc": "Jump into a practice session",
    "dashboard.library": "Library",
    "dashboard.libraryDesc": "Your study materials, organized",
    "dashboard.profile": "Profile",
    "dashboard.profileDesc": "See how you're progressing",
    "dashboard.startTitle": "Let's get started!",
    "dashboard.startDesc": "Ask your first question or try a practice set — your learning profile gets built as you go.",
    "dashboard.startButton": "Start with AI Tutor",

    // Sidebar
    "sidebar.aiTutor": "AI Tutor",
    "sidebar.practice": "Practice",
    "sidebar.library": "Library",
    "sidebar.overview": "Overview",
    "sidebar.profile": "My Progress",
    "sidebar.chatHistory": "Chat History",
    "sidebar.newChat": "New chat",
    "sidebar.noChats": "No conversations yet",
    "sidebar.workspace": "Workspace",
    "sidebar.aiActive": "AI Active",

    // Profile
    "profile.title": "My Progress",
    "profile.subtitle": "Your strengths, weak spots, and milestones",
    "profile.totalQuestions": "Questions Attempted",
    "profile.accuracy": "Accuracy",
    "profile.sessions": "Sessions",
    "profile.studyTime": "Study Time",
    "profile.emptyTitle": "No data yet",
    "profile.emptyDesc": "Start studying and practicing — the system will analyze your strengths, weak spots, and progress over time.",
    "profile.startButton": "Start learning",

    // Tutor
    "tutor.inputPlaceholder": "Type a Physics question...",
    "tutor.send": "Send",

    // Practice
    "practice.title": "Practice",

    // Library
    "library.title": "Document Library",
    "library.searchPlaceholder": "Search your documents...",
    "library.docName": "Document name",
    "library.tags": "Tags, separated by commas",

    // Admin
    "admin.topics.title": "Topic Tree",
    "admin.topics.subtitle": "Manage the Physics 12 curriculum structure",
    "admin.topics.add": "Add Topic",
    "admin.topics.name": "Topic name",
    "admin.topics.nameVi": "Vietnamese name",
    "admin.topics.chapter": "Chapter",
    "admin.topics.slug": "Slug",
    "admin.topics.description": "Description",
    "admin.topics.descPlaceholder": "Describe this topic...",
    "admin.topics.subtopicCount": "subtopics",

    "admin.users.title": "Users",
    "admin.users.searchPlaceholder": "Search users...",
    "admin.users.student": "Student",
    "admin.users.teacher": "Teacher",
    "admin.users.admin": "Admin",
    "admin.users.count": "users",

    "admin.questions.title": "Question Bank",
    "admin.questions.searchPlaceholder": "Search questions...",
    "admin.questions.count": "questions",
    "admin.questions.add": "Add Question",
    "admin.questions.content": "Question text",
    "admin.questions.contentPlaceholder": "Write the question here...",
    "admin.questions.optionA": "Option A",
    "admin.questions.optionB": "Option B",
    "admin.questions.optionC": "Option C",
    "admin.questions.optionD": "Option D",
    "admin.questions.explanation": "Solution & explanation",
    "admin.questions.explanationPlaceholder": "Walk through the solution...",

    // Welcome Screen
    "welcome.greeting": "Welcome back,",
    "welcome.defaultName": "there",
    "welcome.subtitle": "Ready to pick up where you left off? 🚀",
    "welcome.tapToContinue": "Tap to continue",

    // Onboarding
    "onboarding.back": "Back",
    "onboarding.next": "Next",
    "onboarding.skip": "Skip intro",
    "onboarding.start": "Let's go!",

    "onboarding.step1.title": "Welcome to G-Physics!",
    "onboarding.step1.desc": "The smartest way to study Grade 12 Physics — powered by an AI tutor that teaches you how to think, not just what to memorize.",
    "onboarding.step1.f1": "AI guides your reasoning instead of giving answers",
    "onboarding.step1.f2": "4 support levels: from hints to full solutions",
    "onboarding.step1.f3": "Tracks your progress and suggests what to review",

    "onboarding.step2.title": "AI Tutor",
    "onboarding.step2.desc": "Ask any Physics question — the AI walks you through the thinking process step by step instead of just dropping an answer.",
    "onboarding.step2.f1": "Type a question or snap a photo of a problem",
    "onboarding.step2.f2": "Pick a mode: Hints → Concepts → Step-by-step → Full",
    "onboarding.step2.f3": "AI remembers your chat history for continuous help",

    "onboarding.step3.title": "Practice & Exams",
    "onboarding.step3.desc": "Sharpen your skills with topic-based drills or full-length AI-generated mock exams that mirror the national test.",
    "onboarding.step3.f1": "Filter by topic or go for an all-chapters challenge",
    "onboarding.step3.f2": "Mock exams modeled after the national exam format",
    "onboarding.step3.f3": "Review detailed solutions after each question",

    "onboarding.step4.title": "Library & Resources",
    "onboarding.step4.desc": "Your personal vault for formulas, notes, and saved solutions — everything you need for quick revision.",
    "onboarding.step4.f1": "Look up formulas instantly by chapter",
    "onboarding.step4.f2": "Save great solutions to your personal collection",
    "onboarding.step4.f3": "Upload your own study materials",

    "onboarding.step5.title": "You're all set!",
    "onboarding.step5.desc": "You know the essentials. Time to start your Physics 12 journey!",
    "onboarding.step5.f1": "Ask your first question to the AI Tutor",
    "onboarding.step5.f2": "Try a quick practice drill",
    "onboarding.step5.f3": "Explore the formula library",

    // Theme
    "theme.dark": "Dark",
    "theme.light": "Light",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
};

export default en;
