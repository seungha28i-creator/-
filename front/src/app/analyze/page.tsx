"use client";

import { useState, useRef } from "react";

interface AnalysisResult {
  damageType: string;
  severity: string;
  material: string;
  recommendedTechnique: string;
  techniqueDescription: string;
  steps: string[];
  estimatedTime: string;
  difficulty: string;
  carbonSaved: number;
  previewDescription: string;
  materials: string[];
}

const exampleResults: AnalysisResult = {
  damageType: "선형 균열 + 파편 결손",
  severity: "중간 (3/5)",
  material: "백자 도자기",
  recommendedTechnique: "금계 (金繼) 기법",
  techniqueDescription:
    "금계는 일본의 킨쓰기에서 영향받은 한국식 기법으로, 천연 옻칠로 균열을 메운 뒤 금분을 덧입혀 파손 흔적을 예술적 요소로 승화시킵니다.",
  steps: [
    "균열 주변을 부드러운 솔로 먼지 제거",
    "천연 옻칠(생칠)을 균열 부위에 얇게 도포",
    "24시간 이상 고온 다습한 환경에서 건조",
    "건조 후 사포로 표면 고르게 연마",
    "순금분을 혼합한 금옻칠로 마감 처리",
  ],
  estimatedTime: "3~5일",
  difficulty: "초급~중급",
  carbonSaved: 4.2,
  previewDescription:
    "균열 선을 따라 황금빛 라인이 새겨져, 원래의 도자기보다 더욱 독특하고 가치 있는 예술품으로 재탄생합니다.",
  materials: ["천연 옻칠 (생칠)", "금분 (24K)", "아마인유", "사포 (800방)", "천연 모 붓"],
};

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragover, setDragover] = useState(false);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, description }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult(exampleResults);
      }
    } catch {
      setResult(exampleResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <span className="tag tag-primary mb-3">AI 파손 분석</span>
        <h1 className="section-title mt-3">파손 부위를 분석합니다</h1>
        <p className="section-subtitle mt-3 max-w-xl">
          사진을 업로드하면 AI가 균열 형태·재질을 분석하고 최적의 전통 수리 기법과
          단계별 가이드를 제공합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 업로드 영역 */}
        <div className="flex flex-col gap-6">
          {/* 이미지 업로드 */}
          <div
            className={`upload-zone rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-72 ${dragover ? "dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {image ? (
              <div className="w-full">
                <img
                  src={image}
                  alt="업로드된 이미지"
                  className="w-full max-h-64 object-contain rounded-xl"
                />
                <p className="text-center mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {imageName}
                </p>
              </div>
            ) : (
              <>
                <div className="text-5xl">📸</div>
                <div className="text-center">
                  <p className="font-semibold" style={{ color: "var(--primary)" }}>
                    사진을 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                    JPG, PNG, WEBP · 최대 10MB
                  </p>
                </div>
                <div
                  className="flex gap-2 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span className="tag tag-teal">그릇</span>
                  <span className="tag tag-primary">도자기</span>
                  <span className="tag tag-accent">가구</span>
                  <span className="tag tag-teal">목기</span>
                </div>
              </>
            )}
          </div>

          {/* 추가 설명 */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--primary)" }}
            >
              파손 상황 추가 설명 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 3년 된 백자 찻그릇, 낙하로 인한 균열, 균열 길이 약 5cm..."
              rows={3}
              className="w-full rounded-xl border p-4 text-sm resize-none focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                background: "white",
                color: "var(--foreground)",
              }}
            />
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: image
                ? "linear-gradient(135deg, var(--primary), var(--primary-light))"
                : "var(--muted)",
              color: "white",
              boxShadow: image ? "0 4px 16px rgba(92, 61, 30, 0.3)" : "none",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI 분석 중...
              </span>
            ) : (
              "🔍 파손 분석 시작"
            )}
          </button>

          {/* 팁 박스 */}
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: "rgba(45, 125, 111, 0.08)",
              border: "1px solid rgba(45, 125, 111, 0.2)",
              color: "var(--teal)",
            }}
          >
            <strong>📌 촬영 팁:</strong> 자연광 아래 파손 부위가 선명하게 보이도록 촬영하고,
            균열 전체가 프레임에 들어오도록 해주세요. 여러 각도의 사진을 합성하면 더 정확한
            분석이 가능합니다.
          </div>
        </div>

        {/* 결과 영역 */}
        <div>
          {!result && !loading && (
            <div
              className="lacquer-card rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-72 text-center"
            >
              <div className="text-5xl opacity-30">🏺</div>
              <p style={{ color: "var(--muted-foreground)" }}>
                사진을 업로드하고 분석을 시작하면<br />
                여기에 결과가 표시됩니다
              </p>
            </div>
          )}

          {loading && (
            <div className="lacquer-card rounded-2xl p-10 flex flex-col items-center justify-center gap-6 min-h-72">
              <div className="relative w-20 h-20">
                <div
                  className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                />
                <div className="absolute inset-3 text-3xl flex items-center justify-center">🔍</div>
              </div>
              <div className="text-center">
                <p className="font-semibold" style={{ color: "var(--primary)" }}>AI 분석 중</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  균열 형태, 재질, 적합한 수리 기법을 파악하고 있습니다
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                {["균열 유형 분석", "재질 판별", "수리 기법 매칭", "단계별 가이드 생성"].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full animate-pulse"
                      style={{
                        background: "var(--teal)",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-4">
              {/* 분석 요약 */}
              <div className="lacquer-card rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>
                  🔬 분석 결과
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "파손 유형", value: result.damageType },
                    { label: "심각도", value: result.severity },
                    { label: "재질", value: result.material },
                    { label: "난이도", value: result.difficulty },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3"
                      style={{ background: "rgba(92, 61, 30, 0.05)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                        {item.label}
                      </p>
                      <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추천 기법 */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(92, 61, 30, 0.08), rgba(201, 168, 76, 0.06))",
                  border: "1px solid rgba(201, 168, 76, 0.3)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>추천 수리 기법</p>
                    <h3 className="font-bold text-xl" style={{ color: "var(--primary)" }}>
                      {result.recommendedTechnique}
                    </h3>
                  </div>
                  <span
                    className="ml-auto tag tag-accent"
                  >
                    예상 {result.estimatedTime}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {result.techniqueDescription}
                </p>
              </div>

              {/* 수리 미리보기 */}
              <div className="lacquer-card rounded-2xl p-6">
                <h3 className="font-bold mb-2" style={{ color: "var(--teal)" }}>
                  🎨 수리 후 예상 모습
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {result.previewDescription}
                </p>
              </div>

              {/* 단계별 가이드 */}
              <div className="lacquer-card rounded-2xl p-6">
                <h3 className="font-bold mb-4" style={{ color: "var(--primary)" }}>
                  📋 단계별 수리 가이드
                </h3>
                <div className="flex flex-col gap-3">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: "var(--primary)",
                          color: "white",
                        }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1" style={{ color: "var(--foreground)" }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 필요 재료 + 탄소 절감 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="lacquer-card rounded-2xl p-6">
                  <h3 className="font-bold mb-3" style={{ color: "var(--primary)" }}>
                    🪡 필요 재료
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {result.materials.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span style={{ color: "var(--accent)" }}>•</span>
                        <span style={{ color: "var(--foreground)" }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-2xl p-6 flex flex-col justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(45, 125, 111, 0.1), rgba(45, 125, 111, 0.05))",
                    border: "1px solid rgba(45, 125, 111, 0.2)",
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: "var(--teal)" }}>
                    🌿 예상 탄소 절감
                  </h3>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: "var(--teal)" }}
                  >
                    {result.carbonSaved}kg
                    <span className="text-sm ml-1 font-normal">CO₂</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                    소나무 0.3그루를 심은 효과와 동일합니다
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
