import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Crown, 
  Trophy, 
  Target, 
  TrendingUp, 
  UserPlus, 
  UserMinus,
  Shield,
  Activity,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { User, ChallengeCategory } from '@/types';
import { getAllUsers, saveUser, deleteUser } from '@/lib/storage';
import { categories } from '@/lib/categories';

const BossPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    email: '',
    role: 'member' as 'admin' | 'member'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const handleAddUser = () => {
    if (!newUser.id || !newUser.name || !newUser.email) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const userExists = users.find(u => u.id === newUser.id);
    if (userExists) {
      alert('이미 존재하는 사용자 ID입니다.');
      return;
    }

    const user: User = {
      id: newUser.id,
      name: newUser.name,
      family: '광교',
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString(),
      progress: {
        userId: newUser.id,
        exercise: 0,
        writing: 0,
        work: 0,
        food: 0,
        fun: 0,
        total: 0
      },
      challenges: []
    };

    saveUser(user);
    loadUsers();
    setNewUser({ id: '', name: '', email: '', role: 'member' });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      deleteUser(userId);
      loadUsers();
    }
  };

  const calculateUserStats = (user: User) => {
    if (!user.progress) {
      return {
        averageProgress: 0,
        totalChallenges: 0,
        totalProgress: 0
      };
    }
    
    const totalProgress = user.progress.exercise + user.progress.writing + user.progress.work + user.progress.food + user.progress.fun;
    const averageProgress = Math.round(totalProgress / 5);
    const totalChallenges = user.challenges?.length || 0;
    
    return {
      averageProgress,
      totalChallenges,
      totalProgress
    };
  };

  const getOverallStats = () => {
    const totalUsers = users.length;
    const totalProgress = users.reduce((sum, user) => {
      if (!user.progress) return sum;
      return sum + user.progress.exercise + user.progress.writing + user.progress.work + user.progress.food + user.progress.fun;
    }, 0);
    const averageProgress = totalUsers > 0 ? Math.round(totalProgress / (totalUsers * 5)) : 0;
    const totalChallenges = users.reduce((sum, user) => sum + (user.challenges?.length || 0), 0);

    return {
      totalUsers,
      averageProgress,
      totalChallenges,
      totalProgress
    };
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/mafia-logo.png" 
                alt="MAFIA ACADEMY" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">두목 페이지</h1>
                <p className="text-muted-foreground">광교 구락부 관리자 패널</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로 가기
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
            <TabsTrigger value="stats">통계</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">등록된 멤버 수</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 달성률</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                  <p className="text-xs text-muted-foreground">전체 평균</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 챌린지</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalChallenges}</div>
                  <p className="text-xs text-muted-foreground">완료된 챌린지</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 진행도</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProgress}</div>
                  <p className="text-xs text-muted-foreground">누적 진행도</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>구락부 멤버들의 최근 활동 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => {
                    const userStats = calculateUserStats(user);
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-mafia-gold rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? '관리자' : '멤버'}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">{userStats.averageProgress}%</p>
                            <p className="text-sm text-muted-foreground">달성률</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 사용자 관리 탭 */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>새 사용자 추가</CardTitle>
                <CardDescription>새로운 구락부 멤버를 추가합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="userId">사용자 ID</Label>
                    <Input
                      id="userId"
                      value={newUser.id}
                      onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                      placeholder="user123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userName">이름</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">이메일</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">역할</Label>
                    <Select value={newUser.role} onValueChange={(value: 'admin' | 'member') => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">멤버</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddUser} className="mt-4">
                  <UserPlus className="w-4 h-4 mr-2" />
                  사용자 추가
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>사용자 목록</CardTitle>
                <CardDescription>등록된 모든 사용자를 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const userStats = calculateUserStats(user);
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-mafia-gold rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? '관리자' : '멤버'}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">{userStats.averageProgress}%</p>
                            <p className="text-sm text-muted-foreground">달성률</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 통계 탭 */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 통계</CardTitle>
                </CardHeader>
                <CardContent>
                                     <div className="space-y-4">
                     {categories.map((category) => {
                       const categoryProgress = users.reduce((sum, user) => {
                         if (!user.progress) return sum;
                         return sum + user.progress[category.id];
                       }, 0);
                       const averageProgress = users.length > 0 ? Math.round(categoryProgress / users.length) : 0;
                       
                       return (
                         <div key={category.id} className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <span className="text-lg">{category.emoji}</span>
                             <span>{category.koreanName}</span>
                           </div>
                           <div className="text-right">
                             <p className="font-medium">{averageProgress}%</p>
                             <p className="text-sm text-muted-foreground">평균</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>사용자별 상세 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => {
                      const userStats = calculateUserStats(user);
                      return (
                        <div key={user.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? '관리자' : '멤버'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>달성률: {userStats.averageProgress}%</div>
                            <div>챌린지: {userStats.totalChallenges}개</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 설정 탭 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>시스템 설정</CardTitle>
                <CardDescription>구락부 시스템 설정을 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">자동 백업</p>
                      <p className="text-sm text-muted-foreground">데이터 자동 백업 설정</p>
                    </div>
                    <Button variant="outline">설정</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">알림 설정</p>
                      <p className="text-sm text-muted-foreground">이메일 및 푸시 알림 설정</p>
                    </div>
                    <Button variant="outline">설정</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">데이터 내보내기</p>
                      <p className="text-sm text-muted-foreground">모든 데이터를 CSV로 내보내기</p>
                    </div>
                    <Button variant="outline">내보내기</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BossPage; 