import React from 'react';
import { QuizQuestion as QuizQuestionType } from '../types/quiz';
import { AnswerPill } from './AnswerPill';
import * as Icons from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswers: string | string[];
  onAnswerSelect: (answerId: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect
}) => {
  const isSelected = (answerId: string) => {
    if (question.type === 'single') {
      return selectedAnswers === answerId;
    }
    return Array.isArray(selectedAnswers) && selectedAnswers.includes(answerId);
  };

  // Get the icon component dynamically
  const IconComponent = question.icon ? (Icons as any)[question.icon] : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        {IconComponent && (
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            {question.title}
          </h2>
          {question.subtitle && (
            <p className="text-gray-600 text-lg">
              {question.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-4">
        {question.answers.map((answer) => (
          <AnswerPill
            key={answer.id}
            label={answer.label}
            isSelected={isSelected(answer.id)}
            onClick={() => onAnswerSelect(answer.id)}
            type={question.type}
          />
        ))}
      </div>
    </div>
  );
};