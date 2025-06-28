import React from 'react';
import { Leaf, RefreshCw, Share2 } from 'lucide-react';

interface ResultsScreenProps {
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const recommendedPlants = [
    {
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      match: 95,
      image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
      reasons: ['Low maintenance', 'Low light tolerant', 'Air purifying']
    },
    {
      name: 'Pothos',
      scientificName: 'Epipremnum aureum',
      match: 88,
      image: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
      reasons: ['Easy to care for', 'Grows in various light', 'Beautiful trailing vines']
    },
    {
      name: 'ZZ Plant',
      scientificName: 'Zamioculcas zamiifolia',
      match: 82,
      image: 'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400',
      reasons: ['Drought tolerant', 'Low light friendly', 'Modern aesthetic']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Perfect Plant Matches!
          </h1>
          <p className="text-gray-600">
            Based on your preferences, here are our top recommendations
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {recommendedPlants.map((plant, index) => (
            <div
              key={plant.name}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex gap-4">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{plant.name}</h3>
                      <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{plant.match}%</div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plant.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Take Quiz Again
          </button>
          
          <button className="w-full bg-white text-rose-500 font-semibold py-4 px-8 rounded-2xl border-2 border-rose-500 hover:bg-rose-50 transition-all duration-300 flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
};