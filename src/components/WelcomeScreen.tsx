import React from 'react';
import { Leaf, Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Leaf className="w-20 h-20 text-emerald-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800">
            Find Your Perfect
            <span className="block text-emerald-600">Plant Match</span>
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Answer a few questions about your lifestyle, space, and preferences. 
            We'll recommend the perfect plants for you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Expert Curated</span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-200"
          >
            Start Plant Quiz
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Takes about 2 minutes • Completely free
        </p>
      </div>
    </div>
  );
};