import React from 'react';
import { QuizQuestion as QuizQuestionType } from '../types/quiz';
import { AnswerPill } from './AnswerPill';

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-gray-600 text-lg">
            {question.subtitle}
          </p>
        )}
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