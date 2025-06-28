import { useState, useCallback } from 'react';
import { QuizState } from '../types/quiz';
import { quizQuestions } from '../data/quizQuestions';

export const useQuiz = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: -1, // -1 for welcome screen
    answers: {},
    isComplete: false
  });

  const startQuiz = useCallback(() => {
    setQuizState(prev => ({ ...prev, currentStep: 0 }));
  }, []);

  const selectAnswer = useCallback((questionId: string, answerId: string) => {
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) return;

    setQuizState(prev => {
      const newAnswers = { ...prev.answers };
      
      if (question.type === 'single') {
        newAnswers[questionId] = answerId;
      } else {
        const currentAnswers = (newAnswers[questionId] as string[]) || [];
        if (currentAnswers.includes(answerId)) {
          newAnswers[questionId] = currentAnswers.filter(id => id !== answerId);
        } else {
          newAnswers[questionId] = [...currentAnswers, answerId];
        }
      }
      
      return { ...prev, answers: newAnswers };
    });
  }, []);

  const nextStep = useCallback(() => {
    setQuizState(prev => {
      const nextStep = prev.currentStep + 1;
      const isComplete = nextStep >= quizQuestions.length;
      
      // Store quiz answers in localStorage when quiz is complete
      if (isComplete) {
        localStorage.setItem('quizAnswers', JSON.stringify(prev.answers));
      }
      
      return {
        ...prev,
        currentStep: nextStep,
        isComplete
      };
    });
  }, []);

  const previousStep = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentStep: Math.max(-1, prev.currentStep - 1)
    }));
  }, []);

  const restartQuiz = useCallback(() => {
    // Clear stored answers
    localStorage.removeItem('quizAnswers');
    
    setQuizState({
      currentStep: -1,
      answers: {},
      isComplete: false
    });
  }, []);

  const canProceed = useCallback(() => {
    if (quizState.currentStep < 0 || quizState.currentStep >= quizQuestions.length) {
      return false;
    }
    
    const currentQuestion = quizQuestions[quizState.currentStep];
    const answer = quizState.answers[currentQuestion.id];
    
    if (currentQuestion.type === 'single') {
      return typeof answer === 'string' && answer.length > 0;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  }, [quizState]);

  return {
    quizState,
    currentQuestion: quizState.currentStep >= 0 ? quizQuestions[quizState.currentStep] : null,
    startQuiz,
    selectAnswer,
    nextStep,
    previousStep,
    restartQuiz,
    canProceed: canProceed(),
    totalSteps: quizQuestions.length
  };
};