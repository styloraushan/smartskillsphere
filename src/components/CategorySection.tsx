import React, { useState } from 'react';
import { 
  Calculator, 
  Compass, 
  BookOpen, 
  Code2, 
  FileText, 
  LayoutGrid 
} from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { MoreTracksModal } from './MoreTracksModal';

interface CategorySectionProps {
  onNavigate: (tab: string, param?: string) => void;
  className?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onNavigate,
  className = '',
}) => {
  const [moreModalOpen, setMoreModalOpen] = useState(false);

  // 6 compact category cards matching exact prompt instructions
  const categories = [
    {
      id: 'practice_aptitude',
      label: 'Aptitude',
      icon: Calculator,
      bgColor: 'bg-[#FDF1D5]',
      iconColor: 'text-[#D5A94F]',
      onClick: () => onNavigate('practice_aptitude'),
    },
    {
      id: 'practice_reasoning',
      label: 'Reasoning',
      icon: Compass,
      bgColor: 'bg-[#FDE7D4]',
      iconColor: 'text-[#D06B22]',
      onClick: () => onNavigate('practice_reasoning'),
    },
    {
      id: 'practice_verbal',
      label: 'Verbal Ability',
      icon: BookOpen,
      bgColor: 'bg-[#DCFCE7]',
      iconColor: 'text-[#10B981]',
      onClick: () => onNavigate('practice_verbal'),
    },
    {
      id: 'practice_technical',
      label: 'Technical',
      icon: Code2,
      bgColor: 'bg-[#DBEAFE]',
      iconColor: 'text-[#3B82F6]',
      onClick: () => onNavigate('practice_technical'),
    },
    {
      id: 'current_affairs',
      label: 'Current Affairs',
      icon: FileText,
      bgColor: 'bg-[#D1FAE5]',
      iconColor: 'text-[#059669]',
      onClick: () => onNavigate('current_affairs'),
    },
    {
      id: 'more',
      label: 'More',
      icon: LayoutGrid,
      bgColor: 'bg-[#F1F5F9]',
      iconColor: 'text-[#64748B]',
      onClick: () => setMoreModalOpen(true),
    },
  ];

  return (
    <section 
      className={`bg-[#F5F8FC] pt-10 sm:pt-14 pb-14 sm:pb-18 border-b border-slate-200/60 ${className}`}
      aria-labelledby="explore-category-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Heading: Dark navy #182538, medium-bold, comfortable padding */}
        <div className="flex items-center justify-between">
          <h2
            id="explore-category-title"
            className="text-2xl sm:text-3xl font-bold font-display text-[#182538] tracking-tight"
          >
            Explore by Category
          </h2>

          <button
            onClick={() => setMoreModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#D5A94F] hover:text-[#B88728] transition-colors"
          >
            <span>View All Tracks</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* 6 Category Cards in a single row on desktop, responsive on tablet/mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
              icon={cat.icon}
              bgColor={cat.bgColor}
              iconColor={cat.iconColor}
              onClick={cat.onClick}
            />
          ))}
        </div>
      </div>

      {/* More Tracks Modal */}
      <MoreTracksModal
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        onNavigate={onNavigate}
      />
    </section>
  );
};

