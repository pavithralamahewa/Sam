'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { BusinessContext } from '@/lib/coo-engine';

interface ArrivalProps {
  onComplete: (context: BusinessContext) => void;
}

/**
 * Arrival: How Apple/Google would design AI interaction in 2030
 *
 * Principles:
 * 1. Physics over states - everything responds to forces, not timers
 * 2. Light and material - depth through luminosity, not borders
 * 3. Breath - continuous subtle motion, never static
 * 4. Minimal input - typing feels like thought, not data entry
 * 5. Intelligence emerges - understanding builds naturally, not extracted
 */

export function Arrival({ onComplete }: ArrivalProps) {
  const [scene, setScene] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  // Physics-based mouse following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const coreX = useTransform(smoothMouseX, [0, 1920], [-40, 40]);
  const coreY = useTransform(smoothMouseY, [0, 1080], [-40, 40]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMove);
      return () => window.removeEventListener('mousemove', handleMove);
    }
  }, []);

  // Scene progression
  const scenes = [
    // 0: Void → Presence (5s)
    { duration: 5000, next: 1 },

    // 1-2: Recognition
    { text: 'Hi', duration: 2500, next: 2 },
    { text: "I'm Sam", duration: 2500, next: 3 },

    // 3-6: Understanding (listening)
    { text: 'What do you call this?', listen: true, hint: 'Your company, your work', onSubmit: (val: string) => [...responses, val], next: 4 },
    { text: 'How many?', listen: true, hint: 'Team size', onSubmit: (val: string) => [...responses, val], next: 5 },
    { text: 'What do you do?', listen: true, hint: 'In one sentence', onSubmit: (val: string) => [...responses, val], next: 6 },
    { text: 'For whom?', listen: true, hint: 'Your ideal client', onSubmit: (val: string) => [...responses, val], next: 7 },

    // 7-8: Integration
    { text: 'I understand', duration: 2000, next: 8 },
    { text: 'Ready', duration: 1500, complete: true },
  ];

  const currentScene = scenes[scene];

  useEffect(() => {
    if (!currentScene) return;

    if (currentScene.complete) {
      setTimeout(() => {
        onComplete({
          name: responses[0] || 'Precious',
          teamSize: parseInt(responses[1]) || 1,
          positioning: responses[2] || '',
          idealClient: responses[3] || '',
          avgProjectValue: 10000,
          expertise: [],
          caseStudies: [],
          availability: 'medium',
          pricingModel: 'project-based',
          activeProjects: 1,
          pipeline: [],
          recentConversations: [],
        });
      }, 1500);
      return;
    }

    if (!currentScene.listen && currentScene.duration) {
      const timer = setTimeout(() => {
        setScene(currentScene.next || scene + 1);
      }, currentScene.duration);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  const handleSubmit = (value: string) => {
    if (!value.trim() || !currentScene.listen) return;
    setResponses(currentScene.onSubmit ? currentScene.onSubmit(value) : responses);
    setScene(currentScene.next || scene + 1);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Material: Deep glass with gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

        {/* Ambient light particles - floating dust */}
        {scene > 0 && [...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, Math.random() * 0.3, 0],
              y: [0, -100 - Math.random() * 100],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Core: The Intelligence */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ x: coreX, y: coreY }}
          className="relative"
        >
          {/* Primary sphere - glowing core */}
          <motion.div
            className="relative w-[300px] h-[300px]"
            animate={{
              scale: scene === 0 ? [0, 1] : [1, 1.05, 1],
            }}
            transition={{
              duration: scene === 0 ? 5 : 4,
              repeat: scene === 0 ? 0 : Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(99,102,241,0.2) 30%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={{
                opacity: scene === 0 ? [0, 0.6] : [0.6, 1, 0.6],
              }}
              transition={{
                duration: scene === 0 ? 5 : 3,
                repeat: scene === 0 ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Middle layer */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Outer atmosphere */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
                filter: 'blur(80px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [180, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Rim light - Apple signature lighting */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%)',
                filter: 'blur(2px)',
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Text: Floating thoughts */}
      {currentScene?.text && (
        <motion.div
          key={scene}
          className="absolute top-[28%] left-0 right-0 text-center pointer-events-none px-8"
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-[80px] font-thin tracking-tight text-white/90 leading-none">
            {currentScene.text}
          </h1>
        </motion.div>
      )}

      {/* Input: Minimal, breath-like */}
      {currentScene?.listen && (
        <motion.div
          key={`input-${scene}`}
          className="absolute bottom-[28%] left-0 right-0 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full bg-transparent border-0 text-white/80 text-[56px] font-thin text-center placeholder-white/20 focus:outline-none focus:ring-0 caret-white/50"
              style={{ letterSpacing: '-0.02em' }}
              placeholder="..."
              autoFocus
            />

            {/* Hint - fades in after 1.5s */}
            {currentScene.hint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-center text-white/30 text-sm font-light mt-6 tracking-wide"
              >
                {currentScene.hint}
              </motion.p>
            )}

            {/* Breathing underline */}
            <motion.div
              className="h-[0.5px] mt-6 mx-auto bg-white/20"
              animate={{
                width: ['40%', '60%', '40%'],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Progress: Elegant bottom indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400/40 via-indigo-400/40 to-pink-400/40"
          initial={{ width: '0%' }}
          animate={{ width: `${(scene / scenes.length) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </div>
  );
}
