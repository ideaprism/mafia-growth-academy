import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Camera, Link, Upload, Dumbbell, PenTool, Briefcase, UtensilsCrossed, Gamepad2 } from 'lucide-react';
import { ChallengeCategory, CategoryConfig } from '@/types';
import { getAllCategories } from '@/lib/categories';
import { useToast } from '@/hooks/use-toast';

interface ChallengeCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: CategoryConfig;
    method: 'photo' | 'link';
    photo?: File;
    link?: string;
    description: string;
  }) => void;
}

export const ChallengeCertificationModal: React.FC<ChallengeCertificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  const [certificationMethod, setCertificationMethod] = useState<'photo' | 'link'>('photo');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = getAllCategories();

  // 폼 초기화 함수
  const resetForm = useCallback(() => {
    setSelectedCategory(null);
    setCertificationMethod('photo');
    setPhotoFile(null);
    setLinkUrl('');
    setDescription('');
    setIsDragOver(false);
  }, []);

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePhotoUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
    } else {
      toast({
        title: "잘못된 파일 형식",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handlePhotoUpload(files[0]);
    }
  }, []);

  const handleSubmit = () => {
    // 유효성 검사
    const errors: string[] = [];
    
    if (!selectedCategory) {
      errors.push("카테고리를 선택해주세요");
    }
    
    if (certificationMethod === 'photo' && !photoFile) {
      errors.push("사진을 업로드해주세요");
    }
    
    if (certificationMethod === 'link' && !linkUrl.trim()) {
      errors.push("링크를 입력해주세요");
    }

    if (errors.length > 0) {
      toast({
        title: "입력 항목을 확인해주세요",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // 제출 실행
    onSubmit({
      category: selectedCategory!,
      method: certificationMethod,
      photo: photoFile || undefined,
      link: certificationMethod === 'link' ? linkUrl : undefined,
      description
    });

    // 제출 후 폼 초기화
    resetForm();
  };

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'Dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'PenTool': return <PenTool className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      default: return <Dumbbell className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">챌린지 인증</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 카테고리 선택 - 드롭다운으로 변경 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">카테고리</h3>
            <Select value={selectedCategory?.id || ''} onValueChange={(value) => {
              const category = categories.find(cat => cat.id === value);
              setSelectedCategory(category || null);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.icon)}
                      <span>{category.koreanName}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        목표: {category.monthlyGoal}회
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 인증 방식 선택 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">인증 방식</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={certificationMethod === 'photo' ? "default" : "outline"}
                className={`h-auto p-4 ${
                  certificationMethod === 'photo' 
                    ? 'bg-yellow-500 text-black border-yellow-500' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setCertificationMethod('photo')}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span>사진 인증</span>
                </div>
              </Button>
              <Button
                variant={certificationMethod === 'link' ? "default" : "outline"}
                className={`h-auto p-4 ${
                  certificationMethod === 'link' 
                    ? 'bg-yellow-500 text-black border-yellow-500' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setCertificationMethod('link')}
              >
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  <span>링크 인증</span>
                </div>
              </Button>
            </div>
          </div>

          {/* 사진 업로드 - 드래그 앤 드롭 기능 추가 */}
          {certificationMethod === 'photo' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">사진 업로드</h3>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className={`w-8 h-8 ${isDragOver ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                  <p className={`text-sm ${isDragOver ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                    {isDragOver 
                      ? '파일을 여기에 놓으세요' 
                      : '클릭하여 사진 선택 또는 파일을 여기에 드래그하세요'
                    }
                  </p>
                </div>
                {photoFile && (
                  <div className="mt-4">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      {photoFile.name} 선택됨
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 링크 입력 */}
          {certificationMethod === 'link' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">링크 입력</h3>
              <Input
                type="url"
                placeholder="인증 링크를 입력하세요..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          )}

          {/* 설명 입력 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">설명 (선택사항)</h3>
            <Textarea
              placeholder="오늘의 도전에 대해 간단히 설명해주세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              취소
            </Button>
            <Button 
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={handleSubmit}
            >
              인증 완료
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 