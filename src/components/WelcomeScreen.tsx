import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      {/* Header with darker purple */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Logo className="w-10 h-10" />
        </div>
      </div>

      {/* Main content with light purple background */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Logo className="w-12 h-12" showText={false} textColor="text-purple-700" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse drop-shadow-sm" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-purple-800 leading-tight">
              Find Your Perfect
              <span className="block text-purple-600 font-playwrite text-3xl mt-2">Plant Match</span>
            </h1>
            
            <p className="text-purple-700 text-lg leading-relaxed max-w-sm mx-auto">
              Answer a few questions about your lifestyle, space, and preferences. 
              We'll recommend the perfect plants for you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-8 text-sm text-purple-600">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="font-medium">Personalized</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <Logo className="w-4 h-4" showText={false} textColor="text-purple-600" />
                <span className="font-medium">Expert Curated</span>
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full bg-white text-purple-700 font-bold py-5 px-8 rounded-2xl hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-purple-200"
            >
              <span className="text-lg">Start Plant Quiz</span>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-purple-600/80 font-medium">
              Takes about 2 minutes • Completely free
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-purple-400/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};