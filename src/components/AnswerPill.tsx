import React from 'react';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AnswerPillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  type: 'single' | 'multiple';
  icon?: string;
  color?: string;
}

export const AnswerPill: React.FC<AnswerPillProps> = ({
  label,
  isSelected,
  onClick,
  type,
  icon,
  color
}) => {
  // Get the icon component dynamically
  const IconComponent = icon ? (Icons as any)[icon] : null;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${isSelected
          ? 'bg-emerald-50 border-emerald-300 text-gray-900 shadow-md'
          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {color ? (
            <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <div 
                className="w-full h-full"
                style={{ 
                  background: color.includes('gradient') ? color : color,
                  backgroundColor: !color.includes('gradient') ? color : undefined
                }}
              />
            </div>
          ) : IconComponent ? (
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${isSelected
                ? 'bg-emerald-200'
                : 'bg-emerald-100'
              }
            `}>
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`} />
            </div>
          ) : null}
          <span className="font-medium text-left">{label}</span>
        </div>
        
        {type === 'multiple' && (
          <div className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${isSelected
              ? 'border-emerald-600 bg-emerald-600'
              : 'border-gray-300'
            }
          `}>
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        )}
      </div>
    </button>
  );
};