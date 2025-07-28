import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactionType, Reaction } from '@/types';
import { getReactionsByChallenge, getUserReactionOnChallenge, toggleReaction } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ReactionButtonsProps {
  challengeId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserFamily: string;
}

const REACTION_OPTIONS: Array<{ type: ReactionType; label: string; description: string }> = [
  { type: '👍', label: '좋아요', description: '멋진 도전이에요!' },
  { type: '❤️', label: '사랑해요', description: '정말 감동적이에요!' },
  { type: '🔥', label: '불타요', description: '열정이 느껴져요!' },
  { type: '👏', label: '박수', description: '정말 대단해요!' },
  { type: '🎉', label: '축하해요', description: '축하드려요!' },
  { type: '💪', label: '힘내요', description: '계속 힘내세요!' },
  { type: '😊', label: '미소', description: '기분이 좋아져요!' },
  { type: '🤩', label: '완전최고', description: '완전 최고예요!' },
];

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  challengeId,
  currentUserId,
  currentUserName,
  currentUserFamily,
}) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReaction, setUserReaction] = useState<Reaction | null>(null);
  const { toast } = useToast();

  // 반응 데이터 로드
  useEffect(() => {
    const challengeReactions = getReactionsByChallenge(challengeId);
    const userCurrentReaction = getUserReactionOnChallenge(currentUserId, challengeId);
    
    setReactions(challengeReactions);
    setUserReaction(userCurrentReaction);
  }, [challengeId, currentUserId]);

  const handleReactionClick = (reactionType: ReactionType) => {
    const result = toggleReaction(
      currentUserId,
      challengeId,
      reactionType,
      currentUserName,
      currentUserFamily
    );

    // 상태 업데이트
    const updatedReactions = getReactionsByChallenge(challengeId);
    const updatedUserReaction = getUserReactionOnChallenge(currentUserId, challengeId);
    
    setReactions(updatedReactions);
    setUserReaction(updatedUserReaction);

    // 토스트 메시지
    if (result) {
      toast({
        title: "응원 완료!",
        description: `${REACTION_OPTIONS.find(r => r.type === reactionType)?.description}`,
      });
    } else {
      toast({
        title: "응원 취소",
        description: "응원을 취소했습니다.",
      });
    }
  };

  // 반응 타입별 개수 계산
  const reactionCounts = (() => {
    const counts: Record<ReactionType, number> = {
      '👍': 0, '❤️': 0, '🔥': 0, '👏': 0, '🎉': 0, '💪': 0, '😊': 0, '🤩': 0
    };
    
    reactions.forEach(reaction => {
      counts[reaction.type]++;
    });
    
    return counts;
  })();

  // 반응을 누른 사용자 목록 (최대 3명)
  const getReactionUsers = (type: ReactionType) => {
    const users = reactions
      .filter(r => r.type === type)
      .slice(0, 3)
      .map(r => r.userName);
    
    if (reactions.filter(r => r.type === type).length > 3) {
      users.push(`외 ${reactions.filter(r => r.type === type).length - 3}명`);
    }
    
    return users.join(', ');
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 mt-4">
        {REACTION_OPTIONS.map((option) => {
          const count = reactionCounts[option.type];
          const isUserReacted = userReaction?.type === option.type;
          const users = getReactionUsers(option.type);
          
          return (
            <Tooltip key={option.type}>
              <TooltipTrigger asChild>
                <Button
                  variant={isUserReacted ? "default" : "outline"}
                  size="sm"
                  className={`h-8 px-2 gap-1 transition-all duration-200 ${
                    isUserReacted 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600 border-yellow-500' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleReactionClick(option.type)}
                >
                  <span className="text-sm">{option.type}</span>
                  {count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        isUserReacted ? 'bg-yellow-600 text-white' : 'bg-muted'
                      }`}
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                  {count > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {users}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}; 