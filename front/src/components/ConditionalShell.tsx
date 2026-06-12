"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

const HIDE_SHELL = ["/onboarding", "/login"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = HIDE_SHELL.some((p) => pathname.startsWith(p));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="flex-1">{children}</main>
      <footer
        className="py-8 text-center"
        style={{ background: "var(--primary)", color: "rgba(255,255,255,0.7)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍀</span>
              <span className="font-bold text-white text-lg">온새미로</span>
            </div>
            <p className="text-sm">다시, 가치를 잇다 — 한국형 전통 수리 문화 AI 플랫폼</p>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              나전칠기 · 옻칠 · 금계 · 줄음질로 물건에 새로운 생명을
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
