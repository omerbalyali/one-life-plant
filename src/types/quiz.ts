export interface QuizAnswer {
  id: string;
  label: string;
  value: string;
  icon?: string;
  color?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  type: 'single' | 'multiple';
  answers: QuizAnswer[];
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, string | string[]>;
  isComplete: boolean;
}