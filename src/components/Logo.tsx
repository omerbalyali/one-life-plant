import React from 'react';
import { Leaf } from 'lucide-react';

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
      {/* Lucide Leaf icon */}
      <Leaf className={`${className} ${textColor}`} />
      
      {showText && (
        <span 
          className={`text-2xl font-bold ${textColor} font-playwrite`}
        >
          SoilMate
        </span>
      )}
    </div>
  );
};