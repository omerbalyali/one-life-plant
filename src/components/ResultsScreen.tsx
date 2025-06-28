import React, { useState, useRef, useEffect } from 'react';
import { Leaf, RefreshCw, Share2, Check, X, Heart, ArrowLeft } from 'lucide-react';
import { Plant, plantsDatabase } from '../data/plants';

interface ResultsScreenProps {
  onRestart: () => void;
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

// Get quiz answers from localStorage or context
const getQuizAnswers = () => {
  const stored = localStorage.getItem('quizAnswers');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  // Filter and randomize plants based on quiz answers
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [rejectedPlants, setRejectedPlants] = useState<Plant[]>([]);
  const [showFinalSelection, setShowFinalSelection] = useState(false);
  const [cards, setCards] = useState<CardState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });

  // Smart filtering function
  const filterAndRandomizePlants = (quizAnswers: any) => {
    let filteredPlants = plantsDatabase.filter(plant => {
      // Location filter
      if (quizAnswers.location && quizAnswers.location !== 'both') {
        if (plant.location !== 'both' && plant.location !== quizAnswers.location) {
          return false;
        }
      }

      // Lighting filter
      if (quizAnswers.lighting) {
        // Allow some flexibility in lighting requirements
        const lightingCompatibility: Record<string, string[]> = {
          'low': ['low', 'medium'],
          'medium': ['low', 'medium', 'bright'],
          'bright': ['medium', 'bright', 'direct'],
          'direct': ['bright', 'direct']
        };
        
        if (!lightingCompatibility[quizAnswers.lighting]?.includes(plant.lighting)) {
          return false;
        }
      }

      // Maintenance filter
      if (quizAnswers.maintenance) {
        // Allow equal or lower maintenance
        const maintenanceOrder = ['low', 'medium', 'high'];
        const userLevel = maintenanceOrder.indexOf(quizAnswers.maintenance);
        const plantLevel = maintenanceOrder.indexOf(plant.maintenance);
        
        if (plantLevel > userLevel) {
          return false;
        }
      }

      // Pet safety filter
      if (quizAnswers.pets === 'yes' && !plant.petSafe) {
        return false;
      }

      // Style filter - if user selected styles, plant must match at least one
      if (quizAnswers.style && Array.isArray(quizAnswers.style) && quizAnswers.style.length > 0) {
        const hasMatchingStyle = plant.styles.some(style => 
          quizAnswers.style.includes(style)
        );
        if (!hasMatchingStyle) {
          return false;
        }
      }

      return true;
    });

    // Calculate match scores based on how well the plant fits the user's preferences
    filteredPlants = filteredPlants.map(plant => {
      let score = 70; // Base score

      // Perfect location match
      if (quizAnswers.location === plant.location) score += 10;
      else if (plant.location === 'both') score += 5;

      // Perfect lighting match
      if (quizAnswers.lighting === plant.lighting) score += 10;
      else score += 5; // Partial match (already filtered for compatibility)

      // Perfect maintenance match
      if (quizAnswers.maintenance === plant.maintenance) score += 10;
      else score += 5; // Lower maintenance is always good

      // Pet safety bonus
      if (quizAnswers.pets === 'yes' && plant.petSafe) score += 5;

      // Style matching bonus
      if (quizAnswers.style && Array.isArray(quizAnswers.style)) {
        const matchingStyles = plant.styles.filter(style => 
          quizAnswers.style.includes(style)
        ).length;
        score += matchingStyles * 3;
      }

      // Air purifying bonus
      if (plant.airPurifying) score += 2;

      // Flowering bonus
      if (plant.flowering) score += 2;

      return {
        ...plant,
        match: Math.min(99, Math.max(70, score)) // Keep between 70-99
      };
    });

    // Sort by match score and take top candidates
    filteredPlants.sort((a, b) => b.match - a.match);
    
    // Take more plants than we need, then randomize
    const topPlants = filteredPlants.slice(0, Math.min(16, filteredPlants.length));
    
    // Shuffle the top plants
    for (let i = topPlants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [topPlants[i], topPlants[j]] = [topPlants[j], topPlants[i]];
    }

    // Return maximum 8 plants
    return topPlants.slice(0, 8);
  };

  // Initialize filtered plants on component mount
  useEffect(() => {
    const quizAnswers = getQuizAnswers();
    const filteredPlants = filterAndRandomizePlants(quizAnswers);
    setPlants(filteredPlants);
  }, []);

  // Initialize cards when plants change
  useEffect(() => {
    if (plants.length > 0) {
      const initialCards = plants.map((plant, index) => ({
        id: plant.id,
        plant,
        zIndex: plants.length - index,
        isAnimating: false,
        animationType: 'none' as const,
        transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
        opacity: index < 3 ? 1 : 0
      }));
      setCards(initialCards);
    }
  }, [plants]);

  const updateCardStack = () => {
    setCards(prevCards => {
      return prevCards.map((card, index) => {
        const stackIndex = index - currentIndex;
        
        if (stackIndex < 0 || card.isAnimating) {
          // Card has been processed or is animating - don't change it
          return card;
        } else if (stackIndex === 0) {
          // Current card - always full opacity, no transparency during drag
          return {
            ...card,
            zIndex: 10,
            transform: isDragging 
              ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
              : 'scale(1) translateY(0px)',
            opacity: 1
          };
        } else {
          // Background cards - no transparency, just scaling and positioning
          const scale = 1 - Math.min(stackIndex, 3) * 0.05;
          const translateY = Math.min(stackIndex, 3) * 10;
          const opacity = stackIndex < 3 ? 1 : 0;
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

  // Simplified current card detection
  const getCurrentCard = () => {
    return cards.find((card, index) => index === currentIndex && !card.isAnimating);
  };

  const isCurrentCard = (cardIndex: number) => {
    return cardIndex === currentIndex && !isProcessing && !cards[cardIndex]?.isAnimating;
  };

  const handleMouseDown = (e: React.MouseEvent, cardIndex: number) => {
    if (!isCurrentCard(cardIndex)) return;
    e.preventDefault();
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
    
    const threshold = 150;
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        processCardAction('select');
      } else {
        processCardAction('reject');
      }
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };

  const processCardAction = (action: 'select' | 'reject') => {
    if (isProcessing || currentIndex >= plants.length) return;
    
    const currentPlant = plants[currentIndex];
    if (!currentPlant) return;

    setIsProcessing(true);
    
    if (action === 'select') {
      setSelectedPlants(prev => [...prev, currentPlant]);
    } else {
      setRejectedPlants(prev => [...prev, currentPlant]);
    }

    const direction = action === 'select' ? 'right' : 'left';
    const currentCardId = plants[currentIndex].id;

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === currentCardId
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

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setIsProcessing(false);
      
      if (currentIndex + 1 >= plants.length) {
        setTimeout(() => setShowFinalSelection(true), 300);
      }
    }, 900);
  };

  const handleSelect = () => {
    processCardAction('select');
  };

  const handleReject = () => {
    processCardAction('reject');
  };

  const backToSwiping = () => {
    setShowFinalSelection(false);
    const processedCards = selectedPlants.length + rejectedPlants.length;
    if (processedCards >= plants.length) {
      setCurrentIndex(0);
      setSelectedPlants([]);
      setRejectedPlants([]);
      setIsProcessing(false);
      const initialCards = plants.map((plant, index) => ({
        id: plant.id,
        plant,
        zIndex: plants.length - index,
        isAnimating: false,
        animationType: 'none' as const,
        transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
        opacity: index < 3 ? 1 : 0
      }));
      setCards(initialCards);
    } else {
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

  // Show message if no plants match the criteria
  if (plants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Perfect Matches Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find plants that match all your criteria. Let's try the quiz again with different preferences.
          </p>
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentPlant = plants[currentIndex];
  if (!currentPlant) {
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
          {cards.map((card, cardIndex) => {
            const isCurrentCardFlag = isCurrentCard(cardIndex);
            
            return (
              <div
                key={card.id}
                className={`absolute inset-0 select-none ${
                  card.isAnimating 
                    ? 'transition-all duration-[900ms] ease-out' 
                    : isDragging && isCurrentCardFlag 
                      ? 'transition-none' 
                      : 'transition-all duration-300 ease-out'
                } ${
                  isCurrentCardFlag && !card.isAnimating && !isProcessing ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
                style={{
                  transform: card.transform,
                  opacity: card.opacity,
                  zIndex: card.zIndex,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                onMouseDown={isCurrentCardFlag && !isProcessing ? (e) => handleMouseDown(e, cardIndex) : undefined}
                onMouseMove={isCurrentCardFlag && !isProcessing ? handleMouseMove : undefined}
                onMouseUp={isCurrentCardFlag && !isProcessing ? handleMouseUp : undefined}
                onMouseLeave={isCurrentCardFlag && !isProcessing ? handleMouseUp : undefined}
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full border border-gray-100 select-none">
                  <div className="relative h-[58%]">
                    <img
                      src={card.plant.image}
                      alt={card.plant.name}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      draggable={false}
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        WebkitUserDrag: 'none',
                        WebkitTouchCallout: 'none'
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg pointer-events-none select-none">
                      <span className="text-purple-600 font-bold text-lg">{card.plant.match}%</span>
                    </div>
                    
                    {isCurrentCardFlag && isDragging && !isProcessing && (
                      <>
                        <div 
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none select-none ${
                            dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="bg-green-500 text-white px-8 py-6 rounded-2xl font-bold text-4xl transform rotate-12 select-none">
                            LIKE
                          </div>
                        </div>
                        <div 
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none select-none ${
                            dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="bg-red-500 text-white px-8 py-6 rounded-2xl font-bold text-4xl transform -rotate-12 select-none">
                            PASS
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-6 h-[42%] flex flex-col justify-between select-none">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-0.5 select-none">{card.plant.name}</h3>
                      <p className="text-gray-500 italic mb-3 select-none">{card.plant.scientificName}</p>
                      <p className="text-gray-600 text-sm mb-4 select-none">{card.plant.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 select-none">
                      {card.plant.reasons.slice(0, 3).map((reason) => (
                        <span
                          key={reason}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full select-none"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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