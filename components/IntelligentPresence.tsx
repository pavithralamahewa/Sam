'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { springs, stateColors, breathing, microInteractions } from '@/lib/motion';

type COOState = 'idle' | 'thinking' | 'alert' | 'success' | 'learning';

interface ThinkingParticle {
  id: string;
  x: number;
  y: number;
  delay: number;
}

interface PresenceProps {
  state: COOState;
  revenue: number;
  pipeline: number;
  hotLeads: number;
  lastAction: string;
  currentThought?: string;
  onTap: () => void;
}

export function IntelligentPresence({
  state,
  revenue,
  pipeline,
  hotLeads,
  lastAction,
  currentThought,
  onTap,
}: PresenceProps) {
  const [particles, setParticles] = useState<ThinkingParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = stateColors[state];

  // Generate thinking particles when COO is thinking
  useEffect(() => {
    if (state === 'thinking' || state === 'learning') {
      const newParticles: ThinkingParticle[] = Array.from({ length: 12 }, (_, i) => ({
        id: `particle-${i}`,
        x: Math.cos((i / 12) * Math.PI * 2) * 140,
        y: Math.sin((i / 12) * Math.PI * 2) * 140,
        delay: i * 0.08,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [state]);

  // Subtle sound on state change (would use real audio in production)
  useEffect(() => {
    // In real app, play subtle sound based on state
    // audioRef.current?.play();
  }, [state]);

  const getStatusText = () => {
    switch (state) {
      case 'idle':
        return 'Monitoring';
      case 'thinking':
        return 'Analyzing...';
      case 'alert':
        return 'ALERT';
      case 'success':
        return 'Complete';
      case 'learning':
        return 'Learning...';
      default:
        return 'Online';
    }
  };

  const getGlowIntensity = () => {
    if (state === 'alert') return 0.9;
    if (state === 'thinking') return 0.7;
    if (state === 'success') return 0.8;
    return 0.6;
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: [getGlowIntensity() - 0.2, getGlowIntensity(), getGlowIntensity() - 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, ${colors.glow}, transparent)`,
          }}
        />
      </motion.div>

      {/* Thinking particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              x: particle.x,
              y: particle.y,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main presence orb */}
      <motion.div
        className="relative z-10 cursor-pointer"
        {...microInteractions.buttonPress}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onTap}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            scale: state === 'alert' ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: state === 'alert' ? 1.5 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />

        {/* Core orb */}
        <motion.div
          className="relative w-80 h-80 rounded-full flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            boxShadow: `0 20px 60px ${colors.glow}`,
          }}
          animate={{
            scale: state === 'alert' ? [1, 1.02, 1] : [1, 1.01, 1],
            boxShadow: [
              `0 20px 60px ${colors.glow}`,
              `0 20px 80px ${colors.glow}`,
              `0 20px 60px ${colors.glow}`,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner shine */}
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center text-white px-8">
            {/* Status */}
            <motion.div
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              animate={{
                opacity: state === 'alert' ? [1, 0.6, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: state === 'alert' ? Infinity : 0,
              }}
            >
              {getStatusText()}
            </motion.div>

            {/* Current thought */}
            <AnimatePresence mode="wait">
              {currentThought && (
                <motion.div
                  key={currentThought}
                  className="text-xs opacity-70 mb-6 h-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={springs.gentle}
                >
                  {currentThought}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Metrics */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <Metric value={`$${(revenue / 1000).toFixed(1)}k`} label="Revenue" />
              <Metric value={`$${(pipeline / 1000).toFixed(1)}k`} label="Pipeline" />
              <Metric value={hotLeads.toString()} label="Hot Leads" />
            </div>

            {/* Last action */}
            <motion.div
              className="text-xs opacity-50 mt-6"
              animate={{ opacity: isHovered ? 0.7 : 0.5 }}
              transition={springs.gentle}
            >
              {lastAction}
            </motion.div>
          </div>

          {/* Pulse ring on alert */}
          <AnimatePresence>
            {state === 'alert' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: colors.primary }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tap hint */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-sm whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springs.gentle}
            >
              Tap to open dashboard
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-60 mt-1.5">{label}</div>
    </div>
  );
}
