import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  title: "온새미로 | 한국형 전통 수리 문화 AI 플랫폼",
  description: "다시, 가치를 잇다. AI와 전통 공예가 만나 파손된 일상용품에 새 생명을 불어넣습니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
