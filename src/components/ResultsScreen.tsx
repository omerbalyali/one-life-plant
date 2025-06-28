import React, { useState, useRef, useEffect } from 'react';
import { Leaf, RefreshCw, Share2, Check, X, Heart, ArrowLeft } from 'lucide-react';

interface ResultsScreenProps {
  onRestart: () => void;
}

interface Plant {
  id: string;
  name: string;
  scientificName: string;
  match: number;
  image: string;
  reasons: string[];
  description: string;
}

interface CardState {
  id: string;
  plant: Plant;
  zIndex: number;
  isAnimating: boolean;
  animationType: 'swipe-left' | 'swipe-right' | 'none';
  transform: string;
  opacity: number;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const [plants] = useState<Plant[]>([
    {
      id: '1',
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      match: 95,
      image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=600',
      reasons: ['Low maintenance', 'Low light tolerant', 'Air purifying'],
      description: 'Perfect for beginners, this hardy plant thrives in low light and requires minimal watering.'
    },
    {
      id: '2',
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      match: 92,
      image: 'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=600',
      reasons: ['Instagram worthy', 'Fast growing', 'Statement piece'],
      description: 'A stunning tropical plant with iconic split leaves that adds drama to any space.'
    },
    {
      id: '3',
      name: 'Pothos',
      scientificName: 'Epipremnum aureum',
      match: 88,
      image: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=600',
      reasons: ['Easy to care for', 'Grows in various light', 'Beautiful trailing vines'],
      description: 'A versatile trailing plant that looks beautiful in hanging baskets or climbing up poles.'
    },
    {
      id: '4',
      name: 'Fiddle Leaf Fig',
      scientificName: 'Ficus lyrata',
      match: 85,
      image: 'https://images.pexels.com/photos/6208088/pexels-photo-6208088.jpeg?auto=compress&cs=tinysrgb&w=600',
      reasons: ['Architectural beauty', 'Large statement leaves', 'Modern aesthetic'],
      description: 'A striking tree-like plant with large, violin-shaped leaves perfect for modern interiors.'
    },
    {
      id: '5',
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      match: 82,
      image: 'https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg?auto=compress&cs=tinysrgb&w=600',
      reasons: ['Beautiful white flowers', 'Air purifying', 'Low light tolerant'],
      description: 'Elegant flowering plant that blooms regularly and helps purify indoor air.'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [rejectedPlants, setRejectedPlants] = useState<Plant[]>([]);
  const [showFinalSelection, setShowFinalSelection] = useState(false);
  const [cards, setCards] = useState<CardState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });

  // Initialize cards
  useEffect(() => {
    const initialCards = plants.map((plant, index) => ({
      id: plant.id,
      plant,
      zIndex: plants.length - index,
      isAnimating: false,
      animationType: 'none' as const,
      transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
      opacity: index < 3 ? 1 - index * 0.2 : 0
    }));
    setCards(initialCards);
  }, [plants]);

  const updateCardStack = () => {
    setCards(prevCards => {
      return prevCards.map((card, index) => {
        const stackIndex = index - currentIndex;
        if (stackIndex < 0 || card.isAnimating) {
          // Card has been processed or is animating - don't change it
          return card;
        } else if (stackIndex === 0) {
          // Current card
          let opacity = 1;
          if (isDragging) {
            // Only reduce opacity when card is far from center (almost out of area)
            const cardWidth = 300; // Approximate card width
            const threshold = cardWidth * 0.7; // Start fading when 70% out of view
            const distance = Math.abs(dragOffset.x);
            if (distance > threshold) {
              opacity = Math.max(0.3, 1 - (distance - threshold) / (cardWidth * 0.3));
            }
          }
          
          return {
            ...card,
            zIndex: 10,
            transform: isDragging 
              ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
              : 'scale(1) translateY(0px)',
            opacity
          };
        } else {
          // Background cards
          const scale = 1 - Math.min(stackIndex, 3) * 0.05;
          const translateY = Math.min(stackIndex, 3) * 10;
          const opacity = stackIndex < 3 ? 1 - stackIndex * 0.2 : 0;
          return {
            ...card,
            zIndex: 10 - stackIndex,
            transform: `scale(${scale}) translateY(${translateY}px)`,
            opacity
          };
        }
      });
    });
  };

  useEffect(() => {
    if (!isProcessing) {
      updateCardStack();
    }
  }, [currentIndex, isDragging, dragOffset, isProcessing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentIndex >= plants.length || isProcessing) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || currentIndex >= plants.length || isProcessing) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging || currentIndex >= plants.length || isProcessing) return;
    
