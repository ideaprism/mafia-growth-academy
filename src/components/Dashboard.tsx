import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LogOut, Plus, Target, TrendingUp, Users, Crown, Settings, Eye, Camera, Link, Edit, Trash2, 
  Gamepad2, UtensilsCrossed, PenTool, Dumbbell, Briefcase, HelpCircle, Menu, X 
} from 'lucide-react';
import { User, ChallengeCategory, CategoryConfig } from '@/types';
import { UserRadarChart } from './RadarChart';
import { ChallengeForm } from './ChallengeForm';
import { CategoryChallengeList } from './CategoryChallengeList';
import { UserChallengeViewer } from './UserChallengeViewer';
import { ChallengeCertificationModal } from './ChallengeCertificationModal';
import { UserGuideModal } from './UserGuideModal';
import { getAllCategories } from '@/lib/categories';
import { clearCurrentUser, findUserById } from '@/lib/storage';
import { calculateUserProgressPercentage, calculateMonthlyStats, getOverallRanking, getRankingByCategory } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { removeSampleData } from '@/lib/sampleData';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | null>(null);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ChallengeCategory | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const { toast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = getAllCategories();
  const userProgress = useMemo(() => calculateUserProgressPercentage(user.id), [user.id]);
  const monthlyStats = useMemo(() => calculateMonthlyStats(), []);
  const overallRanking = useMemo(() => getOverallRanking(), []);

  const handleLogout = () => {
    clearCurrentUser();
    toast({
      title: "로그아웃 완료",
      description: "안전하게 로그아웃되었습니다.",
    });
    onLogout();
  };

  const handleCategoryClick = (category: ChallengeCategory) => {
    setSelectedCategory(category);
  };

  const handleRadarChartCategoryClick = (category: ChallengeCategory) => {
    setSelectedCategory(category);
    setShowCategoryList(true);
  };

  const handleChallengeSuccess = () => {
    setSelectedCategory(null);
    toast({
      title: "챌린지 완료!",
      description: "새로운 도전이 기록되었습니다. 계속해서 성장해나가세요!",
    });
  };

  const handleBackFromCategoryList = () => {
    setShowCategoryList(false);
    setSelectedCategory(null);
  };

  const handleUserClick = (userId: string, category?: ChallengeCategory) => {
    const targetUser = findUserById(userId);
    if (targetUser) {
      setViewingUser(targetUser);
      setViewingCategory(category || null);
    }
  };

  const handleBackFromUserView = () => {
    setViewingUser(null);
    setViewingCategory(null);
  };

  const handleCategoryFilter = (category: ChallengeCategory) => {
    setViewingCategory(category);
  };

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

  const handleCertificationSubmit = (data: {
    category: CategoryConfig;
    method: 'photo' | 'link';
    photo?: File;
    link?: string;
    description: string;
  }) => {
    // TODO: 실제 인증 데이터 저장 로직 구현
    console.log('Certification submitted:', data);
    
    toast({
      title: "인증 완료!",
      description: `${data.category.koreanName} 챌린지가 성공적으로 인증되었습니다.`,
    });
    
    setShowCertificationModal(false);
  };

  // 다른 사용자 인증 보기 화면 표시
  if (viewingUser) {
    return (
      <UserChallengeViewer
        currentUser={user}
        targetUser={viewingUser}
        category={viewingCategory}
        onBack={handleBackFromUserView}
        onCategoryFilter={handleCategoryFilter}
      />
    );
  }

  // 카테고리 인증 목록 화면 표시
  if (showCategoryList && selectedCategory) {
    return (
      <CategoryChallengeList
        user={user}
        category={selectedCategory}
        onBack={handleBackFromCategoryList}
      />
    );
  }

  // 챌린지 폼 화면 표시
  if (selectedCategory && !showCategoryList) {
    return (
      <div className="min-h-screen bg-background p-4">
        <ChallengeForm
          user={user}
          category={selectedCategory}
          onSuccess={handleChallengeSuccess}
          onCancel={() => setSelectedCategory(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Challenge Certification Modal */}
      <ChallengeCertificationModal
        isOpen={showCertificationModal}
        onClose={() => setShowCertificationModal(false)}
        onSubmit={handleCertificationSubmit}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/mafia-logo.png" 
                alt="MAFIA ACADEMY" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {user.family}
                </p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowUserGuide(true)}
                className="text-mafia-gold hover:text-yellow-400 hover:bg-yellow-500/10"
              >
                <HelpCircle className="w-4 h-4" />
                이용안내
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  removeSampleData();
                  toast({
                    title: '임시 데이터 초기화 완료',
                    description: '샘플 데이터가 모두 삭제되었습니다.',
                  });
                  window.location.reload();
                }}
              >
                임시 데이터 초기화
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/boss'}>
                <Crown className="w-4 h-4" />
                두목 페이지
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 p-4 bg-background border border-border rounded-lg shadow-lg">
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowUserGuide(true)}
                  className="text-mafia-gold hover:text-yellow-400 hover:bg-yellow-500/10"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  이용안내
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    removeSampleData();
                    toast({
                      title: '임시 데이터 초기화 완료',
                      description: '샘플 데이터가 모두 삭제되었습니다.',
                    });
                    window.location.reload();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  임시 데이터 초기화
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/boss'}>
                  <Crown className="w-4 h-4 mr-2" />
                  두목 페이지
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">내 진행상황</TabsTrigger>
          <TabsTrigger value="community">구락부 현황</TabsTrigger>
        </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Section: Monthly Achievement Rate and Challenge Certification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Achievement Rate */}
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-mafia-gold" />
                    월간 달성률: {Math.round(Object.values(userProgress).reduce((sum, val) => sum + val, 0) / 5)}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserRadarChart 
                    data={userProgress} 
                    onCategoryClick={handleRadarChartCategoryClick}
                  />
                </CardContent>
              </Card>

              {/* Challenge Certification */}
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-mafia-gold" />
                    챌린지 인증
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-600 h-12"
                    onClick={() => setShowCertificationModal(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    새 인증 추가
                  </Button>
                  
                  {/* Category Progress List */}
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const progress = userProgress[category.id];
                      const currentCount = Math.round((progress / 100) * category.monthlyGoal);
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(category.icon)}
                            <span className="font-medium">{category.koreanName}</span>
                          </div>
                          <Badge className="bg-yellow-500 text-black">
                            {currentCount}/{category.monthlyGoal}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section: Recent Certification Records */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-mafia-gold" />
                  내 최근 인증 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sample records - 실제 데이터로 교체 필요 */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">사진</span>
                          <span className="text-sm text-muted-foreground">Invalid Date</span>
                        </div>
                        <p className="font-medium">영화관에서 새 영화 감상</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">링크</span>
                          <span className="text-sm text-muted-foreground">Invalid Date</span>
                        </div>
                        <p className="font-medium">건강한 샐러드 식사</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PenTool className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">링크</span>
                          <span className="text-sm text-muted-foreground">Invalid Date</span>
                        </div>
                        <p className="font-medium">일일 회고록 작성</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">사진</span>
                          <span className="text-sm text-muted-foreground">Invalid Date</span>
                        </div>
                        <p className="font-medium">오늘 5km 러닝 완료!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">사진</span>
                          <span className="text-sm text-muted-foreground">Invalid Date</span>
                        </div>
                        <p className="font-medium">요가 클래스 참여</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Overall Ranking */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-mafia-gold" />
                  종합 순위
                </CardTitle>
                <CardDescription>
                  이번 달 전체 참여자 순위. 참여자를 클릭하면 해당 참여자의 인증 목록을 볼 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overallRanking.slice(0, 10).map((participant, index) => (
                    <div 
                      key={participant.userId}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${
                        participant.userId === user.id 
                          ? 'bg-mafia-gold/10 border border-mafia-gold/30' 
                          : 'bg-muted/50 hover:bg-muted/70'
                      }`}
                      onClick={() => handleUserClick(participant.userId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-black' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {participant.userName}
                            {participant.userId === user.id && (
                              <Badge variant="secondary" className="ml-2 bg-mafia-gold/20 text-mafia-gold">
                                나
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{participant.family}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          {Math.round(participant.averagePercentage)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {participant.totalChallenges}개 완료
                        </p>
                      </div>
                      {participant.userId !== user.id && (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((category) => {
                const categoryRanking = getRankingByCategory(category.id);
                
                return (
                  <Card key={category.id} className="shadow-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getCategoryIcon(category.icon)}
                        {category.koreanName} 순위
                      </CardTitle>
                      <CardDescription>
                        참여자를 클릭하면 해당 카테고리의 인증 목록을 볼 수 있습니다.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryRanking.slice(0, 5).map((participant, index) => (
                          <div 
                            key={participant.userId}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer hover:shadow-sm transition-all duration-200 ${
                              participant.userId === user.id 
                                ? 'bg-mafia-gold/10' 
                                : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                            onClick={() => handleUserClick(participant.userId, category.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-medium">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {participant.userName}
                                {participant.userId === user.id && ' (나)'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <span className="text-sm font-bold text-foreground">
                                  {participant.count}회
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({Math.round(participant.percentage)}%)
                                </span>
                              </div>
                              {participant.userId !== user.id && (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>


        </Tabs>
      </div>
      
      {/* 이용안내 모달 */}
      <UserGuideModal 
        isOpen={showUserGuide} 
        onClose={() => setShowUserGuide(false)} 
      />
    </div>
  );
};