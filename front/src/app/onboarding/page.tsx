"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "온새미로에 오신 것을\n환영합니다",
    subtitle: "다시, 가치를 잇다",
    description:
      "깨진 그릇, 낡은 가구를 버리지 마세요. AI와 한국 전통 공예 기법이 만나 물건에 새로운 생명을 불어넣습니다.",
    visual: "🍀",
    bg: "linear-gradient(145deg, #2D1A0E, #5C3D1E, #3D5A4A)",
  },
  {
    id: 2,
    title: "AI가 수리 방법을\n알려드립니다",
    subtitle: "3가지 핵심 기능",
    description: "",
    visual: "🔍",
    bg: "linear-gradient(145deg, #1A2D1A, #2D5C3D, #1A3D2D)",
    features: [
      {
        icon: "🔍",
        title: "AI 파손 분석",
        desc: "사진 한 장으로 균열을 분석하고 나전칠기·옻칠·금계 등 최적 기법을 추천합니다",
      },
      {
        icon: "🌿",
        title: "탄소 절감 추적",
        desc: "수리할 때마다 절감된 탄소량을 계산해 나의 환경 기여도를 시각화합니다",
      },
      {
        icon: "🏺",
        title: "장인 & 재료 연결",
        desc: "전통 공예 장인 매칭과 DIY 친환경 재료 큐레이션으로 끝까지 도와드립니다",
      },
    ],
  },
  {
    id: 3,
    title: "어떤 수리에\n관심이 있으신가요?",
    subtitle: "맞춤 경험을 위해 선택해주세요",
    description: "나중에 언제든지 바꿀 수 있습니다",
    visual: "🎯",
    bg: "linear-gradient(145deg, #1A1A2D, #2D1A5C, #2D2D3D)",
    interests: [
      { id: "pottery", icon: "🏺", label: "도자기·그릇", desc: "균열, 파손된 도자기 복원" },
      { id: "furniture", icon: "🪵", label: "가구·목기", desc: "긁힘, 파손된 목재 수리" },
      { id: "lacquer", icon: "🌿", label: "옻칠·나전", desc: "전통 공예 기법 직접 배우기" },
      { id: "metal", icon: "✨", label: "금계·금속", desc: "황금빛 균열 예술로 승화" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (isLast) {
      router.push("/");
    } else {
      setCurrentStep((p) => p + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: step.bg, transition: "background 0.6s ease" }}
    >
      {/* 상단 진행 바 */}
      <div className="px-8 pt-8 flex items-center gap-3">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              flex: i === currentStep ? 2 : 1,
              background:
                i <= currentStep
                  ? "rgba(201, 168, 76, 0.9)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
        <Link
          href="/"
          className="ml-4 text-sm flex-shrink-0"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          건너뛰기
        </Link>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-lg mx-auto w-full">
        {/* Step 1 — 웰컴 */}
        {currentStep === 0 && (
          <div className="flex flex-col items-center text-center gap-8 w-full">
            {/* 로고 애니메이션 */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "rgba(201, 168, 76, 0.5)", animationDuration: "2s" }}
              />
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center text-6xl"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "2px solid rgba(201, 168, 76, 0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                🍀
              </div>
            </div>

            <div>
              <p
                className="text-sm font-semibold tracking-widest mb-4"
                style={{ color: "rgba(201, 168, 76, 0.8)" }}
              >
                {step.subtitle}
              </p>
              <h1
                className="text-4xl font-bold leading-tight whitespace-pre-line"
                style={{ color: "#F8F4ED" }}
              >
                {step.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed" style={{ color: "rgba(248,244,237,0.65)" }}>
                {step.description}
              </p>
            </div>

            {/* 환경 수치 */}
            <div
              className="w-full rounded-2xl p-5 grid grid-cols-3 gap-4 text-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {[
                { value: "4.2kg", label: "도자기 1개\n절감 탄소" },
                { value: "68%", label: "수리 대신\n폐기하는 비율" },
                { value: "1,247", label: "오늘\n수리된 물건" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold" style={{ color: "#C9A84C" }}>
                    {stat.value}
                  </p>
                  <p
                    className="text-xs mt-1 whitespace-pre-line leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — 기능 소개 */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center gap-8 w-full">
            <div>
              <p
                className="text-sm font-semibold tracking-widest mb-4"
                style={{ color: "rgba(74, 222, 128, 0.8)" }}
              >
                {step.subtitle}
              </p>
              <h1
                className="text-4xl font-bold leading-tight whitespace-pre-line"
                style={{ color: "#F8F4ED" }}
              >
                {step.title}
              </h1>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {step.features?.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 rounded-2xl p-5 text-left"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: "#F8F4ED" }}>
                      {f.title}
                    </p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(248,244,237,0.6)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — 관심사 선택 */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center text-center gap-8 w-full">
            <div>
              <p
                className="text-sm font-semibold tracking-widest mb-4"
                style={{ color: "rgba(168, 212, 204, 0.8)" }}
              >
                {step.subtitle}
              </p>
              <h1
                className="text-4xl font-bold leading-tight whitespace-pre-line"
                style={{ color: "#F8F4ED" }}
              >
                {step.title}
              </h1>
              <p className="mt-3 text-sm" style={{ color: "rgba(248,244,237,0.45)" }}>
                {step.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {step.interests?.map((interest) => {
                const selected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className="rounded-2xl p-5 text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: selected
                        ? "rgba(201, 168, 76, 0.2)"
                        : "rgba(255,255,255,0.07)",
                      border: selected
                        ? "2px solid rgba(201, 168, 76, 0.7)"
                        : "2px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="text-3xl mb-3">{interest.icon}</div>
                    <p className="font-bold text-sm" style={{ color: "#F8F4ED" }}>
                      {interest.label}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(248,244,237,0.55)" }}>
                      {interest.desc}
                    </p>
                    {selected && (
                      <div
                        className="mt-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#C9A84C", color: "#1C1C1C" }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-6 pb-10 max-w-lg mx-auto w-full flex flex-col gap-3">
        <button
          onClick={handleNext}
          disabled={isLast && selectedInterests.length === 0}
          className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background:
              isLast && selectedInterests.length === 0
                ? "rgba(255,255,255,0.2)"
                : "linear-gradient(135deg, #C9A84C, #D4B565)",
            color: isLast && selectedInterests.length === 0 ? "rgba(255,255,255,0.5)" : "#1C1C1C",
          }}
        >
          {isLast
            ? selectedInterests.length === 0
              ? "관심 분야를 선택해주세요"
              : "시작하기 🍀"
            : "다음으로 →"}
        </button>

        {/* 페이지 도트 */}
        <div className="flex justify-center gap-2 mt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentStep ? "20px" : "6px",
                height: "6px",
                background:
                  i === currentStep
                    ? "rgba(201, 168, 76, 0.9)"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
