import { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'location',
    title: 'Where will your plant live?',
    subtitle: 'This helps us understand the environment',
    type: 'single',
    answers: [
      { id: 'indoor', label: 'Indoor', value: 'indoor' },
      { id: 'outdoor', label: 'Outdoor', value: 'outdoor' },
      { id: 'both', label: 'Both', value: 'both' }
    ]
  },
  {
    id: 'lighting',
    title: 'How much natural light is available?',
    subtitle: 'Consider the brightest spot where you\'ll place it',
    type: 'single',
    answers: [
      { id: 'low', label: 'Low Light', value: 'low' },
      { id: 'medium', label: 'Medium Light', value: 'medium' },
      { id: 'bright', label: 'Bright Light', value: 'bright' },
      { id: 'direct', label: 'Direct Sunlight', value: 'direct' }
    ]
  },
  {
    id: 'maintenance',
    title: 'How much care can you provide?',
    subtitle: 'Be honest about your availability',
    type: 'single',
    answers: [
      { id: 'low', label: 'Low Maintenance', value: 'low' },
      { id: 'medium', label: 'Medium Care', value: 'medium' },
      { id: 'high', label: 'High Maintenance', value: 'high' }
    ]
  },
  {
    id: 'experience',
    title: 'What\'s your plant experience?',
    subtitle: 'This helps us recommend the right difficulty level',
    type: 'single',
    answers: [
      { id: 'beginner', label: 'Complete Beginner', value: 'beginner' },
      { id: 'some', label: 'Some Experience', value: 'some' },
      { id: 'experienced', label: 'Very Experienced', value: 'experienced' }
    ]
  },
  {
    id: 'style',
    title: 'What\'s your aesthetic preference?',
    subtitle: 'Choose all that appeal to you',
    type: 'multiple',
    answers: [
      { id: 'minimalist', label: 'Minimalist', value: 'minimalist' },
      { id: 'tropical', label: 'Tropical', value: 'tropical' },
      { id: 'desert', label: 'Desert/Succulent', value: 'desert' },
      { id: 'cottage', label: 'Cottage Core', value: 'cottage' },
      { id: 'modern', label: 'Modern', value: 'modern' }
    ]
  },
  {
    id: 'colors',
    title: 'Which colors inspire you?',
    subtitle: 'This helps match your plant to your space',
    type: 'multiple',
    answers: [
      { id: 'green', label: 'Deep Greens', value: 'green' },
      { id: 'variegated', label: 'Variegated', value: 'variegated' },
      { id: 'purple', label: 'Purple Tones', value: 'purple' },
      { id: 'silver', label: 'Silver/Gray', value: 'silver' },
      { id: 'red', label: 'Red Accents', value: 'red' }
    ]
  },
  {
    id: 'lifestyle',
    title: 'What describes your lifestyle?',
    subtitle: 'Choose all that apply',
    type: 'multiple',
    answers: [
      { id: 'busy', label: 'Always Busy', value: 'busy' },
      { id: 'homebody', label: 'Love Being Home', value: 'homebody' },
      { id: 'traveler', label: 'Frequent Traveler', value: 'traveler' },
      { id: 'social', label: 'Love Entertaining', value: 'social' },
      { id: 'peaceful', label: 'Seek Tranquility', value: 'peaceful' }
    ]
  }
];