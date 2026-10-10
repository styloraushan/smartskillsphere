import React from 'react';
import { GraduationCap, Star, FileText, Trophy } from 'lucide-react';

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StatisticsRowProps {
  stats?: StatItem[];
  className?: string;
}

const DEFAULT_DEMO_STATS: StatItem[] = [
  {
    id: 'students',
    value: '50K+',
    label: 'Students',
    icon: GraduationCap,
  },
  {
    id: 'rating',
    value: '4.8/5',
    label: 'Rating',
    icon: Star,
  },
  {
    id: 'resources',
    value: '1000+',
    label: 'Resources',
    icon: FileText,
  },
  {
    id: 'quizzes',
    value: '500+',
    label: 'Quizzes',
    icon: Trophy,
  },
];

export const StatisticsRow: React.FC<StatisticsRowProps> = ({
  stats = DEFAULT_DEMO_STATS,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-3 ${className}`}
      aria-label="Platform Statistics"
    >
      {stats.map((item) => {
        const IconComponent = item.icon;
        const isStar = item.id === 'rating';

        return (
          <div key={item.id} className="flex items-center gap-3 select-none group">
            {/* Circular gold icon on subtle dark circular background */}
            <div className="w-11 h-11 rounded-full bg-[#142536] border border-[#D5A94F]/40 flex items-center justify-center text-[#D5A94F] shrink-0 shadow-[0_0_12px_rgba(213,169,79,0.22)] group-hover:border-[#F5D982] transition-colors">
              <IconComponent
                className={`w-5 h-5 ${isStar ? 'fill-[#D5A94F]' : ''}`}
              />
            </div>

            {/* Metric Value & Muted Label */}
            <div>
              <div className="text-lg sm:text-xl font-bold font-display text-white tracking-tight leading-tight">
                {item.value}
              </div>
              <div className="text-xs text-[#AAB4C2] font-medium leading-tight">
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

