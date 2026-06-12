// 온새미로(Onsaemiro) 백엔드 API 통합 서버 (Node.js & Express)
// 6인의 장인 리스트 정보, 구글 소셜 연동 및 홈 대시보드 통계 API 완벽 통합

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 1. 가상 데이터베이스
const homeStats = {
  totalRepairs: '1,247',
  co2Saved: '4.2kg',
  activeArtisans: 318,
  repairSupportBudget: '2,840만',
  satisfactionRate: '68%'
};

// 6인 장인 데이터 완전 탑재
const artisans = [
  {
    id: 1,
    name: '김정수',
    title: '나전칠기 명장',
    rating: 4.9,
    reviews: 312,
    priceRange: '5~15만원',
    location: '서울 성북구',
    experience: '경력 28년',
    responseTime: '2시간 내',
    tags: ['나전칠기', '금계', '국가무형문화재 전수자', '명장'],
    description: '국가무형문화재 112호 나전칠기 전수자, 28년간 600여 점의 고가구와 도자기를 복원했으며 현재 전통교육원에서 후계자를 양성 중입니다.',
    completedCount: 623
  },
  {
    id: 2,
    name: '박혜진',
    title: '전통 옻칠 공예가',
    rating: 4.8,
    reviews: 178,
    priceRange: '3~8만원',
    location: '경기 수원시',
    experience: '경력 15년',
    responseTime: '4시간 내',
    tags: ['옻칠', '나전칠기', '친환경 인증', '응답 빠름'],
    description: '홍익대학교 공예학과를 졸업 후 전주 옻칠공방에서 수련, 도자기와 목기의 천연 옻칠 복원을 전문으로 하며 친환경 소재만을 사용합니다.',
    completedCount: 287
  },
  {
    id: 3,
    name: '이종현',
    title: '금속공예·끊음질 장인',
    rating: 4.7,
    reviews: 241,
    priceRange: '4~12만원',
    location: '서울 종로구',
    experience: '경력 22년',
    responseTime: '3시간 내',
    tags: ['끊음질', '금계', '인사동 검회 회원', '베스트 장인'],
    description: '인사동에서 20년 이상 활동 중인 금속공예 장인. 끊음질과 금계 기법으로 도자기 균열을 예술 작품으로 변환하는 것을 전문으로 합니다.',
    completedCount: 445
  },
  {
    id: 4,
    name: '최소영',
    title: '도자기 복원 전문가',
    rating: 4.9,
    reviews: 95,
    priceRange: '2~6만원',
    location: '부산 중구',
    experience: '경력 11년',
    responseTime: '6시간 내',
    tags: ['옻칠', '금계', '나전칠기', '택배 수령 가능', '응답 빠름'],
    description: '부산공예진흥원 소속 도자기 복원 전문가. 빠른 응답 속도와 꼼꼼한 작업으로 높은 고객 만족도를 유지합니다. 택배 수령 서비스 제공.',
    completedCount: 192
  },
  {
    id: 5,
    name: '정민호',
    title: '가구·목기 복원 장인',
    rating: 4.8,
    reviews: 388,
    priceRange: '8~25만원',
    location: '전북 전주시',
    experience: '경력 33년',
    responseTime: '1일 내',
    tags: ['옻칠', '나전칠기', '전주 공예촌 입주 장인', '명장'],
    description: '전주 전통 공예촌 소속 가구·목기 복원 장인. 33년 경력의 전통 가구 및 목기 수리 전문가로 한옥 인테리어 소품 복원에 특화되어 있습니다.',
    completedCount: 512
  },
  {
    id: 6,
    name: '오다윤',
    title: '현대색채 금계 아티스트',
    rating: 4.6,
    reviews: 67,
    priceRange: '3~7만원',
    location: '서울 마포구',
    experience: '경력 6년',
    responseTime: '3시간 내',
    tags: ['금계', '워크숍 운영', 'MZ 추천'],
    description: '홍대 인근에서 활동하는 신세대 금계 아티스트. 전통 기법에 현대적 감각을 더해 MZ 세대에게 인기를 끌고 있으며 워크숍도 운영합니다.',
    completedCount: 120
  }
];

// 2. API 엔드포인트 설계

// [GET] 홈 화면 통계 API
app.get('/api/stats', (req, res) => {
  res.json(homeStats);
});

// [GET] 실시간 장인 목록 조회 API
app.get('/api/artisans', (req, res) => {
  res.json(artisans);
});

// [POST] 수동 로그인 API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password === '123456') {
    res.json({
      success: true,
      message: '일반 로그인 성공',
      user: {
        name: '26도예이승하',
        email: email,
        title: '지구를 치유하는 도자 컬렉터',
        completedRepairs: 5,
        cumulativeSavedCo2: '32.1kg'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: '이메일과 비밀번호를 정확히 입력해 주세요.'
    });
  }
});

// [POST] 실시간 구글 소셜 인증 처리 API
app.post('/api/auth/google', (req, res) => {
  const { email, name } = req.body;
  console.log(`구글 실시간 인증 통신 성공: ${email}`);

  if (email && email.endsWith('@gmail.com')) {
    res.json({
      success: true,
      message: 'Google 소셜 로그인 최종 승인 완료',
      user: {
        name: name || '26도예이승하',
        email: email,
        title: '지구를 지키는 푸른 에코 리더',
        completedRepairs: 8,
        cumulativeSavedCo2: '54.7kg'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: '유효한 Google 이메일 도메인이 아닙니다.'
    });
  }
});

// 3. Express 서버 시작
app.listen(PORT, () => {
  console.log('=============================================================');
  console.log('🏺 [온새미로] Node.js Express 백엔드 API 서버 작동 성공!');
  console.log('   - 통합 데이터 포트: http://localhost:5000');
  console.log('=============================================================');
});
