import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  onBack,
  showBack = true,
  currentStep
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && currentStep > 0 ? (
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            ) : (
              <div className="w-10 h-10" /> // Spacer
            )}
            
            <Logo className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};