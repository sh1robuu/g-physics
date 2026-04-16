import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { AppInitializer } from "@/components/AppInitializer";

export const metadata: Metadata = {
  title: "G-Physics | AI-Powered Physics Learning Platform",
  description:
    "Nền tảng học Vật lý thông minh cho học sinh lớp 12 chuẩn bị thi THPT Quốc gia. Gia sư AI có hướng dẫn, luyện đề, thư viện cá nhân.",
  keywords: [
    "vật lý lớp 12",
    "AI tutor",
    "gia sư vật lý",
    "luyện thi THPT",
    "physics learning",
    "G-Physics",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('g-physics-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', t);
                  var l = localStorage.getItem('g-physics-lang') || 'vi';
                  document.documentElement.setAttribute('lang', l);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen" style={{ fontFamily: "'Google Sans', system-ui, sans-serif" }}>
        <AppInitializer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
