import React from 'react';

export interface CategoryCardProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  label,
  icon: Icon,
  bgColor,
  iconColor,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1.5 hover:border-[#D5A94F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A94F] transition-all duration-200 flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer group w-full select-none ${className}`}
      aria-label={`Explore category ${label}`}
    >
      {/* Centered circular icon background */}
      <div
        className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform shadow-sm shrink-0`}
      >
        <Icon className="w-7 h-7 stroke-[2.2]" />
      </div>

      {/* Category title underneath */}
      <span className="text-sm sm:text-base font-semibold text-[#182538] group-hover:text-[#D5A94F] transition-colors whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};

