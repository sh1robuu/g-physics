import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen" style={{ fontFamily: "'Lexend', sans-serif" }}>{children}</body>
    </html>
  );
}
