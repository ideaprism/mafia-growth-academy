import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Crown, Users, HelpCircle } from 'lucide-react';
import { User } from '@/types';
import { generateId, findUserByNameAndFamily, saveUser, setCurrentUser, getAllUsers } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { UserGuideModal } from './UserGuideModal';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [family, setFamily] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 기존 사용자 목록 로드
    const users = getAllUsers();
    setExistingUsers(users);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !family.trim()) {
      toast({
        title: "입력 오류",
        description: "이름과 패밀리명을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already exists
      let user = findUserByNameAndFamily(name.trim(), family.trim());
      
      if (user) {
        toast({
          title: "복귀를 환영합니다!",
          description: `${family} 패밀리의 ${name}님, 다시 만나서 반갑습니다.`,
        });
      } else {
        // Create new user
        user = {
          id: generateId(),
          name: name.trim(),
          family: family.trim(),
          createdAt: new Date().toISOString()
        };
        
        saveUser(user);
        
        toast({
          title: "패밀리 가입 완료!",
          description: `${family} 패밀리에 오신 것을 환영합니다, ${name}님!`,
        });
      }

      setCurrentUser(user);
      onLogin(user);
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUserLogin = (user: User) => {
    setCurrentUser(user);
    onLogin(user);
    toast({
      title: "복귀를 환영합니다!",
      description: `${user.family}의 ${user.name}님, 다시 만나서 반갑습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* 로고 및 제목 섹션 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center relative">
            <img 
              src="/mafia-logo.png" 
              alt="MAFIA ACADEMY" 
              className="w-40 h-32 object-contain drop-shadow-lg"
            />
            {/* 이용안내 아이콘 */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 text-mafia-gold hover:text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => setShowUserGuide(true)}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-mafia-gold mb-2">마피아 연수원</h1>
            <p className="text-muted-foreground text-sm">광교 구락부 마피아들의 비밀 아지트</p>
          </div>
        </div>

        {/* 새 계정 생성 폼 */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5 text-mafia-gold" />
              새로운 마피아 등록
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              새로운 코드네임으로 연수원에 입장하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-mafia-gold" />
                  이름 (코드네임)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="당신의 코드네임을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border focus:border-mafia-gold focus:ring-mafia-gold/20"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family" className="text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-mafia-gold" />
                  구락부 (선택사항)
                </Label>
                <Input
                  id="family"
                  type="text"
                  placeholder="소속 구락부를 입력하세요"
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                  className="bg-input border-border focus:border-mafia-gold focus:ring-mafia-gold/20"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                variant="mafia" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '입장 중...' : '연수원 입장'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 기존 계정 로그인 섹션 */}
        {existingUsers.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground text-center">기존 계정으로 로그인</h2>
            <div className="space-y-2">
              {existingUsers.map((user) => (
                <Card 
                  key={user.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-mafia-gold/30 bg-card/50"
                  onClick={() => handleExistingUserLogin(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.family}</p>
                      </div>
                      <Crown className="w-4 h-4 text-mafia-gold" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 이용안내 모달 */}
      <UserGuideModal 
        isOpen={showUserGuide} 
        onClose={() => setShowUserGuide(false)} 
      />
    </div>
  );
};