import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Check, X, Heart, ArrowLeft, Star, Lightbulb, ShoppingCart, Droplets, Sun, Clock, Shield, ExternalLink } from 'lucide-react';
import { Plant, plantsDatabase } from '../data/plants';
import { Logo } from './Logo';

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

  // Generate care tips based on quiz answers
  const generateCareTips = (quizAnswers: any, plant: Plant) => {
    const tips = [];

    // Lighting tip
    const lightingTips = {
      'low': 'Place in a spot with indirect light, away from windows. North-facing windows work well.',
      'medium': 'Position near a window with filtered light or a few feet from a bright window.',
      'bright': 'Place near a south or west-facing window for plenty of bright, indirect light.',
      'direct': 'This plant loves direct sunlight - place it right by a sunny window.'
    };
    tips.push({
      icon: Sun,
      title: 'Lighting',
      description: lightingTips[quizAnswers.lighting] || lightingTips[plant.lighting]
    });

    // Watering tip
    const wateringTips = {
      'low': 'Water sparingly, only when soil is completely dry. Usually every 2-3 weeks.',
      'medium': 'Water when top inch of soil feels dry. Typically once a week.',
      'high': 'Keep soil consistently moist but not soggy. Check every few days.'
    };
    tips.push({
      icon: Droplets,
      title: 'Watering',
      description: wateringTips[plant.watering]
    });

    // Maintenance tip
    const maintenanceTips = {
      'low': 'Very easy care! Just water occasionally and wipe leaves monthly.',
      'medium': 'Regular watering and occasional feeding during growing season.',
      'high': 'Needs consistent attention - regular watering, humidity, and feeding.'
    };
    tips.push({
      icon: Clock,
      title: 'Maintenance',
      description: maintenanceTips[quizAnswers.maintenance] || maintenanceTips[plant.maintenance]
    });

    // Pet safety tip
    if (quizAnswers.pets === 'yes') {
      tips.push({
        icon: Shield,
        title: 'Pet Safety',
        description: plant.petSafe 
          ? 'Safe for pets! No worries if your furry friends get curious.'
          : 'Keep away from pets - this plant can be toxic if ingested.'
      });
    }

    return tips;
  };

  // Decorative pots data
  const decorativePots = [
    {
      id: 1,
      name: 'Modern Ceramic',
      image: 'https://images.pexels.com/photos/32707014/pexels-photo-32707014.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '€24.99',
      style: 'Minimalist green ceramic with drainage'
    },
    {
      id: 2,
      name: 'Terracotta Classic',
      image: 'https://images.pexels.com/photos/3192175/pexels-photo-3192175.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '€18.99',
      style: 'Traditional clay pot with saucer'
    },
    {
      id: 3,
      name: 'Woven Basket',
      image: 'https://images.pexels.com/photos/2718447/pexels-photo-2718447.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '€32.99',
      style: 'Natural seagrass with plastic liner'
    },
    {
      id: 4,
      name: 'Geometric Stone',
      image: 'https://images.pexels.com/photos/5825583/pexels-photo-5825583.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '€45.99',
      style: 'Modern concrete with geometric pattern'
    }
  ];

  if (showFinalSelection) {
    // Sort selected plants by match percentage (highest first)
    const sortedSelectedPlants = [...selectedPlants].sort((a, b) => b.match - a.match);
    const bestMatch = sortedSelectedPlants[0];
    const otherMatches = sortedSelectedPlants.slice(1);
    const quizAnswers = getQuizAnswers();

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Logo className="w-10 h-10" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Plant Matches!
            </h1>
            <p className="text-gray-600">
              {selectedPlants.length > 0 
                ? `You chose ${selectedPlants.length} perfect plant${selectedPlants.length > 1 ? 's' : ''} for your space`
                : "No plants selected. Let's try again!"
              }
            </p>
          </div>

          {selectedPlants.length > 0 ? (
            <div className="space-y-8 mb-8">
              {/* Best Match - Featured Card */}
              {bestMatch && (
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-sm">Best Match</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={bestMatch.image}
                          alt={bestMatch.name}
                          className="w-full h-48 md:h-full rounded-2xl object-cover"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1">{bestMatch.name}</h2>
                            <p className="text-lg text-gray-500 italic">{bestMatch.scientificName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-purple-600">{bestMatch.match}%</div>
                            <div className="text-sm text-gray-500">match</div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">{bestMatch.description}</p>
                        <div className="flex flex-wrap gap-3">
                          {bestMatch.reasons.map((reason) => (
                            <span
                              key={reason}
                              className="px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Green Flags and Care Products Cards */}
              {bestMatch && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Green Flags Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Green Flags</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {generateCareTips(quizAnswers, bestMatch).map((tip, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <tip.icon className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Care Products Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Care Products</h3>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Complete Care Package</h4>
                      <p className="text-gray-600 text-sm mb-3">Everything you need to keep your plant thriving:</p>
                      
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        <li>• Premium potting soil (2L)</li>
                        <li>• Liquid plant fertilizer</li>
                        <li>• Decorative ceramic pot</li>
                        <li>• Plant care guide</li>
                        <li>• Watering schedule stickers</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Bauhaus - €29.99
                      </button>
                      
                      <button className="w-full bg-white border-2 border-emerald-500 text-emerald-600 font-semibold py-3 px-4 rounded-xl hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Pflanz Kölle - €27.99
                      </button>
                      
                      <button className="w-full bg-white border-2 border-orange-500 text-orange-600 font-semibold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        OBI - €32.99
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Decorative Pots Section */}
              {bestMatch && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Logo className="w-5 h-5" showText={false} textColor="text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Perfect Pots for {bestMatch.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {decorativePots.map((pot) => (
                      <div key={pot.id} className="group cursor-pointer">
                        <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-300 group-hover:shadow-md h-full flex flex-col">
                          <img
                            src={pot.image}
                            alt={pot.name}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                          />
                          <div className="flex-1 flex flex-col">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{pot.name}</h4>
                            <p className="text-xs text-gray-600 mb-3 flex-1">{pot.style}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-bold text-purple-600">{pot.price}</span>
                              <button className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors">
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      Choose the perfect pot to complement your {bestMatch.name}
                    </p>
                    <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                      <ShoppingCart className="w-4 h-4" />
                      View All Pots at Bauhaus
                    </button>
                  </div>
                </div>
              )}

              {/* Other Matches */}
              {otherMatches.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Other Great Matches
                  </h3>
                  <div className="space-y-4">
                    {otherMatches.map((plant) => (
                      <div
                        key={plant.id}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex gap-4">
                          <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-xl font-bold text-gray-800">{plant.name}</h4>
                                <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">{plant.match}%</div>
                                <div className="text-xs text-gray-500">match</div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{plant.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {plant.reasons.slice(0, 3).map((reason) => (
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
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Logo className="w-12 h-12" showText={false} textColor="text-gray-400" />
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
          </div>
        </div>
      </div>
    );
  }

  // Show message if no plants match the criteria
  if (plants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-4">
            <Logo className="w-10 h-10" />
          </div>
        </div>

        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Logo className="w-12 h-12" showText={false} textColor="text-gray-400" />
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

  // Calculate selection count for the swipable card page
  const getSelectionInfo = () => {
    return `${selectedPlants.length} selected`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <Logo className="w-10 h-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-600">
            Swipe right to select, left to pass
          </p>
          
          {/* Selection info - more vivid and visible - ONLY on swipable card page */}
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm">
                {getSelectionInfo()}
              </span>
            </div>
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
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <X className="w-8 h-8 text-white" />
          </button>
          
          <button
            onClick={handleSelect}
            disabled={currentIndex >= plants.length || isProcessing}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Check className="w-8 h-8 text-white" />
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