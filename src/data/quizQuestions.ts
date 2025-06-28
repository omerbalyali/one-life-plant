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
    id: 'experience',
    title: 'What\'s your plant experience?',
    subtitle: 'This helps us recommend the right difficulty level',
    icon: 'GraduationCap',
    type: 'single',
    answers: [
      { id: 'beginner', label: 'Complete Beginner', value: 'beginner', icon: 'Seedling' },
      { id: 'some', label: 'Some Experience', value: 'some', icon: 'Sprout' },
      { id: 'experienced', label: 'Very Experienced', value: 'experienced', icon: 'TreePine' }
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
    id: 'style',
    title: 'What\'s your aesthetic preference?',
    subtitle: 'Choose all that appeal to you',
    icon: 'Palette',
    type: 'multiple',
    answers: [
      { id: 'minimalist', label: 'Minimalist', value: 'minimalist', icon: 'Square' },
      { id: 'tropical', label: 'Tropical', value: 'tropical', icon: 'Palmtree' },
      { id: 'desert', label: 'Desert/Succulent', value: 'desert', icon: 'Cactus' },
      { id: 'cottage', label: 'Cottage Core', value: 'cottage', icon: 'Flower' },
      { id: 'modern', label: 'Modern', value: 'modern', icon: 'Triangle' }
    ]
  },
  {
    id: 'colors',
    title: 'Which colors inspire you?',
    subtitle: 'This helps match your plant to your space',
    icon: 'Paintbrush',
    type: 'multiple',
    answers: [
      { id: 'green', label: 'Deep Greens', value: 'green', color: '#059669' },
      { id: 'patterned', label: 'Patterned', value: 'patterned', color: 'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6, #f59e0b)' },
      { id: 'purple', label: 'Purple Tones', value: 'purple', color: '#7c3aed' },
      { id: 'silver', label: 'Silver/Gray', value: 'silver', color: '#6b7280' },
      { id: 'red', label: 'Red Accents', value: 'red', color: '#dc2626' }
    ]
  },
  {
    id: 'lifestyle',
    title: 'What describes your lifestyle?',
    subtitle: 'Choose all that apply',
    icon: 'User',
    type: 'multiple',
    answers: [
      { id: 'busy', label: 'Always Busy', value: 'busy', icon: 'Clock' },
      { id: 'homebody', label: 'Love Being Home', value: 'homebody', icon: 'Home' },
      { id: 'traveler', label: 'Frequent Traveler', value: 'traveler', icon: 'Plane' },
      { id: 'social', label: 'Love Entertaining', value: 'social', icon: 'Users' },
      { id: 'peaceful', label: 'Seek Tranquility', value: 'peaceful', icon: 'Heart' }
    ]
  }
];