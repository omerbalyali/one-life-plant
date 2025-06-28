import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Logo className="w-10 h-10" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Logo className="w-20 h-20" showText={false} />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white">
              Find Your Perfect
              <span className="block text-purple-200">Plant Match</span>
            </h1>
            
            <p className="text-purple-100 text-lg leading-relaxed">
              Answer a few questions about your lifestyle, space, and preferences. 
              We'll recommend the perfect plants for you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>Personalized</span>
              </div>
              <div className="flex items-center gap-2">
                <Logo className="w-4 h-4" showText={false} />
                <span>Expert Curated</span>
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full bg-white text-purple-700 font-semibold py-4 px-8 rounded-2xl hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start Plant Quiz
            </button>
          </div>

          <p className="text-xs text-purple-300">
            Takes about 2 minutes • Completely free
          </p>
        </div>
      </div>
    </div>
  );
};