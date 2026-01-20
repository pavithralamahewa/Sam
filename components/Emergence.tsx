'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIOrb } from './AIOrb';
import { BusinessContext } from '@/lib/coo-engine';

interface EmergenceProps {
  onComplete: (context: BusinessContext) => void;
}

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

// Not questions. Observations. The AI is learning by being present.
const emergence = [
  // Phase 1: Awakening
  { state: 'idle', duration: 3000, thought: null },
  { state: 'thinking', duration: 2000, thought: null }, // Signal received

  // Phase 2: Recognition
  { state: 'speaking', duration: 2500, text: 'Hi.' },
  { state: 'idle', duration: 1500, thought: 'observing...' },
  { state: 'speaking', duration: 2000, text: "I'm Sam." },
  { state: 'idle', duration: 2000, thought: 'sensing presence...' },

  // Phase 3: Understanding through conversation (not interrogation)
  { state: 'speaking', duration: 3000, text: "What do you call this?" },
  { state: 'listening', duration: null, collect: 'name' }, // AI waits, learns

  { state: 'thinking', duration: 1500, thought: 'understanding context...' },
  { state: 'speaking', duration: 2000, text: 'Nice.' },
  { state: 'idle', duration: 1800, thought: null },

  { state: 'speaking', duration: 2500, text: "You and...?" },
  { state: 'listening', duration: null, collect: 'teamSize' },

  { state: 'thinking', duration: 1200, thought: 'building model...' },
  { state: 'speaking', duration: 1500, text: 'Got it.' },
  { state: 'idle', duration: 2000, thought: null },

  { state: 'speaking', duration: 3000, text: "What's the work?" },
  { state: 'listening', duration: null, collect: 'positioning' },

  { state: 'thinking', duration: 1800, thought: 'inferring patterns...' },
  { state: 'speaking', duration: 1800, text: 'I see.' },
  { state: 'idle', duration: 1500, thought: null },

  { state: 'speaking', duration: 2800, text: "For who?" },
  { state: 'listening', duration: null, collect: 'idealClient' },

  { state: 'thinking', duration: 2000, thought: 'synthesizing...' },
  { state: 'idle', duration: 2500, thought: 'learning complete' },

  // Phase 4: Integration
  { state: 'thinking', duration: 3000, thought: 'integration in progress...' },
  { state: 'speaking', duration: 2500, text: 'I know you now.' },
  { state: 'idle', duration: 2000, thought: null },
  { state: 'speaking', duration: 2000, text: 'Ready.', complete: true },
];

export function Emergence({ onComplete }: EmergenceProps) {
  const [moment, setMoment] = useState(0);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [text, setText] = useState<string | null>(null);
  const [thought, setThought] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (moment >= emergence.length) return;

    const current = emergence[moment];

    setOrbState(current.state as OrbState);
    setText(current.text || null);
    setThought(current.thought || null);

    if (current.collect) {
      // AI is listening - no timer, waiting for human
      setIsListening(true);
      return;
    }

    setIsListening(false);

    // Move to next moment
    const timer = setTimeout(() => {
      if (current.complete) {
        onComplete({
          name: data.name || 'Precious',
          positioning: data.positioning || '',
          idealClient: data.idealClient || '',
          avgProjectValue: 10000,
          teamSize: data.teamSize || 5,
          expertise: [],
          caseStudies: [],
          availability: 'medium',
          pricingModel: 'project-based',
          activeProjects: 1,
          pipeline: [],
          recentConversations: [],
        });
      } else {
        setMoment(moment + 1);
      }
    }, current.duration || 2000);

    return () => clearTimeout(timer);
  }, [moment]);

  const handleInput = (value: string) => {
    const current = emergence[moment];
    if (!current.collect) return;

    const newData = { ...data };

    if (current.collect === 'teamSize') {
      newData[current.collect] = parseInt(value.replace(/[^0-9]/g, '')) || 1;
    } else {
      newData[current.collect] = value;
    }

    setData(newData);
    setInput('');
    setMoment(moment + 1);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Deep space */}
      <div className="absolute inset-0 bg-gradient-radial from-zinc-950 via-black to-black" />

      {/* Floating particles - subtle presence */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* The Orb - centered, breathing */}
      <div className="relative z-20">
        <AIOrb state={orbState} />
      </div>

      {/* Text - appears above/below orb naturally */}
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 20, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[30%] left-1/2 -translate-x-1/2 z-10"
          >
            <p className="text-7xl font-extralight text-white/90 tracking-tight whitespace-nowrap">
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input - emerges from nothing */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[600px] z-10"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  handleInput(input.trim());
                }
              }}
              className="w-full bg-transparent border-0 text-white/80 text-5xl font-extralight text-center placeholder-white/10 focus:outline-none caret-white/40"
              placeholder="..."
              autoFocus
            />

            {/* Breathing underline */}
            <motion.div
              className="h-px mt-4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scaleX: [0.8, 1, 0.8],
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

      {/* Internal thought - tiny, bottom corner, only when AI is processing */}
      <AnimatePresence>
        {thought && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-8 right-8 z-10"
          >
            <p className="text-xs text-white/20 font-light italic">
              {thought}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
