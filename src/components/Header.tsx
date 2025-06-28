import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo className="w-10 h-10" />
          
          {currentStep !== undefined && totalSteps !== undefined && (
            <div className="text-white/80 text-sm font-medium">
              {currentStep + 1} of {totalSteps}
            </div>
          )}
        </div>
        
        {currentStep !== undefined && totalSteps !== undefined && (
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};