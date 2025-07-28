import { User, Challenge, ChallengeCategory, Reaction, ReactionType } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'mafia_current_user',
  USERS: 'mafia_users',
  CHALLENGES: 'mafia_challenges',
  REACTIONS: 'mafia_reactions',
} as const;

// User management
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getAllUsers = (): User[] => {
  const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersData ? JSON.parse(usersData) : [];
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const findUserByNameAndFamily = (name: string, family: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.name === name && u.family === family) || null;
};

export const findUserById = (userId: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
};

export const deleteUser = (userId: string): void => {
  const users = getAllUsers();
  const updatedUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
};

// Challenge management
export const getAllChallenges = (): Challenge[] => {
  const challengesData = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
  return challengesData ? JSON.parse(challengesData) : [];
};

export const saveChallenge = (challenge: Challenge): void => {
  const challenges = getAllChallenges();
  challenges.push(challenge);
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
};

export const deleteChallenge = (challengeId: string): void => {
  const challenges = getAllChallenges();
  const updatedChallenges = challenges.filter(c => c.id !== challengeId);
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updatedChallenges));
};

export const updateChallenge = (updatedChallenge: Challenge): void => {
  const challenges = getAllChallenges();
  const updatedChallenges = challenges.map(c => 
    c.id === updatedChallenge.id ? updatedChallenge : c
  );
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updatedChallenges));
};

export const getUserChallenges = (userId: string, month?: string): Challenge[] => {
  const challenges = getAllChallenges();
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
  
  return challenges.filter(c => 
    c.userId === userId && 
    c.date.startsWith(currentMonth)
  );
};

export const getChallengesByCategory = (category: ChallengeCategory, month?: string): Challenge[] => {
  const challenges = getAllChallenges();
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  
  return challenges.filter(c => 
    c.category === category && 
    c.date.startsWith(currentMonth)
  );
};

export const getCurrentMonthChallenges = (): Challenge[] => {
  const challenges = getAllChallenges();
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  return challenges.filter(c => c.date.startsWith(currentMonth));
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

// Reaction management
export const getAllReactions = (): Reaction[] => {
  const reactionsData = localStorage.getItem(STORAGE_KEYS.REACTIONS);
  return reactionsData ? JSON.parse(reactionsData) : [];
};

export const saveReaction = (reaction: Reaction): void => {
  const reactions = getAllReactions();
  reactions.push(reaction);
  localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
};

export const deleteReaction = (reactionId: string): void => {
  const reactions = getAllReactions();
  const updatedReactions = reactions.filter(r => r.id !== reactionId);
  localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(updatedReactions));
};

export const getReactionsByChallenge = (challengeId: string): Reaction[] => {
  const reactions = getAllReactions();
  return reactions.filter(r => r.challengeId === challengeId);
};

export const getUserReactionOnChallenge = (userId: string, challengeId: string): Reaction | null => {
  const reactions = getAllReactions();
  return reactions.find(r => r.userId === userId && r.challengeId === challengeId) || null;
};

export const toggleReaction = (userId: string, challengeId: string, reactionType: ReactionType, userName: string, userFamily: string): Reaction | null => {
  const existingReaction = getUserReactionOnChallenge(userId, challengeId);
  
  if (existingReaction) {
    // 이미 같은 반응이 있으면 제거
    if (existingReaction.type === reactionType) {
      deleteReaction(existingReaction.id);
      return null;
    } else {
      // 다른 반응이 있으면 업데이트
      deleteReaction(existingReaction.id);
    }
  }
  
  // 새로운 반응 추가
  const newReaction: Reaction = {
    id: generateId(),
    challengeId,
    userId,
    userName,
    userFamily,
    type: reactionType,
    createdAt: new Date().toISOString()
  };
  
  saveReaction(newReaction);
  return newReaction;
};