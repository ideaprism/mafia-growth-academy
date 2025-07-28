import { User, Challenge, ChallengeCategory } from '@/types';
import { generateId } from './storage';

// 샘플 사용자 데이터
export const SAMPLE_USERS: User[] = [
  {
    id: generateId(),
    name: '재린',
    family: '광교 구락부',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: '창균',
    family: '광교 구락부',
    createdAt: '2024-01-16T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: '빅톨',
    family: '광교 구락부',
    createdAt: '2024-01-17T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: '재익',
    family: '광교 구락부',
    createdAt: '2024-01-18T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: 'SNY',
    family: '광교 구락부',
    createdAt: '2024-01-19T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: '지올',
    family: '광교 구락부',
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: generateId(),
    name: '지성',
    family: '광교 구락부',
    createdAt: '2024-01-21T00:00:00.000Z'
  }
];

// 각 사용자별 목표 달성률 (30-70% 범위)
const USER_PROGRESS = {
  '재린': { exercise: 5, writing: 4, work: 6, food: 3, fun: 2 }, // 71%, 57%, 86%, 43%, 67%
  '창균': { exercise: 3, writing: 5, work: 4, food: 5, fun: 1 }, // 43%, 71%, 57%, 71%, 33%
  '빅톨': { exercise: 6, writing: 3, work: 5, food: 4, fun: 2 }, // 86%, 43%, 71%, 57%, 67%
  '재익': { exercise: 4, writing: 6, work: 3, food: 6, fun: 2 }, // 57%, 86%, 43%, 86%, 67%
  'SNY': { exercise: 5, writing: 4, work: 6, food: 3, fun: 1 }, // 71%, 57%, 86%, 43%, 33%
  '지올': { exercise: 3, writing: 5, work: 4, food: 5, fun: 2 }, // 43%, 71%, 57%, 71%, 67%
  '지성': { exercise: 6, writing: 3, work: 5, food: 4, fun: 1 }  // 86%, 43%, 71%, 57%, 33%
};

// 실제적인 챌린지 콘텐츠 생성
const generateChallengeContent = (category: ChallengeCategory, index: number): string => {
  const contents = {
    exercise: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.instagram.com/p/example',
      'https://strava.com/activities/123456',
      'https://www.runkeeper.com/user/example/activity/123',
      'https://www.nike.com/running/example',
      'https://www.garmin.com/connect/activity/123',
      'https://www.fitbit.com/user/example/activity/123'
    ],
    writing: [
      'https://medium.com/@example/article-1',
      'https://velog.io/@example/post-1',
      'https://brunch.co.kr/@example/123',
      'https://www.notion.so/example/123',
      'https://github.com/example/blog-post-1',
      'https://www.tistory.com/example/123',
      'https://blog.naver.com/example/123'
    ],
    work: [
      'https://github.com/example/project-1',
      'https://www.notion.so/example/work-1',
      'https://figma.com/file/example',
      'https://www.behance.net/gallery/123',
      'https://dribbble.com/shots/123',
      'https://www.linkedin.com/posts/example_123',
      'https://www.portfolio.com/example/work-1'
    ],
    food: [
      'https://www.instagram.com/p/restaurant-1',
      'https://www.youtube.com/watch?v=cooking-1',
      'https://www.naver.com/maps/restaurant/123',
      'https://www.kakao.com/maps/restaurant/123',
      'https://www.google.com/maps/restaurant/123',
      'https://www.tripadvisor.com/restaurant/123',
      'https://www.yelp.com/restaurant/123'
    ],
    fun: [
      'https://www.instagram.com/p/fun-1',
      'https://www.youtube.com/watch?v=game-1',
      'https://www.netflix.com/watch/123',
      'https://www.spotify.com/track/123',
      'https://www.twitch.tv/example',
      'https://www.discord.com/channels/123',
      'https://www.steam.com/app/123'
    ]
  };
  
  const categoryContents = contents[category];
  return categoryContents[index % categoryContents.length];
};

