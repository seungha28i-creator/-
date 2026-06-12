'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, MessageCircle, Apple } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  
  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. 일반 수동 로그인 제출 핸들러
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // 메인 홈 화면으로 리다이렉트
        window.location.href = '/';
      }
    } catch (error: any) {
      setErrorMsg('이메일 혹은 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 2. 💡 진짜 구글 창 디자인의 팝업을 띄우고 부모-자식 창 간 실시간 데이터 통신을 가동하는 마스터 함수
  const handleGoogleSocialLogin = () => {
    setLoading(true);
    setErrorMsg('');

    // 계정 선택창 팝업의 위치 중앙 계산
    const width = 460;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 새 창으로 구글 시뮬레이션 브라우저 창 팝업 가동
    const googlePopup = window.open(
      '',
      'GoogleSignIn',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
    );

    if (googlePopup) {
      // 팝업창 내부에 구글 소셜 계정 선택창 디자인과 똑같이 구현된 가상 HTML/CSS 인터페이스를 즉석에서 렌더링 주입합니다.
      googlePopup.document.write(`
        <html>
          <head>
            <title>Google 계정으로 로그인</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-[#F8F9FA] font-sans antialiased flex flex-col justify-between min-h-screen p-8 select-none">
            <div class="max-w-md mx-auto w-full space-y-6 pt-4">
              <!-- 구글 대형 컬러 로고 -->
              <div class="flex justify-center">
                <svg class="h-8 w-auto" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c2.477 0 4.544 1.535 5.352 3.693l3.967-3.076C21.134 3.731 17.854 1.5 13.99 1.5a10.49 10.49 0 0 0-10.49 10.49 10.49 10.49 0 0 0 10.49 10.49c5.733 0 10.536-4.14 10.536-10.49 0-.6-.054-1.18-.152-1.71H12.24Z"/>
                </svg>
              </div>
              
              <div class="text-center space-y-2">
                <h1 class="text-2xl font-normal text-[#202124]">계정 선택</h1>
                <p class="text-sm text-[#5f6368]"><span class="text-[#5C8D89] font-bold">온새미로</span>(으)로 이동</p>
              </div>

              <!-- 이메일 프로필 카드 (실제 이메일 정보 변경 가능) -->
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
                <div id="google-profile-card" class="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-all active:bg-gray-100">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center shadow-inner">
                    G
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">seungha28i@gmail.com</p>
                    <p class="text-xs text-[#5C8D89] font-medium">구글 계정 연결 가능</p>
                  </div>
                </div>

                <div class="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer opacity-60">
                  <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    ＋
                  </div>
                  <p class="text-sm font-medium text-gray-600">다른 계정 사용</p>
                </div>
              </div>

              <p class="text-xs text-[#5f6368] leading-relaxed">
                계속 진행하면 Google이 사용자의 이름, 이메일 주소, 프로필 사진을 온새미로 플랫폼과 안전하게 공유하는 데 동의하게 됩니다.
              </p>
            </div>

            <footer class="text-xs text-gray-400 flex justify-between border-t border-gray-100 pt-4">
              <span>한국어</span>
              <div class="space-x-3">
                <a href="#" class="hover:underline">도움말</a>
                <a href="#" class="hover:underline">개인정보처리방침</a>
              </div>
            </footer>

            <script>
              // 계정 카드를 누르면 부모창(React 프론트엔드)으로 실제 인증 신호를 쏘고 창을 닫습니다.
              document.getElementById('google-profile-card').addEventListener('click', () => {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  email: 'seungha28i@gmail.com', // 💡 본인의 실제 구글 계정으로 변경하시면 됩니다!
                  name: '3421이승하'
                }, '*');
                window.close();
              });
            </script>
          </body>
        </html>
      `);

      // 팝업창에서 마우스 이벤트가 감지되었을 때 작동할 비동기 리스너 정의
      const receiveMessage = async (event: MessageEvent) => {
        if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          try {
            // 💡 백엔드 Node.js 서버의 실시간 구글 전용 소셜인증 API를 정밀 찌름!
            const res = await axios.post(`${API_BASE_URL}/auth/google`, {
              email: event.data.email,
              name: event.data.name
            });

            if (res.data.success) {
              // 백엔드가 확인한 진짜 세션 데이터를 저장하고 홈 화면으로 리다이렉트
              localStorage.setItem('user', JSON.stringify(res.data.user));
              window.location.href = '/';
            }
          } catch (err) {
            console.error(err);
            setErrorMsg('소셜 로그인 인증 도중 백엔드 통신 에러가 감지되었습니다.');
          } finally {
            setLoading(false);
            window.removeEventListener('message', receiveMessage);
          }
        }
      };

      window.addEventListener('message', receiveMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center p-6 text-[#2C3639]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        
        {/* 상단 타이틀 로고 */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#5C8D89] flex items-center justify-center text-white mx-auto shadow-md">
            <Leaf size={24} className="fill-current text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl font-bold font-serif text-[#1D3330] tracking-tight mt-3">온새미로</h2>
          <p className="text-sm text-gray-400">다시, 가치를 잇는 전통 수리 플랫폼</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-100">
            <span>⚠️</span>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* 일반 타이핑 로그인 폼 */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400">이메일 주소</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C8D89] text-gray-700 font-semibold"
              placeholder="name@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400">비밀번호</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C8D89] text-gray-700 font-semibold"
              placeholder="******"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C8D89] hover:bg-[#4d7874] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold shadow-md transition-all text-sm mt-2 flex items-center justify-center gap-2"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-gray-400 my-4">
          <div className="flex-1 h-[1px] bg-gray-100" />
          <span>간편 소셜 연동</span>
          <div className="flex-1 h-[1px] bg-gray-100" />
        </div>

        {/* 간편 로그인 제어 영역 */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            type="button"
            onClick={() => alert('카카오 로그인은 본선 시연 준비 중입니다. 오른쪽 구글 이메일 연동을 이용해 주세요!')} 
            className="p-3 bg-[#FEE500] text-[#3C1E1E] rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-all"
          >
            <MessageCircle size={14} fill="currentColor" /> 카카오
          </button>
          <button 
            type="button"
            onClick={() => alert('Apple 로그인은 본선 시연 준비 중입니다. 오른쪽 구글 이메일 연동을 이용해 주세요!')} 
            className="p-3 bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-all"
          >
            <Apple size={14} fill="currentColor" /> Apple
          </button>
          
          {/* 🔥 팝업창 연동 및 실시간 백엔드 수신까지 완벽히 물리는 메일 버튼 */}
          <button 
            type="button"
            onClick={handleGoogleSocialLogin} 
            className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            <Mail size={14} className="text-[#EA4335]" /> 이메일
          </button>
        </div>
      </div>
    </div>
  );
}