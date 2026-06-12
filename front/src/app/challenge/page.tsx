'use client';

import React, { useState, useRef } from 'react';
import {
  Trophy, Sparkles, Star, CheckCircle, Upload, X,
  Flame, Zap, Award, Camera
} from 'lucide-react';

// 인라인 SVG 아이콘 (lucide-react에 없는 아이콘 안전 처리)
const ShieldCheckIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const GiftIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

interface Challenge {
  id: number;
  title: string;
  desc: string;
  category: string;
  categoryColor: string;
  reward: number;
  icon: string;
  difficulty: '쉬움' | '보통' | '어려움';
  completed: boolean;
}

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: '나전 기법 인증',
    desc: '조개껍데기나 자개를 활용해 기물 표면에 나전 장식을 복원한 사진을 업로드하세요.',
    category: '나전칠기',
    categoryColor: 'bg-teal-100 text-teal-700',
    reward: 250,
    icon: '🐚',
    difficulty: '보통',
    completed: false,
  },
  {
    id: 2,
    title: '금계 기법 인증',
    desc: '균열이 생긴 도자기나 기물을 금분으로 이어 붙이는 금계(金繼) 복원 과정을 인증해 주세요.',
    category: '금계·킨츠기',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    reward: 350,
    icon: '🏺',
    difficulty: '어려움',
    completed: false,
  },
  {
    id: 3,
    title: '옻칠 복원 인증',
    desc: '전통 옻칠 기법으로 목기·가구·공예품 표면을 복원한 전후 사진을 올려주세요.',
    category: '옻칠',
    categoryColor: 'bg-red-100 text-red-700',
    reward: 300,
    icon: '🪵',
    difficulty: '어려움',
    completed: false,
  },
  {
    id: 4,
    title: '도자기 수복 인증',
    desc: '깨지거나 이가 나간 도자기를 전통 재료로 수복한 모습을 사진으로 인증하세요.',
    category: '도자',
    categoryColor: 'bg-orange-100 text-orange-700',
    reward: 200,
    icon: '🫙',
    difficulty: '보통',
    completed: false,
  },
  {
    id: 5,
    title: '한지 복원 인증',
    desc: '훼손된 서화·고문서·공예품을 한지로 배접하거나 보수한 사진을 업로드해 주세요.',
    category: '한지',
    categoryColor: 'bg-lime-100 text-lime-700',
    reward: 150,
    icon: '📜',
    difficulty: '쉬움',
    completed: false,
  },
  {
    id: 6,
    title: '전통 매듭 수선 인증',
    desc: '노리개·장신구·복식 등에 사용된 전통 매듭을 수선하거나 복원한 과정을 인증해 주세요.',
    category: '매듭',
    categoryColor: 'bg-purple-100 text-purple-700',
    reward: 130,
    icon: '🪢',
    difficulty: '쉬움',
    completed: false,
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  쉬움: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  보통: 'text-amber-600 bg-amber-50 border-amber-200',
  어려움: 'text-red-600 bg-red-50 border-red-200',
};

