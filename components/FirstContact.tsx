'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { BusinessContext } from '@/lib/coo-engine';

interface FirstContactProps {
  onComplete: (context: BusinessContext) => void;
}

/**
 * First Contact: Redefining human-AI interaction
 *
 * Not a form. Not a chat. Not an interview.
 * This is two intelligences recognizing each other.
 *
 * The AI is already here, thinking, present.
 * You're just... meeting for the first time.
 */

export function FirstContact({ onComplete }: FirstContactProps) {
  const [phase, setPhase] = useState<'presence' | 'recognition' | 'understanding' | 'integrated'>('presence');
  const [intensity, setIntensity] = useState(0.3); // AI presence intensity
  const [awarenessLevel, setAwarenessLevel] = useState(0); // 0-100
  const [currentReflection, setCurrentReflection] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [understanding, setUnderstanding] = useState<any>({});

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Track mouse - AI responds to presence
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Phase 1: Presence (0-10s)
  // AI is just... there. Breathing. Existing. Barely visible.
  // User sees darkness, then slowly a presence emerges
  useEffect(() => {
    if (phase !== 'presence') return;

    // Slowly increase presence
    const presenceTimer = setTimeout(() => {
      setIntensity(0.6);
      setAwarenessLevel(20);
    }, 3000);

    const recognitionTimer = setTimeout(() => {
      setPhase('recognition');
      setIntensity(0.9);
      setAwarenessLevel(60);
    }, 8000);

    return () => {
      clearTimeout(presenceTimer);
      clearTimeout(recognitionTimer);
    };
  }, [phase]);

  // Phase 2: Recognition (10-25s)
  // AI acknowledges you. Simple. Minimal. "I see you."
  useEffect(() => {
    if (phase !== 'recognition') return;

    const sequence = async () => {
      await wait(2000);
      setCurrentReflection('Hi.');

      await wait(3000);
      setCurrentReflection(null);

      await wait(1500);
      setCurrentReflection("I'm Sam.");

      await wait(3000);
      setCurrentReflection(null);

      await wait(2000);
      setPhase('understanding');
      setAwarenessLevel(80);
    };

    sequence();
  }, [phase]);

  // Phase 3: Understanding (25s+)
  // Not questions. Reflections. The AI is learning by observing your responses.
  // It doesn't ask "What's your name?" - it reflects on what it's learning
  const reflections = [
    {
      thought: "What do you call this?",
      learns: 'name',
      hint: 'the work, the agency, the thing you built'
    },
    {
      thought: "How many of you?",
      learns: 'teamSize',
      hint: 'just you? a few? many?'
    },
    {
      thought: "What's the work?",
      learns: 'positioning',
      hint: 'in one line'
    },
    {
      thought: "For who?",
      learns: 'idealClient',
      hint: 'who needs this'
    },
  ];

  const [reflectionIndex, setReflectionIndex] = useState(0);

  useEffect(() => {
    if (phase !== 'understanding') return;
    if (reflectionIndex >= reflections.length) {
      // Understanding complete
      setTimeout(() => {
        setPhase('integrated');
        setAwarenessLevel(100);
        setCurrentReflection('I know you now.');

        setTimeout(() => {
          onComplete({
            name: understanding.name || 'Precious',
            positioning: understanding.positioning || '',
            idealClient: understanding.idealClient || '',
            avgProjectValue: 10000,
            teamSize: parseInt(understanding.teamSize) || 1,
            expertise: [],
            caseStudies: [],
            availability: 'medium',
            pricingModel: 'project-based',
            activeProjects: 1,
            pipeline: [],
            recentConversations: [],
          });
        }, 3000);
      }, 2000);
      return;
    }

    const current = reflections[reflectionIndex];
    setCurrentReflection(current.thought);
    setIsListening(true);
  }, [phase, reflectionIndex]);

  const handleUnderstanding = (value: string) => {
    if (!isListening || reflectionIndex >= reflections.length) return;

    const current = reflections[reflectionIndex];
    setUnderstanding({ ...understanding, [current.learns]: value });
    setIsListening(false);
    setCurrentReflection(null);

    // Brief pause before next reflection
    setTimeout(() => {
      setReflectionIndex(reflectionIndex + 1);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      style={{ cursor: phase === 'presence' ? 'default' : 'none' }}
    >
      {/* Deep void */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

      {/* AI Presence - The core intelligence, responding to mouse */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: intensity,
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      >
        {/* Core - responds to mouse position */}
        <motion.div
          className="relative"
          style={{
            x: useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]),
            y: useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-30, 30]),
          }}
        >
          {/* Multiple layers creating depth */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 200 + i * 100,
                height: 200 + i * 100,
                background: `radial-gradient(circle, ${
                  i === 0 ? 'rgba(255,255,255,0.1)' :
                  i === 1 ? 'rgba(139,92,246,0.08)' :
                  i === 2 ? 'rgba(99,102,241,0.06)' :
                  i === 3 ? 'rgba(236,72,153,0.04)' :
                  'rgba(168,85,247,0.02)'
                } 0%, transparent 70%)`,
                filter: `blur(${40 + i * 20}px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
                rotate: i % 2 === 0 ? [0, 360] : [360, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Awareness particles - more appear as AI becomes more aware */}
          {[...Array(Math.floor(awarenessLevel / 10))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 0.628) * 200, 0],
                y: [0, Math.sin(i * 0.628) * 200, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Reflections - AI's thoughts made visible */}
      <AnimatePresence mode="wait">
        {currentReflection && (
          <motion.div
            key={currentReflection}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <h1 className="text-6xl md:text-8xl font-extralight text-white/90 tracking-tight">
              {currentReflection}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Understanding field - appears when AI is listening */}
      <AnimatePresence>
        {isListening && reflectionIndex < reflections.length && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8"
          >
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleUnderstanding(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
              className="w-full bg-transparent border-0 text-white/70 text-5xl font-extralight text-center placeholder-white/20 focus:outline-none caret-white/30"
              placeholder="..."
              autoFocus
            />

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2 }}
              className="text-center text-white/20 text-sm mt-8 font-light"
            >
              {reflections[reflectionIndex].hint}
            </motion.p>

            {/* Breathing line */}
            <motion.div
              className="h-px mt-4 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                width: ['60%', '80%', '60%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Awareness level - subtle bottom indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-pink-500/50"
          animate={{ width: `${awarenessLevel}%` }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
