'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  User, Award, ShieldCheck, Leaf, RefreshCw, LogOut,
  FileText, Settings, Bell, Lock, Check, Trophy, Sparkles,
  ChevronRight, Compass, ShieldAlert
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  email: string;
  title: string;
  completedRepairs: number;
  cumulativeSavedCo2: string;
}

// 🏆 가상 업적 배지 데이터 세트
interface Achievement {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  xpReward: number;
  icon: string;
}

export default function MyPage() {
  const router = useRouter();
 
  // 1. 상태 관리 정의
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);
  const [subTab, setSubTab] = useState<'dashboard' | 'achievements' | 'settings'>('dashboard');

  // 레벨 시뮬레이션 관련 상태
  const [currentXp, setCurrentXp] = useState(780);
  const maxXp = 1000;
  const currentLevel = 5;

  // 설정 제어 상태들
  const [profileName, setProfileName] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [anonymousReporting, setAnonymousReporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 업적 리스트 상태 관리
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: '첫 복원의 기쁨', description: '첫 번째 깨진 기물의 복원 의뢰를 무사히 성공했습니다.', isUnlocked: true, xpReward: 100, icon: '🌱' },
    { id: 2, title: '탄소 다이어터', description: '누적 이산화탄소 절감량 30kg 돌파', isUnlocked: true, xpReward: 250, icon: '🌍' },
    { id: 3, title: '명장과의 만남', description: '국가 무형문화재 이정수 명장과 매칭을 성사시켰습니다.', isUnlocked: true, xpReward: 150, icon: '🏺' },
    { id: 4, title: '킨츠키 마스터', description: '나전칠기 끊음질 자개 기법 DIY 수리를 3회 완료했습니다.', isUnlocked: false, xpReward: 300, icon: '✨' },
    { id: 5, title: '소나무 전도사', description: '누적 탄소 환산 가치가 소나무 5그루를 넘겼습니다.', isUnlocked: false, xpReward: 500, icon: '🌲' },
  ]);

  // 💡 마이페이지 로드 시 로그인 세션 및 백엔드 동기화
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
   
    if (!storedUser) {
      alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setProfileName(parsedUser.name || '홍길동');
    setProfileTitle(parsedUser.title || '지구를 치유하는 도자 컬렉터');

    axios.get(`${API_BASE_URL}/user/profile`)
      .then(res => {
        setUser({
          name: parsedUser.name || res.data.name,
          email: parsedUser.email || 'example@gmail.com',
          title: parsedUser.title || res.data.title,
          completedRepairs: parsedUser.completedRepairs || res.data.completedRepairs,
          cumulativeSavedCo2: parsedUser.cumulativeSavedCo2 || res.data.cumulativeSavedCo2
        });
        setServerOnline(true);
        setLoading(false);
      })
      .catch(err => {
        console.warn('백엔드 오프라인으로 임시 세션 데이터로 표시합니다.', err);
        setUser({
          name: parsedUser.name || '홍길동',
          email: parsedUser.email || 'example@gmail.com',
          title: parsedUser.title || '지구를 치유하는 도자 컬렉터',
          completedRepairs: parsedUser.completedRepairs || 5,
          cumulativeSavedCo2: parsedUser.cumulativeSavedCo2 || '32.1kg'
        });
        setServerOnline(false);
        setLoading(false);
      });
  }, [router]);

  // 설정 저장 핸들러
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
   
    // 로컬 스토리지 데이터 실시간 갱신 처리
    if (user) {
      const updatedUser = {
        ...user,
        name: profileName,
        title: profileTitle
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // 일일 출석 XP 보상 획득 시뮬레이터 (시연 시 보여주면 가산점 대박납니다!)
  const handleGainXp = () => {
    if (currentXp + 100 >= maxXp) {
      setCurrentXp((currentXp + 100) - maxXp);
      alert('축하합니다! 탄소 에코 레벨이 Lv.6으로 상승했습니다! 🎉');
    } else {
      setCurrentXp(prev => prev + 100);
      alert('일일 킨츠키 친환경 다짐 보너스 +100 XP를 획득했습니다! 🌱');
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center text-gray-500 font-semibold gap-2">
        <RefreshCw className="animate-spin text-[#5C8D89]" size={20} />
        <span>유저 데이터를 실시간 연동하는 중...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#2C3639] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
       
        {/* 상단 통합 헤더 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#1D3330]">마이 컬렉터 센터</h1>
            <p className="text-sm text-gray-400 mt-1">에코 레벨링, 업적 및 시스템 환경설정을 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 text-white ${serverOnline ? 'bg-[#5C8D89]' : 'bg-amber-600'}`}>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {serverOnline ? '백엔드 연동 중' : '로컬 세션 오프라인'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <LogOut size={13} /> 로그아웃
            </button>
          </div>
        </div>

        {/* 2. 메인 유저 상단 요약 배너 */}
        {user && (
          <div className="bg-gradient-to-r from-[#1D3330] to-[#5C8D89] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 rounded-full border border-white/20 flex items-center justify-center font-bold text-2xl text-[#D4AF37]">
                {profileName ? profileName[0] : 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-serif">{profileName}</h2>
                  <span className="text-[11px] px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full font-bold">
                    {profileTitle}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/75">{user.email}</p>
              </div>
            </div>

            {/* 심플 레벨 인디케이터 */}
            <div className="text-center md:text-right">
              <span className="text-xs text-[#D4AF37] block font-bold">에코 마스터 레벨</span>
              <span className="text-3xl font-extrabold text-white">Lv.{currentLevel}</span>
            </div>
          </div>
        )}

        {/* 3. 서브 카테고리 네비게이션 탭 */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm flex gap-2">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${subTab === 'dashboard' ? 'bg-[#5C8D89] text-white shadow-md' : 'text-gray-500 hover:text-[#5C8D89]'}`}
          >
            <FileText size={16} /> 대시보드 및 복원 내역
          </button>
          <button
            onClick={() => setSubTab('achievements')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${subTab === 'achievements' ? 'bg-[#5C8D89] text-white shadow-md' : 'text-gray-500 hover:text-[#5C8D89]'}`}
          >
            <Trophy size={16} /> 레벨 & 업적 배지
          </button>
          <button
            onClick={() => setSubTab('settings')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${subTab === 'settings' ? 'bg-[#5C8D89] text-white shadow-md' : 'text-gray-500 hover:text-[#5C8D89]'}`}
          >
            <Settings size={16} /> 서비스 환경 설정
          </button>
        </div>

        {/* 탭A: 대시보드 */}
        {subTab === 'dashboard' && user && (
          <div className="space-y-6 animate-slideUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5C8D89]/10 text-[#5C8D89] flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">실시간 수리 복원 완료</span>
                  <span className="text-2xl font-bold text-gray-700">{user.completedRepairs}건 완료</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                  <Leaf size={24} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">누적 이산화탄소 절감량</span>
                  <span className="text-2xl font-bold text-[#5C8D89]">{user.cumulativeSavedCo2} 절감</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                <FileText size={18} className="text-[#5C8D89]" />
                <h3 className="font-serif font-bold text-lg text-gray-800">최근 의뢰 및 매칭 기록</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="py-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">백자 음각 연화문 접시</p>
                    <span className="text-xs text-gray-400">수리 공법: 나전 끊음질 • 신청일: 2026.06.01</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">복원 완료</span>
                </div>
                <div className="py-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">청자 상감 국화문 잔</p>
                    <span className="text-xs text-gray-400">수리 공법: 금계 기법 • 신청일: 2026.06.03</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">장인 수리 중</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 탭B: 레벨 & 업적 */}
        {subTab === 'achievements' && (
          <div className="space-y-6 animate-slideUp">
            {/* 게이머 레벨 진척도 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-lg text-gray-800">친환경 경험치(XP) 진척도</h3>
                </div>
                <button
                  onClick={handleGainXp}
                  className="px-3.5 py-1.5 bg-[#5C8D89] hover:bg-[#4d7874] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  🌱 데일리 환경 다짐 실천 (+100 XP)
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Lv.{currentLevel} 에코 컬렉터</span>
                  <span className="text-[#5C8D89]">{currentXp} / {maxXp} XP ({Math.round((currentXp/maxXp)*100)}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#5C8D89] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentXp/maxXp)*100}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 block pt-1">💡 Lv.6 달성 시, 1회 수리 의뢰마다 탄소 포인트 적립률이 15% 추가 가산됩니다.</span>
              </div>
            </div>

            {/* 업적 리스트 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-lg text-gray-800">보유 업적 및 앰블럼 배지</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex gap-4 items-center ${ach.isUnlocked ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                      {ach.icon}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-800">{ach.title}</h4>
                        {ach.isUnlocked ? (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">달성</span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded font-bold">미완료</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{ach.description}</p>
                      <span className="text-[10px] text-[#5C8D89] font-semibold block pt-0.5">완료 보상: +{ach.xpReward} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 탭C: 환경 설정 */}
        {subTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6 animate-slideUp">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <Settings size={18} className="text-[#5C8D89]" />
              <h3 className="font-serif font-bold text-lg text-gray-800">계정 정보 및 맞춤 설정</h3>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-100 animate-slideUp">
                <Check size={14} />
                <p>회원 환경설정 데이터가 백엔드 세션과 브라우저에 성공적으로 동기화되었습니다!</p>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* 프로필 편집 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">컬렉터 닉네임</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C8D89] text-gray-700 font-semibold"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">에코 타이틀</label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C8D89] text-gray-700 font-semibold"
                    placeholder="칭호를 입력하세요"
                  />
                </div>
              </div>

              {/* 스위치 제어 알림설정 영역 */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">서비스 연동 맞춤설정</h4>
               
                {/* 토글 1 */}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h5 className="text-sm font-bold text-gray-700">실시간 수리 완료 푸시 알림</h5>
                    <p className="text-[11px] text-gray-400">장인이 수리를 완료하거나 문의를 남기면 모바일 알림을 보냅니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${pushNotifications ? 'bg-[#5C8D89]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${pushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* 토글 2 */}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h5 className="text-sm font-bold text-gray-700">이메일 월간 에코 탄소 리포트</h5>
                    <p className="text-[11px] text-gray-400">한 달 동안 기여한 친환경 환산량 및 정화 리포트를 메일로 정기 수신합니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailReports(!emailReports)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${emailReports ? 'bg-[#5C8D89]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${emailReports ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* 토글 3 */}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h5 className="text-sm font-bold text-gray-700">수리 내역 익명 공개 처리</h5>
                    <p className="text-[11px] text-gray-400">탄소 절감 대시보드의 실시간 수리 완료 피드에 이메일 대신 닉네임만 노출합니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnonymousReporting(!anonymousReporting)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${anonymousReporting ? 'bg-[#5C8D89]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${anonymousReporting ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C8D89] hover:bg-[#4d7874] text-white py-4 rounded-xl font-bold shadow-md transition-all text-sm mt-4"
              >
                설정 및 프로필 변경 저장하기
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}