export default function ChallengePage() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justCompleted, setJustCompleted] = useState<number | null>(null);
  const [pointsAnimation, setPointsAnimation] = useState<{ value: number; key: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalReward = challenges.reduce((s, c) => s + c.reward, 0);

  const openModal = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setActiveChallenge(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!uploadedFile || !activeChallenge) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const earned = activeChallenge.reward;
      setTotalPoints(prev => prev + earned);
      setChallenges(prev =>
        prev.map(c => c.id === activeChallenge.id ? { ...c, completed: true } : c)
      );
      setJustCompleted(activeChallenge.id);
      setPointsAnimation({ value: earned, key: Date.now() });

      setTimeout(() => setJustCompleted(null), 2500);
      setTimeout(() => setPointsAnimation(null), 1800);

      closeModal();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#2C3639] pb-16 font-sans">
      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">

        {/* 히어로 포인트 카드 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3330] via-[#2D5A52] to-[#5C8D89] p-8 text-white shadow-2xl">
          {/* 배경 장식 원 */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-[#D4AF37]/10" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D4AF37]/80 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={14} className="animate-pulse" />
                <span>수리 챌린지 보상 포인트</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black tracking-tight tabular-nums">
                  {totalPoints.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-white/60 mb-2">P</span>
              </div>
              <p className="text-white/50 text-xs font-semibold">
                챌린지를 완료할 때마다 포인트가 자동으로 적립됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 text-center">
                <span className="text-2xl font-black block">{completedCount} / {challenges.length}</span>
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">완료한 챌린지</span>
              </div>
              <div className="bg-[#D4AF37]/20 rounded-2xl px-5 py-4 border border-[#D4AF37]/30 text-center">
                <span className="text-xl font-black text-[#D4AF37] block">{totalReward.toLocaleString()} P</span>
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">획득 가능 총 포인트</span>
              </div>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="relative z-10 mt-6 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-white/50">
              <span>전체 챌린지 진행률</span>
              <span>{Math.round((completedCount / challenges.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / challenges.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 포인트 획득 플로팅 애니메이션 */}
        {pointsAnimation && (
          <div
            key={pointsAnimation.key}
            className="fixed top-24 right-8 z-50 pointer-events-none animate-bounce"
            style={{ animation: 'floatUp 1.8s ease-out forwards' }}
          >
            <div className="bg-[#D4AF37] text-white font-black text-xl px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
              <Zap size={20} />
              +{pointsAnimation.value} P
            </div>
          </div>
        )}

        {/* 챌린지 목록 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-xl text-[#1D3330]">수리 인증 챌린지</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                justCompleted={justCompleted === challenge.id}
                onVerify={() => openModal(challenge)}
              />
            ))}
          </div>
        </div>

        {/* 포인트 혜택 안내 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-5">
            <GiftIcon className="text-[#D4AF37] w-5 h-5" />
            <h3 className="font-serif font-bold text-lg text-gray-800">포인트 혜택 안내</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { threshold: '500 P', reward: '온새미로 굿즈 할인 쿠폰', icon: '🎁' },
              { threshold: '1,000 P', reward: '장인 매칭 우선권 1회', icon: '🏆' },
              { threshold: '2,000 P', reward: '전통 재료 구매 적립금', icon: '🌿' },
            ].map(item => (
              <div key={item.threshold} className="p-4 bg-[#F4F3EF] rounded-2xl border border-gray-100 flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <span className="font-black text-[#5C8D89] text-sm block">{item.threshold}</span>
                  <span className="text-[11px] text-gray-500 font-medium">{item.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 사진 업로드 모달 */}
      {activeChallenge && (
        <UploadModal
          challenge={activeChallenge}
          uploadedFile={uploadedFile}
          previewUrl={previewUrl}
          isSubmitting={isSubmitting}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      <style jsx global>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          60% { opacity: 1; transform: translateY(-40px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.9); }
        }
        @keyframes completePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .challenge-complete-anim {
          animation: completePop 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// ── 챌린지 카드 컴포넌트 ──────────────────────────────────────────────────────
function ChallengeCard({
  challenge,
  justCompleted,
  onVerify,
}: {
  challenge: Challenge;
  justCompleted: boolean;
  onVerify: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-3xl border p-6 shadow-sm transition-all duration-300 flex flex-col gap-4 ${
        justCompleted ? 'border-[#5C8D89] challenge-complete-anim shadow-md' : 'border-gray-100 hover:shadow-md hover:scale-[1.005]'
      } ${challenge.completed ? 'opacity-80' : ''}`}
    >
      {/* 상단: 아이콘 + 카테고리 + 난이도 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 ${challenge.completed ? 'bg-[#5C8D89]/10' : 'bg-gray-50'}`}>
            {challenge.completed ? '✅' : challenge.icon}
          </div>
          <div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${challenge.categoryColor}`}>
              {challenge.category}
            </span>
            <h3 className="font-bold text-sm text-gray-800 mt-0.5">{challenge.title}</h3>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold border ${DIFFICULTY_COLOR[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>

      {/* 설명 */}
      <p className="text-[12px] text-gray-400 font-medium leading-relaxed">{challenge.desc}</p>

      {/* 하단: 포인트 + 버튼 */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <Star size={14} className="text-[#D4AF37]" />
          <span className="font-black text-[#D4AF37] text-sm">+{challenge.reward} P</span>
        </div>

        {challenge.completed ? (
          <div className="flex items-center gap-1.5 text-[#5C8D89] font-bold text-xs px-4 py-2 bg-[#5C8D89]/10 rounded-xl">
            <CheckCircle size={14} />
            <span>인증 완료</span>
          </div>
        ) : (
          <button
            onClick={onVerify}
            className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #5C8D89, #1D3330)' }}
          >
            <Camera size={13} />
            인증하기
          </button>
        )}
      </div>
    </div>
  );
}

// ── 업로드 모달 컴포넌트 ──────────────────────────────────────────────────────
function UploadModal({
  challenge,
  uploadedFile,
  previewUrl,
  isSubmitting,
  fileInputRef,
  onFileChange,
  onSubmit,
  onClose,
}: {
  challenge: Challenge;
  uploadedFile: File | null;
  previewUrl: string | null;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">

        {/* 모달 헤더 */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="text-[#5C8D89] w-5 h-5" />
            <span className="font-bold text-sm text-gray-800">수리 인증하기</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>

        {/* 챌린지 정보 */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center gap-3 p-4 bg-[#F4F3EF] rounded-2xl border border-gray-100">
            <span className="text-3xl">{challenge.icon}</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{challenge.title}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="text-[#D4AF37]" />
                <span className="text-xs font-black text-[#D4AF37]">+{challenge.reward} P 획득</span>
              </div>
            </div>
          </div>
        </div>

        {/* 사진 업로드 영역 */}
        <div className="px-6 py-4 space-y-3">
          <span className="text-xs font-bold text-gray-500">수리 전·후 사진 업로드</span>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              previewUrl
                ? 'border-[#5C8D89] bg-[#5C8D89]/5 p-3'
                : 'border-gray-200 bg-gray-50 hover:border-[#5C8D89] hover:bg-[#5C8D89]/5 py-10'
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="업로드 미리보기"
                className="w-full max-h-52 object-cover rounded-xl"
              />
            ) : (
              <>
                <Upload size={28} className="text-gray-300" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400">클릭하여 사진 선택</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">JPG, PNG, HEIC 지원</p>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          {uploadedFile && (
            <p className="text-[11px] text-[#5C8D89] font-semibold flex items-center gap-1">
              <CheckCircle size={12} />
              {uploadedFile.name}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={onSubmit}
            disabled={!uploadedFile || isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #5C8D89, #1D3330)' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                인증 처리 중...
              </>
            ) : (
              <>
                <Award size={16} />
                인증 완료 및 {challenge.reward}P 획득
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
