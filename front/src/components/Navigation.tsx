"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/analyze", label: "AI 파손 분석" },
  { href: "/challenge", label: "챌린지" },
  { href: "/dashboard", label: "탄소 절감 현황" },
  { href: "/artisans", label: "장인 매칭" },
  { href: "/materials", label: "전통 재료" },
];

const isLoggedIn = true;

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "rgba(250, 247, 242, 0.95)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🍀</span>
          <div>
            <span
              className="font-bold text-xl tracking-tight"
              style={{ color: "var(--primary)" }}
            >
              온새미로
            </span>
            <span
              className="ml-2 text-xs font-medium hidden sm:inline"
              style={{ color: "var(--muted-foreground)" }}
            >
              다시, 가치를 잇다
            </span>
          </div>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  background: isActive ? "rgba(92, 61, 30, 0.08)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* CTA 버튼 */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <Link href="/mypage">
              <button
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-80"
                style={{
                  background: pathname === "/mypage" ? "rgba(92, 61, 30, 0.08)" : "transparent",
                  color: pathname === "/mypage" ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                  style={{ background: "linear-gradient(135deg, #5C3D1E, #2D7D6F)" }}>
                  🍀
                </span>
                마이페이지
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button
                className="text-sm px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                로그인
              </button>
            </Link>
          )}
          <Link href="/analyze">
            <button className="btn-primary text-sm px-5 py-2.5">
              지금 시작하기
            </button>
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "var(--primary)" }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-2"
          style={{ borderColor: "var(--border)", background: "rgba(250, 247, 242, 0.98)" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  background: isActive ? "rgba(92, 61, 30, 0.08)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            {isLoggedIn ? (
              <Link href="/mypage" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button
                  className="w-full py-3 rounded-lg text-sm font-medium"
                  style={{ background: "var(--muted)", color: "var(--primary)" }}
                >
                  🍀 마이페이지
                </button>
              </Link>
            ) : (
              <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button
                  className="w-full py-3 rounded-lg text-sm font-medium"
                  style={{ background: "var(--muted)", color: "var(--primary)" }}
                >
                  로그인
                </button>
              </Link>
            )}
            <Link href="/analyze" className="flex-1" onClick={() => setMenuOpen(false)}>
              <button
                className="w-full py-3 rounded-lg text-sm font-bold text-white"
                style={{ background: "var(--primary)" }}
              >
                시작하기
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
