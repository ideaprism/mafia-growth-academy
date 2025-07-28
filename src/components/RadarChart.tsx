import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChallengeCategory } from '@/types';
import { getCategoryConfig } from '@/lib/categories';
import { Dumbbell, PenTool, Briefcase, UtensilsCrossed, Gamepad2 } from 'lucide-react';

interface RadarChartProps {
  data: Record<ChallengeCategory, number>;
  className?: string;
  onCategoryClick?: (category: ChallengeCategory) => void;
}

export const UserRadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  className = "",
  onCategoryClick 
}) => {
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

  const chartData = Object.entries(data).map(([category, percentage]) => {
    const config = getCategoryConfig(category as ChallengeCategory);
    return {
      category: config.koreanName,
      icon: config.icon,
      value: percentage,
      fullMark: 100,
      originalCategory: category as ChallengeCategory
    };
  });

  // 커스텀 틱 렌더링 함수
  const renderCustomTick = ({ payload, x, y, textAnchor, ...props }: any) => {
    const dataPoint = chartData.find(item => item.category === payload.value);
    if (!dataPoint) return null;

    // 각 축의 위치에 따라 오프셋 조정
    let emojiOffset = 0;
    let textOffset = 0;
    
    // 축의 위치에 따른 오프셋 계산 (레이더 차트의 각도 기반)
    if (payload.value === '운동') {
      // 상단 축 (90도)
      emojiOffset = -40;
      textOffset = -20;
    } else if (payload.value === '글쓰기') {
      // 우상단 축 (162도)
      emojiOffset = -25;
      textOffset = -10;
    } else if (payload.value === '작업') {
      // 우측 축 (234도)
      emojiOffset = 5;
      textOffset = 20;
    } else if (payload.value === '맛집') {
      // 우하단 축 (306도)
      emojiOffset = 30;
      textOffset = 45;
    } else if (payload.value === '놀기') {
      // 하단 축 (18도)
      emojiOffset = 35;
      textOffset = 50;
    }

    const handleClick = () => {
      if (onCategoryClick) {
        onCategoryClick(dataPoint.originalCategory);
      }
    };

    return (
      <g 
        transform={`translate(${x},${y})`}
        className={onCategoryClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        onClick={handleClick}
      >
        {/* SVG 아이콘 렌더링 */}
        {dataPoint.icon === 'Dumbbell' && (
          <g transform={`translate(${-10},${emojiOffset - 10})`}>
            <rect x="6" y="8" width="8" height="4" fill="hsl(var(--foreground))" />
            <rect x="4" y="6" width="4" height="8" fill="hsl(var(--foreground))" />
            <rect x="12" y="6" width="4" height="8" fill="hsl(var(--foreground))" />
          </g>
        )}
        {dataPoint.icon === 'PenTool' && (
          <g transform={`translate(${-10},${emojiOffset - 10})`}>
            <path d="M6 18l8-8 2 2-8 8-2-2z" fill="hsl(var(--foreground))" />
            <circle cx="16" cy="4" r="1.5" fill="hsl(var(--foreground))" />
          </g>
        )}
        {dataPoint.icon === 'Briefcase' && (
          <g transform={`translate(${-10},${emojiOffset - 10})`}>
            <rect x="4" y="8" width="12" height="8" fill="hsl(var(--foreground))" />
            <rect x="6" y="6" width="8" height="2" fill="hsl(var(--foreground))" />
          </g>
        )}
        {dataPoint.icon === 'UtensilsCrossed' && (
          <g transform={`translate(${-10},${emojiOffset - 10})`}>
            <rect x="6" y="4" width="2" height="12" fill="hsl(var(--foreground))" />
            <rect x="12" y="4" width="2" height="12" fill="hsl(var(--foreground))" />
            <rect x="5" y="14" width="4" height="2" fill="hsl(var(--foreground))" />
            <rect x="11" y="14" width="4" height="2" fill="hsl(var(--foreground))" />
          </g>
        )}
        {dataPoint.icon === 'Gamepad2' && (
          <g transform={`translate(${-10},${emojiOffset - 10})`}>
            <rect x="4" y="6" width="12" height="8" rx="1" fill="hsl(var(--foreground))" />
            <circle cx="7" cy="8" r="1" fill="hsl(var(--background))" />
            <circle cx="10" cy="8" r="1" fill="hsl(var(--background))" />
            <circle cx="13" cy="8" r="1" fill="hsl(var(--background))" />
            <rect x="6" y="12" width="8" height="1" rx="0.5" fill="hsl(var(--background))" />
          </g>
        )}
        <text
          x={0}
          y={textOffset}
          textAnchor={textAnchor}
          fill="hsl(var(--foreground))"
          fontSize={16}
          fontWeight={600}
          className={onCategoryClick ? "cursor-pointer" : ""}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
          <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeWidth={1}
            className="opacity-50"
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={renderCustomTick}
            className="text-foreground"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 10
            }}
            tickCount={5}
          />
          <Radar
            name="달성률"
            dataKey="value"
            stroke="hsl(var(--mafia-gold))"
            fill="hsl(var(--mafia-gold))"
            fillOpacity={0.15}
            strokeWidth={3}
            dot={{ 
              fill: 'hsl(var(--mafia-gold))', 
              strokeWidth: 2, 
              stroke: 'hsl(var(--mafia-gold-dark))',
              r: 5
            }}
          />
          {/* 클릭 가능한 영역 추가 */}
          {onCategoryClick && chartData.map((dataPoint, index) => {
            const angle = (index * 72) - 90; // 5개 카테고리를 72도씩 배치
            const radius = 120; // 클릭 영역의 반지름
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <circle
                key={`click-${dataPoint.originalCategory}`}
                cx={x}
                cy={y}
                r={25}
                fill="transparent"
                stroke="transparent"
                className="cursor-pointer hover:fill-current hover:fill-opacity-10 transition-all duration-200"
                onClick={() => onCategoryClick(dataPoint.originalCategory)}
                style={{ pointerEvents: 'all' }}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};