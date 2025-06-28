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
      {/* Heart inside leaf logo */}
      <div className={`relative ${className}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer leaf shape */}
          <path
            d="M16 4C20 4 26 8 26 16C26 20 22 26 16 28C10 26 6 20 6 16C6 8 12 4 16 4Z"
            fill="currentColor"
            className="text-white"
            opacity="0.9"
          />
          
          {/* Inner heart shape */}
          <path
            d="M16 20C16 20 12 16 12 13C12 11 13.5 10 15 10C15.5 10 16 10.5 16 10.5C16 10.5 16.5 10 17 10C18.5 10 20 11 20 13C20 16 16 20 16 20Z"
            fill="currentColor"
            className="text-purple-300"
            opacity="1"
          />
          
          {/* Subtle leaf vein */}
          <path
            d="M16 6L16 26"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white"
            opacity="0.4"
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