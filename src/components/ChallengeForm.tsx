import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Link, Upload, X, Dumbbell, PenTool, Briefcase, UtensilsCrossed, Gamepad2 } from 'lucide-react';
import { Challenge, ChallengeCategory, User } from '@/types';
import { getCategoryConfig } from '@/lib/categories';
import { generateId, saveChallenge, getCurrentDate } from '@/lib/storage';
import { compressImage, validateImageFile, validateUrl } from '@/lib/imageUtils';
import { useToast } from '@/hooks/use-toast';

interface ChallengeFormProps {
  user: User;
  category: ChallengeCategory;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({ 
  user, 
  category, 
  onSuccess, 
  onCancel 
}) => {
  const [type, setType] = useState<'photo' | 'link'>('photo');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categoryConfig = getCategoryConfig(category);

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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
    } catch (error) {
      toast({
        title: "이미지 오류",
        description: error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
    } catch (error) {
      toast({
        title: "이미지 오류",
        description: error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'photo' && !imagePreview) {
      toast({
        title: "이미지 필요",
        description: "인증할 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (type === 'link' && !url.trim()) {
      toast({
        title: "링크 필요",
        description: "인증할 링크를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (type === 'link' && !validateUrl(url.trim())) {
      toast({
        title: "잘못된 링크",
        description: "올바른 URL 형식을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const challenge: Challenge = {
        id: generateId(),
        userId: user.id,
        category,
        type,
        content: type === 'photo' ? imagePreview : url.trim(),
        description: description.trim() || undefined,
        createdAt: new Date().toISOString(),
        date: getCurrentDate()
      };

      saveChallenge(challenge);

      toast({
        title: "챌린지 완료!",
        description: `${categoryConfig.koreanName} 챌린지가 성공적으로 인증되었습니다.`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "제출 실패",
        description: "챌린지 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          {getCategoryIcon(categoryConfig.icon)}
          {categoryConfig.koreanName} 챌린지
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {categoryConfig.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={type} onValueChange={(value) => setType(value as 'photo' | 'link')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                사진 인증
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                링크 인증
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">사진 업로드</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-mafia-gold/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        사진을 드래그하거나 클릭하여 업로드하세요
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP (최대 10MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-foreground">링크 URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-input border-border focus:border-mafia-gold focus:ring-mafia-gold/20"
                />
                <p className="text-xs text-muted-foreground">
                  블로그, 유튜브, 기타 관련 링크를 입력하세요
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">설명 (선택사항)</Label>
            <Textarea
              id="description"
              placeholder="오늘의 챌린지에 대한 설명을 자유롭게 작성해보세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border focus:border-mafia-gold focus:ring-mafia-gold/20 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="mafia"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '챌린지 완료'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};