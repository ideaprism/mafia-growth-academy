import { User, Challenge, ChallengeCategory, UserProgress, MonthlyStats } from '@/types';
import { getAllUsers, getCurrentMonthChallenges, getUserChallenges } from './storage';
import { getAllCategories } from './categories';

export const calculateUserProgress = (userId: string, month?: string): UserProgress => {
  const challenges = getUserChallenges(userId, month);
  const categories = getAllCategories();
  
  const progress: UserProgress = {
    userId,
    exercise: 0,
    writing: 0,
    work: 0,
    food: 0,
    fun: 0,
    total: 0
  };

  challenges.forEach(challenge => {
    progress[challenge.category]++;
    progress.total++;
  });

  return progress;
};

export const calculateUserProgressPercentage = (userId: string, month?: string): Record<ChallengeCategory, number> => {
  const progress = calculateUserProgress(userId, month);
  const categories = getAllCategories();
  
  const percentages: Record<ChallengeCategory, number> = {} as Record<ChallengeCategory, number>;
  
  categories.forEach(category => {
    const achieved = progress[category.id];
    const goal = category.monthlyGoal;
    percentages[category.id] = Math.min((achieved / goal) * 100, 100);
  });

  return percentages;
};

export const calculateMonthlyStats = (month?: string): MonthlyStats => {
  const users = getAllUsers();
  const challenges = getCurrentMonthChallenges();
  const categories = getAllCategories();

  const categoryStats: MonthlyStats['categoryStats'] = {} as MonthlyStats['categoryStats'];

  categories.forEach(category => {
    const categoryChallenges = challenges.filter(c => c.category === category.id);
    const participants = new Set(categoryChallenges.map(c => c.userId)).size;
    
    categoryStats[category.id] = {
      participants,
      totalSubmissions: categoryChallenges.length,
      averagePerUser: participants > 0 ? categoryChallenges.length / participants : 0
    };
  });

  // Calculate top users
  const userChallengeCount = users.map(user => {
    const userChallenges = challenges.filter(c => c.userId === user.id);
    return {
      userId: user.id,
      userName: user.name,
      family: user.family,
      totalChallenges: userChallenges.length
    };
  }).sort((a, b) => b.totalChallenges - a.totalChallenges).slice(0, 5);

  return {
    totalUsers: users.length,
    totalChallenges: challenges.length,
    categoryStats,
    topUsers: userChallengeCount
  };
};

export const getRankingByCategory = (category: ChallengeCategory, month?: string): Array<{
  userId: string;
  userName: string;
  family: string;
  count: number;
  percentage: number;
}> => {
  const users = getAllUsers();
  const categoryConfig = getAllCategories().find(c => c.id === category);
  
  if (!categoryConfig) return [];

  return users.map(user => {
    const progress = calculateUserProgress(user.id, month);
    const count = progress[category];
    const percentage = Math.min((count / categoryConfig.monthlyGoal) * 100, 100);
    
    return {
      userId: user.id,
      userName: user.name,
      family: user.family,
      count,
      percentage
    };
  }).sort((a, b) => b.count - a.count);
};

export const getOverallRanking = (month?: string): Array<{
  userId: string;
  userName: string;
  family: string;
  totalChallenges: number;
  averagePercentage: number;
}> => {
  const users = getAllUsers();
  
  return users.map(user => {
    const progress = calculateUserProgress(user.id, month);
    const percentages = calculateUserProgressPercentage(user.id, month);
    const averagePercentage = Object.values(percentages).reduce((sum, p) => sum + p, 0) / 5;
    
    return {
      userId: user.id,
      userName: user.name,
      family: user.family,
      totalChallenges: progress.total,
      averagePercentage
    };
  }).sort((a, b) => b.averagePercentage - a.averagePercentage);
};