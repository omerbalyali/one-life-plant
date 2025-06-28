import React from 'react';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AnswerPillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  type: 'single' | 'multiple';
  icon?: string;
}

export const AnswerPill: React.FC<AnswerPillProps> = ({
  label,
  isSelected,
  onClick,
  type,
  icon
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
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${isSelected
                ? 'bg-white/20'
                : 'bg-emerald-100'
              }
            `}>
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
            </div>
          )}
          <span className="font-medium text-left">{label}</span>
        </div>
        
        {type === 'multiple' && (
          <div className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${isSelected
              ? 'border-white bg-white'
              : 'border-gray-300'
            }
          `}>
            {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
          </div>
        )}
      </div>
    </button>
  );
};