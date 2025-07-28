import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Dumbbell, PenTool, Briefcase, UtensilsCrossed, Gamepad2, Camera, Link, Upload, Target, Users, BarChart3 } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      default: return <Dumbbell className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-yellow-500">마피아 연수원 이용안내</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* 소개 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">🎯 마피아 연수원이란?</h2>
            <p className="text-muted-foreground leading-relaxed">
              실리콘밸리 마피아를 컨셉으로 한 개인 성장 챌린지 플랫폼입니다. 
              모임 구성원들이 5개 카테고리의 월간 챌린지를 수행하고 서로 응원하며 균형 잡힌 발전을 추구합니다.
            </p>
          </div>

          {/* 시작하기 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">🚀 시작하기</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">1. 로그인</h3>
                  <p className="text-sm text-muted-foreground">
                    이름과 마피아 패밀리명을 입력하여 로그인하세요. 
                    기존 사용자는 자동으로 복원됩니다.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">2. 대시보드 확인</h3>
                  <p className="text-sm text-muted-foreground">
                    개인 진행도와 전체 통계를 확인하세요. 
                    5각형 레이더 차트로 균형 잡힌 성장을 추적할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 챌린지 카테고리 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">📋 챌린지 카테고리</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon('Dumbbell')}
                    <h3 className="font-medium">운동 (Exercise)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">월 7회 목표</p>
                  <p className="text-xs text-muted-foreground">
                    헬스, 러닝, 요가 등 건강한 활동을 인증하세요
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon('PenTool')}
                    <h3 className="font-medium">글쓰기 (Writing)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">월 7회 목표</p>
                  <p className="text-xs text-muted-foreground">
                    블로그, 기술 문서, 에세이 등 글쓰기 활동을 인증하세요
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon('Briefcase')}
                    <h3 className="font-medium">작업 (Work)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">월 7회 목표</p>
                  <p className="text-xs text-muted-foreground">
                    프로젝트, 학습, 업무 성과 등 작업 활동을 인증하세요
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon('UtensilsCrossed')}
                    <h3 className="font-medium">맛집 (Food)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">월 7회 목표</p>
                  <p className="text-xs text-muted-foreground">
                    새로운 맛집 탐방, 요리, 음식 문화 체험을 인증하세요
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon('Gamepad2')}
                    <h3 className="font-medium">놀기 (Fun)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">월 3회 목표</p>
                  <p className="text-xs text-muted-foreground">
                    게임, 여행, 취미 활동 등 즐거운 시간을 인증하세요
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 인증 방법 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">📸 인증 방법</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium">사진 인증</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 사진을 클릭하거나 드래그 앤 드롭으로 업로드</li>
                    <li>• JPG, PNG, WebP 형식 지원</li>
                    <li>• 자동으로 이미지 압축 (최대 1MB)</li>
                    <li>• 실시간 미리보기 제공</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Link className="w-5 h-5 text-green-500" />
                    <h3 className="font-medium">링크 인증</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 블로그, 유튜브, SNS 등 외부 링크 입력</li>
                    <li>• URL 형식 자동 검증</li>
                    <li>• 링크 제한 없음</li>
                    <li>• 설명과 함께 인증 가능</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 대시보드 기능 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">📊 대시보드 기능</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-medium mb-2">개인 진행도</h3>
                  <p className="text-sm text-muted-foreground">
                    5각형 레이더 차트로 균형 잡힌 성장을 시각화
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-medium mb-2">커뮤니티</h3>
                  <p className="text-sm text-muted-foreground">
                    다른 참여자들의 활동과 랭킹 확인
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-medium mb-2">통계</h3>
                  <p className="text-sm text-muted-foreground">
                    월간 통계와 카테고리별 참여 현황
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 팁 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">💡 이용 팁</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>매월 1일에 챌린지가 초기화됩니다. 꾸준한 참여가 중요해요!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>5개 카테고리를 균형 있게 수행하면 더 높은 랭킹을 얻을 수 있어요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>사진 인증 시 드래그 앤 드롭을 활용하면 더 편리해요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>설명을 추가하면 나중에 인증 내역을 더 잘 기억할 수 있어요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>커뮤니티 탭에서 다른 참여자들의 활동을 확인하고 서로 응원해보세요!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 문의 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-400">❓ 문의사항</h2>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  이용 중 궁금한 점이나 문제가 발생하면 마피아 패밀리 대화방을 통해 문의해주세요. 
                  빠른 시일 내에 답변드리겠습니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 닫기 버튼 */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onClose}
              className="bg-yellow-500 text-black hover:bg-yellow-600"
            >
              이용안내 확인 완료
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 