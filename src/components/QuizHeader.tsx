import React from 'react';
import { Leaf, ArrowLeft } from 'lucide-react';

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentStep,
  totalSteps,
  onBack,
  showBack = true
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        {showBack && currentStep > 0 ? (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">PlantMatch</span>
          </div>
        )}
        
        <div className="text-sm text-gray-500 font-medium">
          {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};