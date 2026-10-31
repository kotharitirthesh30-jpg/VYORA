import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-wider',
    md: 'text-xl font-extrabold tracking-wider',
    lg: 'text-2xl font-extrabold tracking-widest',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Connected Intelligence Glyph */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-lg bg-gradient-to-br from-[#171925] to-[#10111A] border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-5/6 h-5/6">
          {/* Subtle hexagonal node nexus */}
          <path
            d="M16 4L26 9.5V22.5L16 28L6 22.5V9.5L16 4Z"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Central Connected Core */}
          <circle cx="16" cy="16" r="3.5" fill="#22D3EE" />
          <path
            d="M16 7V12.5M16 19.5V25M8 11.5L13 14.5M19 17.5L24 20.5M8 20.5L13 17.5M19 14.5L24 11.5"
            stroke="#8B5CF6"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${textSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F5FA] to-[#22D3EE]`}>
            VYORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-[10px] text-[#999BAE] font-medium tracking-wide mt-0.5">
            Your Intelligence, Connected
          </span>
        )}
      </div>
    </div>
  );
};
