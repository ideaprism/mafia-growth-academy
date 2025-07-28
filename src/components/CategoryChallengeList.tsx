import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Trash2, Calendar, Image, Link, Plus } from 'lucide-react';
import { User, Challenge, ChallengeCategory } from '@/types';
import { getCategoryConfig } from '@/lib/categories';
import { getUserChallenges, saveChallenge, deleteChallenge, updateChallenge, generateId, getCurrentDate } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ReactionButtons } from './ReactionButtons';

interface CategoryChallengeListProps {
  user: User;
  category: ChallengeCategory;
  onBack: () => void;
}

export const CategoryChallengeList: React.FC<CategoryChallengeListProps> = ({ 
  user, 
  category, 
  onBack 
}) => {
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    description: '',
    date: ''
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const categoryConfig = getCategoryConfig(category);
  const challenges = useMemo(() => getUserChallenges(user.id), [user.id, refreshKey]);

  const categoryChallenges = challenges.filter(c => c.category === category);

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setEditForm({
      description: challenge.description || '',
      date: challenge.date
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteChallenge = (challengeId: string) => {
    deleteChallenge(challengeId);
    setRefreshKey(prev => prev + 1);
    
    toast({
      title: "인증 삭제 완료",
      description: "선택한 인증이 삭제되었습니다.",
    });
  };

  const handleSaveEdit = () => {
    if (!editingChallenge) return;

    const updatedChallenge: Challenge = {
      ...editingChallenge,
      description: editForm.description,
      date: editForm.date
    };

    updateChallenge(updatedChallenge);
    setRefreshKey(prev => prev + 1);

    setIsEditDialogOpen(false);
    setEditingChallenge(null);
    
    toast({
      title: "인증 수정 완료",
      description: "인증 정보가 성공적으로 수정되었습니다.",
    });
  };

  const handleAddNewChallenge = () => {
    const newChallenge: Challenge = {
      id: generateId(),
      userId: user.id,
      category,
      type: 'photo',
      content: '',
      description: '',
      createdAt: new Date().toISOString(),
      date: getCurrentDate()
    };

    saveChallenge(newChallenge);
    setRefreshKey(prev => prev + 1);
    
    toast({
      title: "새 인증 추가",
      description: "새로운 인증이 추가되었습니다. 내용을 입력해주세요.",
    });
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
            <span className="text-3xl">{categoryConfig.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{categoryConfig.koreanName} 인증 목록</h1>
              <p className="text-sm text-muted-foreground">
                총 {categoryChallenges.length}개의 인증이 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* Add New Challenge Button */}
        <div className="mb-6">
          <Button onClick={handleAddNewChallenge} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            새 인증 추가
          </Button>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {categoryChallenges.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">아직 인증이 없습니다</p>
                  <p className="text-sm">새로운 인증을 추가해보세요!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            categoryChallenges.map((challenge) => (
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditChallenge(challenge)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                    currentUserId={user.id}
                    currentUserName={user.name}
                    currentUserFamily={user.family}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>인증 수정</DialogTitle>
              <DialogDescription>
                인증 정보를 수정할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  placeholder="인증에 대한 설명을 입력하세요..."
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSaveEdit}>
                  저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 