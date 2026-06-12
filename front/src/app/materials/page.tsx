"use client";

import { useState } from "react";
import Link from "next/link";

interface Material {
  id: number;
  name: string;
  category: string;
  origin: string;
  price: number;
  unit: string;
  description: string;
  usage: string[];
  techniques: string[];
  ecoScore: number;
  icon: string;
  tags: string[];
  inStock: boolean;
}

const materials: Material[] = [
  {
    id: 1,
    name: "천연 생칠 (순옻)",
    category: "옻칠",
    origin: "국내산 (경기 이천)",
    price: 28000,
    unit: "100ml",
    description:
      "국내 옻나무에서 채취한 100% 천연 생칠. 방수성과 항균성이 뛰어나며 균열 메움 후 단단하게 굳어 반영구적 수리가 가능합니다.",
    usage: ["균열 메움", "도포 마감", "방수 처리"],
    techniques: ["금계", "옻칠", "나전칠기"],
    ecoScore: 98,
    icon: "🌿",
    tags: ["천연 인증", "국내산", "무독성"],
    inStock: true,
  },
  {
    id: 2,
    name: "24K 순금분",
    category: "금속재",
    origin: "일본산 (최고급)",
    price: 45000,
    unit: "1g",
    description:
      "금계 기법의 핵심 재료. 옻칠에 혼합하여 균열 위에 도포하면 황금빛 라인이 생겨 파손 흔적을 예술적 요소로 승화시킵니다.",
    usage: ["금계 마감", "나전 테두리", "장식 포인트"],
    techniques: ["금계", "나전칠기"],
    ecoScore: 75,
    icon: "✨",
    tags: ["순금", "24K"],
    inStock: true,
  },
  {
    id: 3,
    name: "자개 조각 세트 (전복)",
    category: "나전",
    origin: "국내산 (완도 전복)",
    price: 18000,
    unit: "20g 세트",
    description:
      "완도산 전복 자개를 다양한 크기로 재단한 세트. 나전칠기 기법에 사용하며 균열 부위를 화려한 자개 무늬로 메웁니다.",
    usage: ["균열 충전", "패턴 장식", "모자이크"],
    techniques: ["나전칠기"],
    ecoScore: 92,
    icon: "🦪",
    tags: ["국내산", "자연 소재", "친환경"],
    inStock: true,
  },
  {
    id: 4,
    name: "정제 옻칠 (흑칠)",
    category: "옻칠",
    origin: "국내산 (경북 영덕)",
    price: 35000,
    unit: "100ml",
    description:
      "산화 처리로 검은색을 띠는 정제 옻칠. 표면 마감 및 방수 코팅에 사용되며 특유의 깊은 광택이 도자기에 고급스러운 질감을 부여합니다.",
    usage: ["표면 마감", "방수 코팅", "색조 처리"],
    techniques: ["옻칠", "나전칠기", "금계"],
    ecoScore: 95,
    icon: "⚫",
    tags: ["천연 인증", "국내산", "고광택"],
    inStock: false,
  },
  {
    id: 5,
    name: "황금동 와이어 (끊음질용)",
    category: "금속재",
    origin: "국내산",
    price: 12000,
    unit: "5m",
    description:
      "끊음질 기법에 사용하는 황금빛 동선. 균열 선을 따라 세공해 기하학적 패턴을 만들며, 표면에 옻칠을 도포하면 영구적으로 고정됩니다.",
    usage: ["선형 세공", "기하학 패턴", "테두리 마감"],
    techniques: ["끊음질"],
    ecoScore: 70,
    icon: "🧵",
    tags: ["국내산"],
    inStock: true,
  },
  {
    id: 6,
    name: "전통 모 붓 세트",
    category: "도구",
    origin: "국내산 (안성 전통 공방)",
    price: 22000,
    unit: "3개 세트",
    description:
      "옻칠 도포에 최적화된 천연 모 붓 세트. 가는 선, 넓은 면, 세밀한 마감 각 용도에 맞는 3가지 크기로 구성됩니다.",
    usage: ["옻칠 도포", "금분 도포", "세밀 작업"],
    techniques: ["금계", "옻칠", "나전칠기"],
    ecoScore: 96,
    icon: "🖌️",
    tags: ["전통 공방", "천연 모"],
    inStock: true,
  },
  {
    id: 7,
    name: "산화철 안료 (전통 주색)",
    category: "안료",
    origin: "국내산",
    price: 15000,
    unit: "50g",
    description:
      "전통 도자기 보수에 사용하는 천연 산화철 안료. 주황빛 붉은 색으로 전통 도자기 균열 주변 색상 보정에 활용됩니다.",
    usage: ["색상 보정", "균열 은폐", "도자기 복원"],
    techniques: ["옻칠", "도자 복원"],
    ecoScore: 90,
    icon: "🎨",
    tags: ["천연 안료", "전통색"],
    inStock: true,
  },
  {
    id: 8,
    name: "금계 입문 DIY 키트",
    category: "세트",
    origin: "복합",
    price: 65000,
    unit: "완전 세트",
    description:
      "초보자도 쉽게 금계를 시작할 수 있는 올인원 키트. 생칠 20ml, 금분 0.5g, 세공 붓 2개, 사포 5장, 상세 한글 가이드북이 포함됩니다.",
    usage: ["금계 수리 전 과정"],
    techniques: ["금계"],
    ecoScore: 90,
    icon: "📦",
    tags: ["입문자 추천", "올인원", "가이드 포함"],
    inStock: true,
  },
];

