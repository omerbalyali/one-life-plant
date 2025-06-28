import { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'location',
    title: 'Where will your plant live?',
    subtitle: 'This helps us understand the environment',
    icon: 'MapPin',
    type: 'single',
    answers: [
      { id: 'indoor', label: 'Indoor', value: 'indoor', icon: 'Home' },
      { id: 'outdoor', label: 'Outdoor', value: 'outdoor', icon: 'Trees' },
      { id: 'both', label: 'Both', value: 'both', icon: 'ArrowLeftRight' }
    ]
  },
  {
    id: 'lighting',
    title: 'How much natural light is available?',
    subtitle: 'Consider the brightest spot where you\'ll place it',
    icon: 'Sun',
    type: 'single',
    answers: [
      { id: 'low', label: 'Low Light', value: 'low', icon: 'Moon' },
      { id: 'medium', label: 'Medium Light', value: 'medium', icon: 'Cloud' },
      { id: 'bright', label: 'Bright Light', value: 'bright', icon: 'Sun' },
      { id: 'direct', label: 'Direct Sunlight', value: 'direct', icon: 'Zap' }
    ]
  },
  {
    id: 'maintenance',
    title: 'How much care can you provide?',
    subtitle: 'Be honest about your availability',
    icon: 'Clock',
    type: 'single',
    answers: [
      { id: 'low', label: 'Low Maintenance', value: 'low', icon: 'Battery' },
      { id: 'medium', label: 'Medium Care', value: 'medium', icon: 'BatteryMedium' },
      { id: 'high', label: 'High Maintenance', value: 'high', icon: 'BatteryFull' }
    ]
  },
  {
    id: 'pets',
    title: 'Do you have pets?',
    subtitle: 'We\'ll only recommend non-toxic plants to keep your furry friends safe',
    icon: 'Heart',
    type: 'single',
    answers: [
      { id: 'yes', label: 'Yes, I have pets', value: 'yes', icon: 'Dog' },
      { id: 'no', label: 'No pets', value: 'no', icon: 'X' }
    ]
  },
  {
    id: 'style',
    title: 'What\'s your aesthetic preference?',
    subtitle: 'Choose all that appeal to you',
    icon: 'Palette',
    type: 'multiple',
    answers: [
      { id: 'minimalist', label: 'Minimalist', value: 'minimalist', icon: 'Circle' },
      { id: 'tropical', label: 'Tropical', value: 'tropical', icon: 'Palmtree' },
      { id: 'desert', label: 'Desert/Succulent', value: 'desert', icon: 'Triangle' },
      { id: 'cottage', label: 'Cottage Core', value: 'cottage', icon: 'Flower' },
      { id: 'modern', label: 'Modern', value: 'modern', icon: 'Square' }
    ]
  }
];