    const threshold = 150; // Increased threshold for slower swiping
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        processCardAction('select');
      } else {
        processCardAction('reject');
      }
    } else {
      // Snap back with smooth animation
      setDragOffset({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };

  const processCardAction = (action: 'select' | 'reject') => {
    if (isProcessing || currentIndex >= plants.length) return;
    
    const currentPlant = plants[currentIndex];
    if (!currentPlant) return;

    setIsProcessing(true);
    
    // Add to appropriate list
    if (action === 'select') {
      setSelectedPlants(prev => [...prev, currentPlant]);
    } else {
      setRejectedPlants(prev => [...prev, currentPlant]);
    }

    // Start exit animation
    const direction = action === 'select' ? 'right' : 'left';
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === currentCard.id
          ? {
              ...card,
              isAnimating: true,
              animationType: direction === 'left' ? 'swipe-left' : 'swipe-right',
              transform: direction === 'left' 
                ? 'translateX(-150vw) rotate(-30deg)' 
                : 'translateX(150vw) rotate(30deg)',
              opacity: 0
            }
          : card
      )
    );

    // Wait for animation to complete before updating index
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setIsProcessing(false);
      
      // Check if we've reached the end
      if (currentIndex + 1 >= plants.length) {
        setTimeout(() => setShowFinalSelection(true), 300);
      }
    }, 900); // Even slower animation duration (was 600ms, now 900ms)
  };

  const handleSelect = () => {
    processCardAction('select');
  };

  const handleReject = () => {
    processCardAction('reject');
  };

  const backToSwiping = () => {
    setShowFinalSelection(false);
    // Reset to first unprocessed card or start over if all cards were processed
    const processedCards = selectedPlants.length + rejectedPlants.length;
    if (processedCards >= plants.length) {
      // All cards were processed, reset everything
      setCurrentIndex(0);
      setSelectedPlants([]);
      setRejectedPlants([]);
      setIsProcessing(false);
      // Reinitialize cards
      const initialCards = plants.map((plant, index) => ({
        id: plant.id,
        plant,
        zIndex: plants.length - index,
        isAnimating: false,
        animationType: 'none' as const,
        transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
        opacity: index < 3 ? 1 - index * 0.2 : 0
      }));
      setCards(initialCards);
    } else {
      // Go back to where we left off
      setCurrentIndex(processedCards);
      setIsProcessing(false);
    }
  };

  if (showFinalSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Selected Plants!
            </h1>
            <p className="text-gray-600">
              {selectedPlants.length > 0 
                ? `You chose ${selectedPlants.length} perfect plant${selectedPlants.length > 1 ? 's' : ''} for your space`
                : "No plants selected. Let's try again!"
              }
            </p>
          </div>

          {selectedPlants.length > 0 ? (
            <div className="space-y-6 mb-8">
              {selectedPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
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
                          <div className="text-2xl font-bold text-purple-600">{plant.match}%</div>
                          <div className="text-xs text-gray-500">match</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{plant.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {plant.reasons.map((reason) => (
                          <span
                            key={reason}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
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
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-6">No plants were selected during the matching process.</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={backToSwiping}
              className="w-full bg-white text-purple-600 font-semibold py-4 px-8 rounded-2xl border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Plant Selection
            </button>
            
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Take Quiz Again
            </button>
            
            {selectedPlants.length > 0 && (
              <button className="w-full bg-white text-purple-600 font-semibold py-4 px-8 rounded-2xl border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share My Plants
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentPlant = plants[currentIndex];
  if (!currentPlant) {
    // All cards processed, show final selection
    if (!showFinalSelection) {
      setShowFinalSelection(true);
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-600">
            Swipe right to select, left to pass
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {currentIndex + 1} of {plants.length} • {selectedPlants.length} selected
          </div>
        </div>

        <div className="relative h-[600px] mb-8">
          {/* Render all cards */}
          {cards.map((card) => (
            <div
              key={card.id}
              className={`absolute inset-0 ${
                card.isAnimating 
                  ? 'transition-all duration-[900ms] ease-out' 
                  : isDragging && card.zIndex === 10 
                    ? 'transition-none' 
                    : 'transition-all duration-300 ease-out'
              } ${
                card.zIndex === 10 && !card.isAnimating && !isProcessing ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              style={{
                transform: card.transform,
                opacity: card.opacity,
                zIndex: card.zIndex
              }}
              onMouseDown={card.zIndex === 10 && !isProcessing ? handleMouseDown : undefined}
              onMouseMove={card.zIndex === 10 && !isProcessing ? handleMouseMove : undefined}
              onMouseUp={card.zIndex === 10 && !isProcessing ? handleMouseUp : undefined}
              onMouseLeave={card.zIndex === 10 && !isProcessing ? handleMouseUp : undefined}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full border border-gray-100">
                <div className="relative h-2/3">
                  <img
                    src={card.plant.image}
                    alt={card.plant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="text-purple-600 font-bold text-lg">{card.plant.match}%</span>
                  </div>
                  
                  {/* Swipe indicators - only show on current card */}
                  {card.zIndex === 10 && isDragging && !isProcessing && (
                    <>
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                          dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-xl transform rotate-12">
                          LIKE
                        </div>
                      </div>
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                          dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-xl transform -rotate-12">
                          PASS
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="p-6 h-1/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.plant.name}</h3>
                    <p className="text-gray-500 italic mb-3">{card.plant.scientificName}</p>
                    <p className="text-gray-600 text-sm mb-4">{card.plant.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {card.plant.reasons.slice(0, 3).map((reason) => (
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={handleReject}
            disabled={currentIndex >= plants.length || isProcessing}
            className="w-16 h-16 bg-white border-4 border-red-200 rounded-full flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button
            onClick={handleSelect}
            disabled={currentIndex >= plants.length || isProcessing}
            className="w-16 h-16 bg-white border-4 border-green-200 rounded-full flex items-center justify-center hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Check className="w-8 h-8 text-green-500" />
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Tap buttons or swipe to choose
          </p>
        </div>
      </div>
    </div>
  );
};