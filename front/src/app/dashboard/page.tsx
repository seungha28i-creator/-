'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Leaf, Trophy, Share2, Sparkles, TrendingUp, Award, Zap, 
  Flame, ArrowUpRight, Heart, Calendar, Copy, 
  Check, RefreshCw, Smile, Droplets, Sun, ChevronRight,
  Download, Plus, Settings2, Smartphone
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// 원본 사진과 100% 동일한 수치 및 통계 데이터 세팅
const initialCarbonStats = {
  efficiencyRate: '85.9%',
  myRepairCount: 109,
  myCo2Saved: '80.9kg',
  savedEnergy: '97kWh',
  savedCost: '2,507,000원',
  pineTrees: '5.8그루',
  carDistance: '372km',
  savedWater: '1,156L'
};

// 공유 카드에 붙일 수 있는 MZ 감성 스티커 타입 정의
interface Sticker {
  id: number;
  emoji: string;
  name: string;
  top: number;
  left: number;
}

// 💡 빌드 에러 방지를 위한 100% 안전한 커스텀 인라인 Instagram 아이콘 컴포넌트
const CustomInstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function CarbonDashboard() {
  const [stats, setStats] = useState(initialCarbonStats);
  const [serverOnline, setServerOnline] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 1. 🪴 에코 반려 식물 기르기 상태 관리 (계산기 대신 도입!)
  const [sproutLevel, setSproutLevel] = useState(3); // 레벨 3 단계 (80.9kg 절감 기준)
  const [gardenActionText, setGardenActionText] = useState('새싹이 무럭무럭 자라는 중입니다!');
  const [gardenXp, setGardenXp] = useState(809); // 80.9kg = 809 XP
  const [sproutStatus, setSproutStatus] = useState<'normal' | 'happy' | 'shiny'>('normal');

  // 2. 🎨 MZ 전용 커스텀 카드 스튜디오 상태 관리
  const [cardLayout, setCardLayout] = useState<'polaroid' | 'ticket' | 'story'>('polaroid');
  const [cardTheme, setCardTheme] = useState<'emerald' | 'sunset' | 'cyberpunk'>('emerald');
  const [cardStickers, setCardStickers] = useState<Sticker[]>([
    { id: 1, emoji: '🌱', name: '에코', top: 12, left: 15 },
    { id: 2, emoji: '✨', name: '킨츠키 골드', top: 58, left: 75 }
  ]);
  const [customCaption, setCustomCaption] = useState('지구를 힙하게 구하는 중 ✌️');

  // 3. 인스타 모의 시연 피드 팝업 제어
  const [showInstaMock, setShowInstaMock] = useState(false);
  const [instaLikes, setInstaLikes] = useState(109);
  const [isLiked, setIsLiked] = useState(false);

  // 4. 업적 뱃지 리스트 (원본 캡처 화면 속 6개 업적 100% 동일 매칭)
  const [badges] = useState([
    { id: 1, name: '첫 수리', desc: '첫 번째 물건 살리기 달성', date: '2025.02 달성', icon: '🌱', unlocked: true },
    { id: 2, name: '숲 지킴이', desc: '탄소 10kg 절감 달성', date: '2025.05 달성', icon: '🌲', unlocked: true },
    { id: 3, name: '변화의 시작', desc: '10개 물건 수리 달성', date: '2025.07 달성', icon: '🦋', unlocked: true },
    { id: 4, name: '장인의 손', desc: '30개 물건 수리 달성', date: '2025.10 달성', icon: '🏺', unlocked: true },
    { id: 5, name: '지구 수호자', desc: '탄소 50kg 절감 달성', date: '2026.01 달성', icon: '🌍', unlocked: true },
    { id: 6, name: '수리 명인', desc: '100개 물건 수리 달성', date: '진행중 (109/100)', icon: '👑', unlocked: true },
  ]);

  useEffect(() => {
    // 백엔드 Express 실시간 데이터 연동
    axios.get(`${API_BASE_URL}/carbon-stats`)
      .then(res => {
        setStats(res.data);
        setServerOnline(true);
      })
      .catch(err => {
        console.warn('백엔드 오프라인으로 로컬 대시보드 데이터를 출력합니다.', err);
        setServerOnline(false);
      });
  }, []);

  // 🪴 반려 식물 상호작용 액션
  const handleGardenAction = (action: 'water' | 'sun' | 'gold') => {
    setSproutStatus('happy');
    if (action === 'water') {
      setGardenActionText('꿀꺽... 생칠 옻나무 물을 먹고 새싹의 초록빛이 깊어졌습니다! 💧');
    } else if (action === 'sun') {
      setGardenActionText('화창한 햇살을 받아 광합성을 진행합니다! 광채가 납니다! ☀️');
    } else if (action === 'gold') {
      setSproutStatus('shiny');
      setGardenActionText('장인의 영롱한 금가루 샤워! 새싹에 찬란한 금빛 크랙이 피어납니다! ✨');
    }
    
    setTimeout(() => {
      setSproutStatus('normal');
    }, 2000);
  };

  // 🎨 스튜디오 스티커 추가 기능
  const addSticker = (emoji: string, name: string) => {
    if (cardStickers.length >= 6) {
      alert('스티커는 최대 6개까지만 부착할 수 있습니다!');
      return;
    }
    const newSticker: Sticker = {
      id: Date.now(),
      emoji,
      name,
      top: Math.floor(Math.random() * 50) + 10,
      left: Math.floor(Math.random() * 60) + 10
    };
    setCardStickers([...cardStickers, newSticker]);
  };

  // 스티커 지우기
  const removeSticker = (id: number) => {
    setCardStickers(cardStickers.filter(s => s.id !== id));
  };

  // 카드 링크 복사
  const handleCopyShare = () => {
    setIsCopied(true);
    const shareText = `🏺 온새미로에서 나만의 힙한 전통 복원 '에코 카드'를 꾸몄어요!\n- 누적 탄소 절감: ${stats.myCo2Saved}\n- 구출한 추억: ${stats.myRepairCount}개\n\n함께 지구를 구하러 가볼까요? ➔ http://localhost:3000/dashboard`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 모의 인스타 좋아요 토글
  const handleLikeInsta = () => {
    if (isLiked) {
      setInstaLikes(prev => prev - 1);
    } else {
      setInstaLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#2C3639] pb-16 font-sans">
      
      {/* 상단 백엔드 연결 센서 */}
      <div className={`text-white text-xs py-2.5 px-6 flex justify-between items-center transition-all ${serverOnline ? 'bg-[#5C8D89]' : 'bg-amber-600'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-300 animate-pulse' : 'bg-red-200'}`} />
          <span className="font-semibold text-[11px] tracking-wide">
            {serverOnline ? '● ONSAEMIRO ECO-GRAPHIC ENGINE CONNECTED' : '▲ OFFLINE EMULATION MODE'}
          </span>
        </div>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">V1.2</span>
      </div>

      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* 히어로 환영 헤더 섹션 */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#5C8D89] font-extrabold text-xs uppercase tracking-wider">
              <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
              <span>Personalized Eco Scoreboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1D3330] font-serif tracking-tight">
              나의 수리 활동이 만든 변화
            </h1>
            <p className="text-gray-400 text-xs">
              물건을 버리는 대신 수리해서 재사용함으로써 절감된 탄소량과 환경적 기여를 한눈에 확인하세요.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#5C8D89]/10 px-5 py-3.5 rounded-2xl border border-[#5C8D89]/20">
            <Flame className="text-orange-500 animate-bounce" size={20} />
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">에코 연속 챌린지</span>
              <span className="text-base font-black text-[#5C8D89]">109일 연속 기록 달성</span>
            </div>
          </div>
        </div>

        {/* 📊 원본 캡처 이미지 속 4대 핵심 수치 대시보드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md">
            <span className="text-3xl block mb-2">🌿</span>
            <span className="text-2xl font-black text-[#5C8D89] block tracking-tight">{stats.myCo2Saved}</span>
            <span className="text-[11px] text-gray-400 block mt-1 font-semibold">절감 탄소 (누적)</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md">
            <span className="text-3xl block mb-2">🏺</span>
            <span className="text-2xl font-black text-gray-800 block tracking-tight">{stats.myRepairCount}개</span>
            <span className="text-[11px] text-gray-400 block mt-1 font-semibold">수리한 물건</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md">
            <span className="text-3xl block mb-2">🌲</span>
            <span className="text-2xl font-black text-emerald-600 block tracking-tight">{stats.pineTrees}</span>
            <span className="text-[11px] text-gray-400 block mt-1 font-semibold">나무 심기 효과</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md">
            <span className="text-3xl block mb-2">💰</span>
            <span className="text-2xl font-black text-[#D4AF37] block tracking-tight">{stats.savedCost}</span>
            <span className="text-[11px] text-gray-400 block mt-1 font-semibold">절약한 돈 (평균)</span>
          </div>
        </div>

        {/* 🌿 세부 탄소 환경 환산 지표 배너 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-100">
            <div className="space-y-1">
              <span className="text-2xl font-black text-gray-800 block">{stats.pineTrees}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">소나무를 심은 효과</p>
            </div>
            <div className="space-y-1 pt-0">
              <span className="text-2xl font-black text-gray-800 block">{stats.carDistance}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">자동차 운행 절감 거리</p>
            </div>
            <div className="space-y-1 pt-0">
              <span className="text-2xl font-black text-[#5C8D89] block">{stats.savedEnergy}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">전력 사용 절감량</p>
            </div>
            <div className="space-y-1 pt-0">
              <span className="text-2xl font-black text-[#D4AF37] block">{stats.savedWater}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">물 절약 효과</p>
            </div>
          </div>
        </div>

        {/* 🪴 [MZ 최애 타겟 1] 에코 반려 식물 키우기 미니 시뮬레이터 */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#5C8D89]/10 rounded-xl text-[#5C8D89]"><Leaf size={18} /></span>
              <h3 className="font-serif font-bold text-lg text-gray-800">나의 에코 가디언 나무</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              내가 수리한 물건이 많아질수록 반려 식물이 에코 에너지(XP)를 빨아들이며 성장합니다!<br />
              현재 나의 누적 탄소 절감량 **{stats.myCo2Saved}** 덕분에 희귀 등급인 **[황금 킨츠키 옻나무]**로 자라났습니다.
            </p>

            {/* 성장도 프로그레스 바 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>반려 식물 Lv.{sproutLevel}</span>
                <span className="text-[#5C8D89]">{gardenXp} / 1000 XP</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#5C8D89] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${(gardenXp/1000)*100}%` }}
                />
              </div>
            </div>

            {/* 반려식물 쓰다듬기 액션 패널 */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button 
                onClick={() => handleGardenAction('water')}
                className="py-2.5 bg-[#5C8D89]/5 hover:bg-[#5C8D89]/10 text-[#5C8D89] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Droplets size={14} /> 물 주기
              </button>
              <button 
                onClick={() => handleGardenAction('sun')}
                className="py-2.5 bg-amber-50 hover:bg-amber-100/70 text-amber-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Sun size={14} /> 햇살 주기
              </button>
              <button 
                onClick={() => handleGardenAction('gold')}
                className="py-2.5 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                ✨ 금가루 샤워
              </button>
            </div>
          </div>

          {/* 식물 가상 3D 픽셀 형태의 모션 카드 */}
          <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center relative overflow-hidden h-64 shadow-inner">
            <div className="absolute top-4 left-4 text-[10px] bg-white px-2.5 py-1 rounded-full text-gray-400 font-bold shadow-sm">
              에코 캐릭터룸
            </div>

            {/* 식물 그래픽 (반응형 상태) */}
            <div className={`transition-all duration-300 text-7xl select-none ${
              sproutStatus === 'happy' ? 'scale-125 rotate-3' : 
              sproutStatus === 'shiny' ? 'scale-125 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]' : 
              'scale-100'
            }`}>
              {sproutLevel === 3 ? '🌳' : '🌱'}
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-xs font-extrabold text-gray-700">{gardenActionText}</p>
              <span className="text-[10px] text-gray-400 block">마우스로 가속 버튼을 눌러 소통해 보세요!</span>
            </div>
          </div>
        </div>

        {/* 🎨 [MZ 최애 타겟 2] MZ 전용 힙스터 공유 포토카드 제작 스튜디오 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* 스튜디오 제작 컨트롤러 패널 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2">
                {/* 💡 임포트 에러가 완전히 안전 조치된 커스텀 인스타 SVG 아이콘 사용 */}
                <CustomInstagramIcon className="text-[#E1306C] w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-gray-800">에코 포토카드 스튜디오</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                내 에코 등급을 인스타 스토리에 바로 공유할 수 있도록 직접 스티커를 부착해 전용 굿즈를 꾸밀 수 있습니다.
              </p>
            </div>

            {/* 1. 레이아웃 선택 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-400">1. 스킨 레이아웃 선택</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'polaroid', label: '📸 폴라로이드' },
                  { id: 'ticket', label: '🎫 에코 티켓' },
                  { id: 'story', label: '📱 인스타 스토리' }
                ].map(lay => (
                  <button
                    key={lay.id}
                    onClick={() => setCardLayout(lay.id as any)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${cardLayout === lay.id ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                  >
                    {lay.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 테마 컬러 스킨 선택 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-400">2. 그라데이션 필터 테마</span>
              <div className="flex gap-2">
                {[
                  { id: 'emerald', label: '그린 에메랄드', color: 'bg-[#5C8D89]' },
                  { id: 'sunset', label: '차분한 노을빛', color: 'bg-gradient-to-r from-orange-400 to-[#D4AF37]' },
                  { id: 'cyberpunk', label: '사이버 힙 스타', color: 'bg-gradient-to-r from-pink-500 to-indigo-600' }
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setCardTheme(theme.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${cardTheme === theme.id ? 'border-[#5C8D89] bg-[#5C8D89]/5 text-[#5C8D89]' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 문구 커스텀 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-400">3. 내 한 줄 슬로건 기입</span>
              <input 
                type="text"
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                maxLength={25}
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5C8D89] font-semibold text-gray-700"
                placeholder="인스타에 올릴 한 줄 슬로건 입력..."
              />
            </div>

            {/* 4. 데코레이션 스티커 부착 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-400">4. 다이어리 꾸미기 스티커 톡! 부착</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: '🌎', name: '지구 수호' },
                  { emoji: '🌲', name: '소나무' },
                  { emoji: '✨', name: '반짝이' },
                  { emoji: '🔥', name: '열정' },
                  { emoji: '🏺', name: '도자기' },
                  { emoji: '🎖️', name: '에코 명장' },
                  { emoji: '🤍', name: 'MZ 하트' }
                ].map(st => (
                  <button
                    key={st.name}
                    onClick={() => addSticker(st.emoji, st.name)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>{st.emoji}</span>
                    <span className="text-[10px] text-gray-400">{st.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 액션 바 */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleCopyShare}
                className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>스토리 카드 복사</span>
              </button>
              <button 
                onClick={() => setShowInstaMock(true)}
                className="py-4 px-6 bg-[#5C8D89] hover:bg-[#4d7874] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
              >
                <Smartphone size={14} /> 인스타에 가상 업로드 시연
              </button>
            </div>
          </div>

          {/* 📱 공유용 포토카드 시각화 프리뷰 레이아웃 (스티커 제거 가능) */}
          <div className="flex justify-center items-center">
            <div className={`w-72 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-300 ${
              cardLayout === 'story' ? 'aspect-[9/16]' : 'aspect-[3/4]'
            } ${
              cardTheme === 'emerald' ? 'bg-[#1D3330]' : 
              cardTheme === 'sunset' ? 'bg-gradient-to-b from-[#EA8D8D] to-[#D4AF37]' : 
              'bg-gradient-to-tr from-fuchsia-800 via-purple-900 to-indigo-900'
            }`}>
              
              {/* 스티커들이 렌더링되는 가상 절대 캔버스 */}
              <div className="absolute inset-0 z-10 pointer-events-auto">
                {cardStickers.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => removeSticker(s.id)}
                    title="클릭 시 스티커가 제거됩니다"
                    style={{ top: `${s.top}%`, left: `${s.left}%` }}
                    className="absolute cursor-pointer text-2xl select-none hover:scale-125 transition-all p-1 hover:bg-white/10 rounded-xl"
                  >
                    {s.emoji}
                  </div>
                ))}
              </div>

              {/* 1. 폴라로이드 레이아웃 */}
              {cardLayout === 'polaroid' && (
                <div className="w-full h-full flex flex-col justify-between bg-white text-gray-800 p-4 rounded-2xl shadow-inner">
                  {/* 사진 박스 영역 */}
                  <div className={`w-full aspect-square rounded-xl p-6 text-white flex flex-col justify-between relative overflow-hidden ${
                    cardTheme === 'emerald' ? 'bg-[#5C8D89]' : 
                    cardTheme === 'sunset' ? 'bg-gradient-to-tr from-[#EA8D8D] to-[#D4AF37]' : 
                    'bg-gradient-to-tr from-pink-500 to-indigo-600'
                  }`}>
                    <span className="text-[9px] px-2 py-0.5 bg-white/20 rounded-full font-bold self-start z-20">ECO SHOT</span>
                    <div className="space-y-1 z-20">
                      <span className="text-3xl font-black block tracking-tight">{stats.myCo2Saved}</span>
                      <p className="text-[10px] text-white/80 font-bold">탄소 배출 억제 인증</p>
                    </div>
                  </div>
                  {/* 폴라로이드 하단 메시지 방명록 */}
                  <div className="pt-3 text-center space-y-1 z-20">
                    <p className="text-xs font-black tracking-tight text-[#1D3330]">{customCaption}</p>
                    <span className="text-[9px] text-gray-400 block">🌱 ONSAEMIRO REPAIR PLATFORM</span>
                  </div>
                </div>
              )}

              {/* 2. 에코 보딩패스 티켓 레이아웃 */}
              {cardLayout === 'ticket' && (
                <div className="w-full h-full flex flex-col justify-between relative">
                  <div className="flex justify-between items-center border-b border-white/20 pb-3 z-20">
                    <span className="text-[10px] font-black uppercase tracking-widest">ONSAEMIRO BOARDING PASS</span>
                    <span className="text-[9px] px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full font-bold">PASS No.109</span>
                  </div>

                  <div className="space-y-4 py-4 z-20">
                    <div>
                      <span className="text-[9px] text-white/60 block font-bold">SAVED CO2 REPORT</span>
                      <span className="text-3xl font-black tracking-tight text-[#D4AF37]">{stats.myCo2Saved}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-b border-white/10 py-3 text-[10px] font-bold text-white/80">
                      <div>
                        <span className="text-[8px] text-white/40 block">ITEMS RESCUED</span>
                        <span>{stats.myRepairCount}개 수리완료</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 block">TREE REPLACEMENT</span>
                        <span>소나무 {stats.pineTrees}그루</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/20 pt-3 z-20">
                    <p className="text-[10px] font-bold tracking-tight text-emerald-100">{customCaption}</p>
                    <span className="text-xs">🏺</span>
                  </div>
                  {/* 양옆 티켓 반원 홀 디자인 */}
                  <div className="absolute top-1/2 -left-8 w-4 h-8 bg-[#F4F3EF] rounded-r-full z-20" />
                  <div className="absolute top-1/2 -right-8 w-4 h-8 bg-[#F4F3EF] rounded-l-full z-20" />
                </div>
              )}

              {/* 3. 모던 인스타 스토리 세로 레이아웃 */}
              {cardLayout === 'story' && (
                <div className="w-full h-full flex flex-col justify-between z-20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-serif text-[#D4AF37]">온새미로 에코캠페인</span>
                    <span className="text-[9px] px-2 py-0.5 bg-white/10 rounded-full font-bold">STORY SCORE</span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[9px] text-white/40 block font-bold tracking-widest uppercase">My Carbon Reduction Report</span>
                    <div className="space-y-1">
                      <span className="text-4xl font-black block tracking-tight">{stats.myCo2Saved}</span>
                      <p className="text-xs text-white/80 font-bold leading-relaxed">{customCaption}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>수리한 물건</span>
                        <span>{stats.myRepairCount}개 완료</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span>소나무 정화 환산</span>
                        <span>{stats.pineTrees}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span>자동차 단축 거리</span>
                        <span>{stats.carDistance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/60 block font-semibold">지구를 다시 잇는 여정</span>
                      <span className="text-xs font-extrabold block">#온새미로 #지구치유</span>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold border border-white/20">
                      🏺
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* 🏆 [원본 일치 100%] 수리 업적 및 챌린지 성과 배지 센터 */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-lg text-gray-800">나의 수리 업적 및 엠블럼</h3>
              </div>
              <p className="text-xs text-gray-400">지구를 위한 복원 신청 이력과 탄소 절감 달성도에 따라 획득한 영광스러운 칭호입니다.</p>
            </div>
            
            {/* 다음 목표 게이지 */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center space-y-1 sm:text-right shrink-0">
              <span className="text-[10px] text-gray-400 block font-bold">다음 에코 배지 퀘스트 목표</span>
              <span className="text-sm font-extrabold text-gray-700">탄소 100kg 절감 달성까지 진행률 <span className="text-[#5C8D89]">162%</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center gap-4 hover:scale-[1.01] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                  {badge.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-gray-800">{badge.name}</h4>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">달성</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">{badge.desc}</p>
                  <span className="text-[9px] text-[#5C8D89] font-bold block mt-0.5">{badge.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 📱 [가상 인터랙션] 인스타그램 모의 피드 게시 팝업 모달 */}
      {showInstaMock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <span className="font-bold text-sm">인스타그램 모의 시연</span>
              <button 
                onClick={() => setShowInstaMock(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* 인스타 피드 바디 */}
            <div className="bg-white pb-6 space-y-4">
              <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5C8D89]/10 text-[#5C8D89] flex items-center justify-center font-bold text-sm">
                  G
                </div>
                <div>
                  <span className="font-bold text-xs block">example_gildong</span>
                  <span className="text-[9px] text-gray-400">Yongin-si, Gyeonggi-do</span>
                </div>
              </div>

              {/* 피드 게시물 사진 자리 */}
              <div className="flex justify-center bg-gray-50 p-4 border-t border-b border-gray-100">
                <div className={`w-64 rounded-2xl p-6 text-white flex flex-col justify-between aspect-[3/4] relative overflow-hidden shadow-md ${
                  cardTheme === 'emerald' ? 'bg-[#1D3330]' : 
                  cardTheme === 'sunset' ? 'bg-gradient-to-b from-[#EA8D8D] to-[#D4AF37]' : 
                  'bg-gradient-to-tr from-fuchsia-800 via-purple-900 to-indigo-900'
                }`}>
                  <div className="flex justify-between items-center z-20">
                    <span className="text-xs font-bold font-serif">온새미로</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-white/10 rounded-full font-bold">ECO</span>
                  </div>
                  <div className="space-y-2 z-20">
                    <span className="text-3xl font-black block tracking-tight">{stats.myCo2Saved}</span>
                    <p className="text-[11px] text-white/80 font-bold leading-relaxed">{customCaption}</p>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-3 z-20">
                    <span className="text-[9px] text-white/60 font-semibold block">#온새미로 #지구치유</span>
                    <span className="text-sm">🌱</span>
                  </div>
                </div>
              </div>

              {/* 하트 리액션 바 */}
              <div className="px-4 space-y-2">
                <div className="flex items-center gap-3">
                  <button onClick={handleLikeInsta} className="p-1 hover:bg-gray-100 rounded-full transition-all">
                    <Heart size={20} className={isLiked ? 'fill-current text-red-500' : 'text-gray-700'} />
                  </button>
                  <Share2 size={20} className="text-gray-700" />
                </div>
                <div className="text-xs font-bold">
                  좋아요 {instaLikes}개
                </div>
                <p className="text-xs text-gray-600">
                  <span className="font-bold mr-1.5">example_gildong</span>
                  지구 살리는 킨츠키 수리하고 이산화탄소 대폭 절감 성공! 🏺💚 같이 동참해요! #온새미로 #에코라이프
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// 가상의 X 컴포넌트 임포트 누락 방지용 헬퍼
function X({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