// 실제적인 챌린지 설명 생성
const generateChallengeDescription = (category: ChallengeCategory, index: number, userName: string): string => {
  const descriptions = {
    exercise: [
      `${userName}님의 헬스장 운동 인증`,
      `${userName}님의 러닝 기록`,
      `${userName}님의 요가 세션`,
      `${userName}님의 홈트레이닝`,
      `${userName}님의 등산 기록`,
      `${userName}님의 수영 세션`,
      `${userName}님의 사이클링`
    ],
    writing: [
      `${userName}님의 기술 블로그 포스트`,
      `${userName}님의 일기 작성`,
      `${userName}님의 회고록`,
      `${userName}님의 에세이`,
      `${userName}님의 개발 노트`,
      `${userName}님의 독서록`,
      `${userName}님의 아이디어 정리`
    ],
    work: [
      `${userName}님의 사이드 프로젝트`,
      `${userName}님의 포트폴리오 작업`,
      `${userName}님의 디자인 작업`,
      `${userName}님의 코드 리뷰`,
      `${userName}님의 기술 스터디`,
      `${userName}님의 업무 성과`,
      `${userName}님의 협업 프로젝트`
    ],
    food: [
      `${userName}님의 맛집 탐방`,
      `${userName}님의 홈쿡 도전`,
      `${userName}님의 카페 투어`,
      `${userName}님의 디저트 탐방`,
      `${userName}님의 술집 탐방`,
      `${userName}님의 브런치`,
      `${userName}님의 야식 탐방`
    ],
    fun: [
      `${userName}님의 게임 플레이`,
      `${userName}님의 영화 감상`,
      `${userName}님의 음악 감상`,
      `${userName}님의 여행 기록`,
      `${userName}님의 취미 활동`,
      `${userName}님의 친구 만남`,
      `${userName}님의 새로운 경험`
    ]
  };
  
  const categoryDescriptions = descriptions[category];
  return categoryDescriptions[index % categoryDescriptions.length];
};

// 샘플 챌린지 데이터 생성
export const generateSampleChallenges = (): Challenge[] => {
  const challenges: Challenge[] = [];
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  SAMPLE_USERS.forEach(user => {
    const progress = USER_PROGRESS[user.name as keyof typeof USER_PROGRESS];
    
    // 각 카테고리별로 챌린지 생성
    Object.entries(progress).forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        const challenge: Challenge = {
          id: generateId(),
          userId: user.id,
          category: category as ChallengeCategory,
          type: Math.random() > 0.5 ? 'photo' : 'link',
          content: generateChallengeContent(category as ChallengeCategory, i),
          description: generateChallengeDescription(category as ChallengeCategory, i, user.name),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          date: `${currentMonth}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
        };
        challenges.push(challenge);
      }
    });
  });
  
  return challenges;
};

// 샘플 데이터 로드 함수
export const loadSampleData = (): void => {
  // 항상 샘플 데이터를 로드 (기존 데이터 덮어쓰기)
  localStorage.setItem('mafia_users', JSON.stringify(SAMPLE_USERS));
  const sampleChallenges = generateSampleChallenges();
  localStorage.setItem('mafia_challenges', JSON.stringify(sampleChallenges));
  console.log('샘플 데이터가 로드되었습니다.');
  console.log('사용자 수:', SAMPLE_USERS.length);
  console.log('챌린지 수:', sampleChallenges.length);
};

// 데이터 초기화 함수
export const resetSampleData = (): void => {
  localStorage.setItem('mafia_users', JSON.stringify(SAMPLE_USERS));
  const sampleChallenges = generateSampleChallenges();
  localStorage.setItem('mafia_challenges', JSON.stringify(sampleChallenges));
  console.log('샘플 데이터가 초기화되었습니다.');
};

// 샘플 데이터만 제거하는 함수
export const removeSampleData = (): void => {
  const allUsers = JSON.parse(localStorage.getItem('mafia_users') || '[]');
  const allChallenges = JSON.parse(localStorage.getItem('mafia_challenges') || '[]');
  // 샘플 사용자 ID 목록
  const sampleUserIds = SAMPLE_USERS.map(user => user.id);

  // 샘플 사용자 제거
  const realUsers = allUsers.filter((user: User) => !sampleUserIds.includes(user.id));
  // 샘플 사용자의 챌린지만 제거
  const realChallenges = allChallenges.filter((challenge: Challenge) => !sampleUserIds.includes(challenge.userId));

  // 실제 데이터만 저장
  localStorage.setItem('mafia_users', JSON.stringify(realUsers));
  localStorage.setItem('mafia_challenges', JSON.stringify(realChallenges));
  console.log('샘플 데이터가 제거되었습니다.');
  console.log('남은 사용자 수:', realUsers.length);
  console.log('남은 챌린지 수:', realChallenges.length);
};

// 브라우저 콘솔에서 실행할 수 있는 전역 함수들
if (typeof window !== 'undefined') {
  (window as any).loadMafiaSampleData = loadSampleData;
  (window as any).resetMafiaSampleData = resetSampleData;
  (window as any).getMafiaUsers = () => JSON.parse(localStorage.getItem('mafia_users') || '[]');
  (window as any).getMafiaChallenges = () => JSON.parse(localStorage.getItem('mafia_challenges') || '[]');
  (window as any).forceLoadMafiaData = () => {
    loadSampleData();
    window.location.reload();
  };
} 