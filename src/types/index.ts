export interface User {
  id: string;
  name: string;
  family: string;
  email?: string;
  role?: 'admin' | 'member';
  createdAt: string;
  progress?: UserProgress;
  challenges?: Challenge[];
}

export interface Challenge {
  id: string;
  userId: string;
  category: ChallengeCategory;
  type: 'photo' | 'link';
  content: string; // base64 image or URL
  description?: string;
  createdAt: string;
  date: string; // YYYY-MM-DD format
}

export type ChallengeCategory = 'exercise' | 'writing' | 'work' | 'food' | 'fun';

export interface CategoryConfig {
  id: ChallengeCategory;
  name: string;
  koreanName: string;
  icon: string;
  emoji: string;
  monthlyGoal: number;
  color: string;
  description: string;
}

export interface UserProgress {
  userId: string;
  exercise: number;
  writing: number;
  work: number;
  food: number;
  fun: number;
  total: number;
}

export interface MonthlyStats {
  totalUsers: number;
  totalChallenges: number;
  categoryStats: Record<ChallengeCategory, {
    participants: number;
    totalSubmissions: number;
    averagePerUser: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    family: string;
    totalChallenges: number;
  }>;
}

export type ReactionType = '👍' | '❤️' | '🔥' | '👏' | '🎉' | '💪' | '😊' | '🤩';

export interface Reaction {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userFamily: string;
  type: ReactionType;
  createdAt: string;
}

export interface ChallengeWithReactions extends Challenge {
  reactions: Reaction[];
}