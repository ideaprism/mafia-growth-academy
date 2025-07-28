import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Image, Link, Eye } from 'lucide-react';
import { User, Challenge, ChallengeCategory } from '@/types';
import { getCategoryConfig } from '@/lib/categories';
import { getUserChallenges } from '@/lib/storage';
import { ReactionButtons } from './ReactionButtons';

interface UserChallengeViewerProps {
  currentUser: User;
  targetUser: User;
  category?: ChallengeCategory;
  onBack: () => void;
  onCategoryFilter?: (category: ChallengeCategory) => void;
}

export const UserChallengeViewer: React.FC<UserChallengeViewerProps> = ({ 
  currentUser, 
  targetUser, 
  category,
  onBack,
  onCategoryFilter
}) => {
  const challenges = useMemo(() => getUserChallenges(targetUser.id), [targetUser.id]);
  
  const filteredChallenges = category 
    ? challenges.filter(c => c.category === category)
    : challenges;

  const categoryConfig = category ? getCategoryConfig(category) : null;

  const getCategoryIcon = (categoryId: ChallengeCategory) => {
    const config = getCategoryConfig(categoryId);
    return config.emoji;
  };

  const getCategoryName = (categoryId: ChallengeCategory) => {
    const config = getCategoryConfig(categoryId);
    return config.koreanName;
  };

  const handleCategoryFilter = (selectedCategory: ChallengeCategory) => {
    if (onCategoryFilter) {
      onCategoryFilter(selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-mafia-gold/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {targetUser.family} · {targetUser.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {categoryConfig ? `${categoryConfig.koreanName} 인증 목록` : '전체 인증 목록'}
              </p>
            </div>
            <Badge variant="outline" className="ml-2">
              <Eye className="w-3 h-3 mr-1" />
              열람 모드
            </Badge>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{filteredChallenges.length}</p>
                <p className="text-sm text-muted-foreground">총 인증 수</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {new Set(filteredChallenges.map(c => c.date.slice(0, 7))).size}
                </p>
                <p className="text-sm text-muted-foreground">참여 월 수</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {new Set(filteredChallenges.map(c => c.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">참여 카테고리</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {filteredChallenges.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">아직 인증이 없습니다</p>
                  <p className="text-sm">이 사용자는 아직 인증을 등록하지 않았습니다.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredChallenges
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(challenge.date).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        {!category && (
                          <Badge variant="outline" className="text-xs">
                            <span className="mr-1">{getCategoryIcon(challenge.category)}</span>
                            {getCategoryName(challenge.category)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {challenge.type === 'photo' ? (
                            <>
                              <Image className="w-3 h-3 mr-1" />
                              사진
                            </>
                          ) : (
                            <>
                              <Link className="w-3 h-3 mr-1" />
                              링크
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {challenge.description && (
                      <p className="text-sm text-foreground mb-3">
                        {challenge.description}
                      </p>
                    )}
                    {challenge.content && (
                      <div className="mt-3">
                        {challenge.type === 'photo' ? (
                          <img
                            src={challenge.content}
                            alt="인증 사진"
                            className="w-full max-w-md h-auto rounded-lg border border-border"
                          />
                        ) : (
                          <a
                            href={challenge.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {challenge.content}
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* 반응 버튼 */}
                    <ReactionButtons
                      challengeId={challenge.id}
                      currentUserId={currentUser.id}
                      currentUserName={currentUser.name}
                      currentUserFamily={currentUser.family}
                    />
                  </CardContent>
                </Card>
              ))
          )}
        </div>

        {/* Category Filter (전체 보기일 때만) */}
        {!category && onCategoryFilter && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">카테고리별 필터</CardTitle>
                <CardDescription>
                  특정 카테고리의 인증만 보고 싶다면 클릭하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['exercise', 'writing', 'work', 'food', 'fun'].map((cat) => {
                    const catConfig = getCategoryConfig(cat as ChallengeCategory);
                    const catChallenges = challenges.filter(c => c.category === cat);
                    
                    return (
                      <Button
                        key={cat}
                        variant="outline"
                        className="flex flex-col items-center gap-2 p-4 h-auto"
                        onClick={() => handleCategoryFilter(cat as ChallengeCategory)}
                      >
                        <span className="text-2xl">{catConfig.emoji}</span>
                        <span className="text-xs font-medium">{catConfig.koreanName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {catChallenges.length}개
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 