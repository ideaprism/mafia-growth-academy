import { CategoryConfig, ChallengeCategory } from '@/types';

export const CHALLENGE_CATEGORIES: Record<ChallengeCategory, CategoryConfig> = {
  exercise: {
    id: 'exercise',
    name: 'Exercise',
    koreanName: '운동',
    icon: 'Dumbbell',
    emoji: '🏃',
    monthlyGoal: 7,
    color: '#FF6B6B',
    description: '건강한 몸과 마음을 위한 운동 챌린지'
  },
  writing: {
    id: 'writing',
    name: 'Writing',
    koreanName: '글쓰기',
    icon: 'PenTool',
    emoji: '✍️',
    monthlyGoal: 7,
    color: '#4ECDC4',
    description: '생각을 정리하고 표현하는 글쓰기 챌린지'
  },
  work: {
    id: 'work',
    name: 'Work',
    koreanName: '작업',
    icon: 'Briefcase',
    emoji: '💼',
    monthlyGoal: 7,
    color: '#45B7D1',
    description: '전문성 향상과 생산성을 위한 작업 챌린지'
  },
  food: {
    id: 'food',
    name: 'Food',
    koreanName: '맛집',
    icon: 'UtensilsCrossed',
    emoji: '🍽️',
    monthlyGoal: 7,
    color: '#96CEB4',
    description: '새로운 맛과 경험을 위한 맛집 탐방 챌린지'
  },
  fun: {
    id: 'fun',
    name: 'Fun',
    koreanName: '놀기',
    icon: 'Gamepad2',
    emoji: '🎮',
    monthlyGoal: 3,
    color: '#FFEAA7',
    description: '재충전과 즐거움을 위한 놀기 챌린지 (커스터마이징 가능)'
  }
};

export const getCategoryConfig = (category: ChallengeCategory): CategoryConfig => {
  return CHALLENGE_CATEGORIES[category];
};

export const getAllCategories = (): CategoryConfig[] => {
  return Object.values(CHALLENGE_CATEGORIES);
};

export const categories = getAllCategories();