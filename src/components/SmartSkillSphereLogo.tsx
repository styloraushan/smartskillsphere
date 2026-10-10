import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  lightMode?: boolean;
  goldCaps?: boolean;
}

export const SmartSkillSphereLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  lightMode = false,
  goldCaps = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Sphere Logo Glyph */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          {/* Outer dark obsidian circle */}
          <circle cx="24" cy="24" r="22" fill="#111214" stroke="#C9A45C" strokeWidth="1.5" />
          
          {/* Orbital golden latitude ellipses */}
          <ellipse cx="24" cy="24" rx="19" ry="8" stroke="#C9A45C" strokeWidth="1.2" strokeDasharray="3 2" />
          <ellipse cx="24" cy="24" rx="8" ry="19" stroke="#C9A45C" strokeWidth="1.2" />
          
          {/* Central faceted knowledge diamond */}
          <path
            d="M24 13L31 24L24 35L17 24Z"
            fill="#C9A45C"
            fillOpacity="0.25"
            stroke="#C9A45C"
            strokeWidth="1.5"
          />
          {/* Core luminescent vertex */}
          <circle cx="24" cy="24" r="2.5" fill="#C9A45C" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        {goldCaps ? (
          <span className="font-display font-extrabold tracking-wider text-[#C9A45C] text-sm sm:text-base uppercase">
            SMARTSKILLSPHERE
          </span>
        ) : (
          <div className={`font-display font-bold tracking-tight ${textSizes[size]} ${lightMode ? 'text-white' : 'text-[#111214]'}`}>
            <span>SmartSkill</span>
            <span className="text-[#C9A45C]">Sphere</span>
          </div>
        )}
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide text-[#25344A]/70 uppercase">
            Learn Smart · Practice Daily
          </span>
        )}
      </div>
    </div>
  );
};