const categories = ["전체", "옻칠", "금속재", "나전", "안료", "도구", "세트"];

export default function MaterialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [cart, setCart] = useState<number[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const filtered = materials.filter(
    (m) => selectedCategory === "전체" || m.category === selectedCategory
  );

  const addToCart = (id: number) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="tag tag-teal mb-3">전통 재료 큐레이션</span>
          <h1 className="section-title mt-3">친환경 전통 재료</h1>
          <p className="section-subtitle mt-3 max-w-xl">
            AI가 분석한 파손 유형에 최적화된 전통 재료를 큐레이션합니다.
            모든 제품은 친환경 인증을 받은 국내산 또는 전통 소재입니다.
          </p>
        </div>
        {/* 장바구니 */}
        <div
          className="lacquer-card rounded-xl px-4 py-3 flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-xl">🛒</span>
          <span className="font-bold" style={{ color: "var(--primary)" }}>
            {cart.length}
          </span>
        </div>
      </div>

      {/* AI 추천 배너 */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(92, 61, 30, 0.08), rgba(201, 168, 76, 0.08))",
          border: "1px solid rgba(201, 168, 76, 0.3)",
        }}
      >
        <span className="text-3xl">🤖</span>
        <div className="flex-1">
          <p className="font-bold" style={{ color: "var(--primary)" }}>
            AI 맞춤 추천
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            파손 분석 결과를 바탕으로 최적의 재료를 추천받으세요. 분석 후 자동으로 재료가 큐레이션됩니다.
          </p>
        </div>
        <Link href="/analyze">
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            파손 분석 먼저 →
          </button>
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: selectedCategory === cat ? "var(--primary)" : "white",
              color: selectedCategory === cat ? "white" : "var(--muted-foreground)",
              border: "1px solid",
              borderColor: selectedCategory === cat ? "var(--primary)" : "var(--border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((material) => (
          <div
            key={material.id}
            className="lacquer-card rounded-2xl overflow-hidden"
          >
            {/* 상품 이미지 영역 */}
            <div
              className="flex items-center justify-center h-40 text-6xl"
              style={{
                background: "linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(45, 125, 111, 0.08))",
              }}
            >
              {material.icon}
            </div>

            <div className="p-5">
              {/* 재고 상태 */}
              {!material.inStock && (
                <div
                  className="text-xs font-medium mb-2 px-2 py-1 rounded-lg inline-block"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#DC2626",
                  }}
                >
                  품절
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold" style={{ color: "var(--primary)" }}>
                  {material.name}
                </h3>
                <span
                  className="tag flex-shrink-0"
                  style={{
                    background: "rgba(45, 125, 111, 0.1)",
                    color: "var(--teal)",
                  }}
                >
                  친환경 {material.ecoScore}
                </span>
              </div>

              <p
                className="text-xs mb-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                📍 {material.origin} · {material.unit}
              </p>

              <p
                className="text-sm leading-relaxed mb-3 line-clamp-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                {material.description}
              </p>

              {/* 적용 기법 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {material.techniques.map((t) => (
                  <span key={t} className="tag tag-primary text-xs">
                    {t}
                  </span>
                ))}
              </div>

              {/* 가격 + 버튼 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                    {material.price.toLocaleString()}원
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {material.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: "var(--muted)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    상세
                  </button>
                  <button
                    onClick={() => material.inStock && addToCart(material.id)}
                    disabled={!material.inStock}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: cart.includes(material.id)
                        ? "var(--teal)"
                        : "var(--primary)",
                    }}
                  >
                    {cart.includes(material.id) ? "✓ 담음" : "담기"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 장바구니 요약 */}
      {cart.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl"
          style={{
            background: "var(--primary)",
            color: "white",
            minWidth: "320px",
          }}
        >
          <span className="text-2xl">🛒</span>
          <div className="flex-1">
            <p className="font-bold">{cart.length}개 담음</p>
            <p className="text-sm opacity-70">
              총{" "}
              {cart
                .reduce((sum, id) => {
                  const m = materials.find((m) => m.id === id);
                  return sum + (m?.price ?? 0);
                }, 0)
                .toLocaleString()}원
            </p>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl font-bold transition-all hover:opacity-90"
            style={{ background: "var(--accent)", color: "#1C1C1C" }}
          >
            구매하기 →
          </button>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedMaterial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedMaterial(null)}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedMaterial.icon}</div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {selectedMaterial.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                {selectedMaterial.origin} · {selectedMaterial.unit}
              </p>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
              {selectedMaterial.description}
            </p>

            <div className="mb-4">
              <p className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
                주요 용도
              </p>
              <ul className="flex flex-col gap-1.5">
                {selectedMaterial.usage.map((u) => (
                  <li key={u} className="flex items-center gap-2 text-sm">
                    <span style={{ color: "var(--accent)" }}>•</span>
                    <span style={{ color: "var(--foreground)" }}>{u}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
                적용 기법
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMaterial.techniques.map((t) => (
                  <span key={t} className="tag tag-teal">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                  {selectedMaterial.price.toLocaleString()}원
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(45, 125, 111, 0.1)" }}
              >
                <span>🌿</span>
                <span className="font-bold text-sm" style={{ color: "var(--teal)" }}>
                  친환경 {selectedMaterial.ecoScore}점
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  addToCart(selectedMaterial.id);
                  setSelectedMaterial(null);
                }}
                disabled={!selectedMaterial.inStock}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40"
                style={{ background: "var(--primary)" }}
              >
                {selectedMaterial.inStock ? "장바구니 담기" : "품절"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
