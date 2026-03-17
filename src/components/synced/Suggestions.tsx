// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/Suggestions.tsx
// Last synced: 2026-03-17T11:05:34.423Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Suggestion {
  id: string;
  text: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function Suggestions({
  suggestions,
  onSuggestionClick,
  className = '',
}: SuggestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentSuggestion = suggestions?.[currentIndex];

  // Typewriter effect
  useEffect(() => {
    if (!currentSuggestion) return;

    setIsTyping(true);
    setDisplayedText('');

    let currentCharIndex = 0;
    const text = currentSuggestion.text;

    const typeInterval = setInterval(() => {
      if (currentCharIndex < text.length) {
        setDisplayedText(text.slice(0, currentCharIndex + 1));
        currentCharIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30); // Adjust typing speed here (lower = faster)

    return () => clearInterval(typeInterval);
  }, [currentSuggestion]);

  // Auto-loop through suggestions
  useEffect(() => {
    if (!suggestions || suggestions.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered && !isTyping) {
        setCurrentIndex(prevIndex => (prevIndex + 1) % suggestions.length);
      }
    }, 4000); // Increased to 4 seconds to allow for typing

    return () => clearInterval(interval);
  }, [suggestions, isHovered, isTyping]);

  // Early return after all hooks
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2 text-sm font-medium text-gray-600"
      >
        💡 Suggestion:
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSuggestionClick(currentSuggestion.text)}
        className="relative flex h-20 w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left shadow-sm transition-all duration-300 hover:border-blue-300 hover:from-blue-50 hover:to-blue-100"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />

        <div className="relative w-full">
          <motion.span
            className="block text-sm leading-relaxed text-gray-700"
            animate={{
              color: isHovered ? '#1e40af' : '#374151',
            }}
            transition={{ duration: 0.2 }}
          >
            {displayedText}
            {isTyping && (
              <motion.span
                className="ml-1 inline-block h-4 w-0.5 bg-blue-500"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
}

// Suggestion data for different note types
export const suggestionData = {
  eventNotes: [
    {
      id: 'event-1',
      text: 'Please send the kids hungry, there will be lots of food...',
    },
    {
      id: 'event-2',
      text: 'Parents are welcome to stay and have chai and samosas with us...',
    },
    {
      id: 'event-3',
      text: "It's a pool party so please send a change of clothes...",
    },
  ],
  timeNotes: [
    {
      id: 'time-1',
      text: 'Guys, the party hall closes by 9 so please pick up your kids before that...',
    },
    {
      id: 'time-2',
      text: 'We have a magician performing at 11 so please ensure your kids come before that...',
    },
    {
      id: 'time-3',
      text: 'Come early to enjoy the arcade games the longest...',
    },
  ],
  locationNotes: [
    {
      id: 'location-1',
      text: 'There is parking for 7 cars inside our building but ample parking in the side streets...',
    },
    {
      id: 'location-2',
      text: 'The party hall is on the fifth floor so come straight up...',
    },
    {
      id: 'location-3',
      text: 'The kids playground is near the Victoria statue entrance of Cubbon Park',
    },
    {
      id: 'location-4',
      text: 'No parking at all so please choose public transport or cabs.',
    },
  ],
  foodNotes: [
    {
      id: 'food-1',
      text: 'Do let us know if your child has any diet restriction or allergies...',
    },
    {
      id: 'food-2',
      text: 'Since it is a pizza place, not sure we can accommodate all diet restrictions or allergies...',
    },
  ],
};
