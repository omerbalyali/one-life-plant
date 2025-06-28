import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-8 h-8", 
  showText = true,
  textColor = "text-white"
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Heart-shaped leaf logo */}
      <div className={`relative ${className}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left leaf forming left side of heart */}
          <path
            d="M8 16C8 10 12 6 16 6C16 6 16 10 16 16C16 16 12 20 8 16Z"
            fill="currentColor"
            className="text-white"
            opacity="0.9"
          />
          {/* Right leaf forming right side of heart */}
          <path
            d="M24 16C24 10 20 6 16 6C16 6 16 10 16 16C16 16 20 20 24 16Z"
            fill="currentColor"
            className="text-white"
            opacity="0.9"
          />
          {/* Stem/bottom point of heart */}
          <path
            d="M16 16C16 16 16 20 16 26C16 26 14 24 16 16Z"
            fill="currentColor"
            className="text-white"
            opacity="0.7"
          />
          {/* Leaf veins for detail */}
          <path
            d="M12 12C12 12 14 14 16 16"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white"
            opacity="0.6"
          />
          <path
            d="M20 12C20 12 18 14 16 16"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`text-2xl font-bold ${textColor}`}>
          SoilMate
        </span>
      )}
    </div>
  );
};