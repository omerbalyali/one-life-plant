import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizHeader } from './components/QuizHeader';
import { QuizQuestion } from './components/QuizQuestion';
import { ResultsScreen } from './components/ResultsScreen';
import { ChevronRight } from 'lucide-react';

function App() {
  const {
    quizState,
    currentQuestion,
    startQuiz,
    selectAnswer,
    nextStep,
    previousStep,
    restartQuiz,
    canProceed,
    totalSteps
  } = useQuiz();

  // Welcome screen
  if (quizState.currentStep === -1) {
    return <WelcomeScreen onStart={startQuiz} />;
  }

  // Results screen
  if (quizState.isComplete) {
    return <ResultsScreen onRestart={restartQuiz} />;
  }

  // Quiz screen
  if (!currentQuestion) {
    return null;
  }

  const selectedAnswers = quizState.answers[currentQuestion.id] || (currentQuestion.type === 'multiple' ? [] : '');
  const progress = ((quizState.currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <QuizHeader
        currentStep={quizState.currentStep}
        totalSteps={totalSteps}
        onBack={previousStep}
        showBack={quizState.currentStep > 0}
      />

      <div className="max-w-lg mx-auto p-4 py-8">
        {/* Progress bar moved here - no selection info */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <QuizQuestion
            question={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={(answerId) => selectAnswer(currentQuestion.id, answerId)}
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`
              w-full font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2
              ${canProceed
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 shadow-lg shadow-purple-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {quizState.currentStep === totalSteps - 1 ? 'See My Matches' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>

          {currentQuestion.type === 'multiple' && (
            <p className="text-center text-sm text-gray-500">
              Select all that apply
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;