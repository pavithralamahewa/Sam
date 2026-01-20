'use client';

import { motion } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AIOrbProps {
  state: OrbState;
}

export function AIOrb({ state }: AIOrbProps) {
  // State-based configurations
  const config = {
    idle: {
      layers: 3,
      scale: 1,
      opacity: 0.4,
      speed: 4,
      blur: 40,
      colors: ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.2)', 'rgba(236,72,153,0.15)'],
    },
    listening: {
      layers: 4,
      scale: 1.2,
      opacity: 0.7,
      speed: 1.5,
      blur: 30,
      colors: ['rgba(99,102,241,0.5)', 'rgba(139,92,246,0.4)', 'rgba(236,72,153,0.3)', 'rgba(168,85,247,0.35)'],
    },
    thinking: {
      layers: 5,
      scale: 1,
      opacity: 0.8,
      speed: 0.8,
      blur: 35,
      colors: [
        'rgba(139,92,246,0.6)',
        'rgba(168,85,247,0.5)',
        'rgba(192,132,252,0.4)',
        'rgba(216,180,254,0.35)',
        'rgba(233,213,255,0.25)',
      ],
    },
    speaking: {
      layers: 4,
      scale: 1.1,
      opacity: 0.9,
      speed: 0.6,
      blur: 25,
      colors: ['rgba(99,102,241,0.7)', 'rgba(139,92,246,0.6)', 'rgba(168,85,247,0.5)', 'rgba(192,132,252,0.4)'],
    },
  };

  const currentConfig = config[state];

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Core orb - 3D sphere effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Multiple layers for depth */}
        {Array.from({ length: currentConfig.layers }).map((_, i) => {
          const size = 100 + i * 50;
          const delay = i * 0.3;
          const duration = currentConfig.speed + i * 0.5;

          return (
            <motion.div
              key={`layer-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 30% 30%, ${currentConfig.colors[i] || currentConfig.colors[0]}, transparent 70%)`,
                filter: `blur(${currentConfig.blur}px)`,
              }}
              animate={{
                scale: [1, currentConfig.scale, 1],
                opacity: [currentConfig.opacity * 0.7, currentConfig.opacity, currentConfig.opacity * 0.7],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }}
            />
          );
        })}

        {/* Inner glow - adds depth */}
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 60%)',
            filter: 'blur(15px)',
          }}
          animate={{
            scale: state === 'listening' ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: state === 'idle' ? [0.2, 0.4, 0.2] : [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: currentConfig.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Particles - when thinking */}
        {state === 'thinking' && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 120;

              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-indigo-400/60"
                  style={{
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    x: [0, Math.cos(angle) * radius, 0],
                    y: [0, Math.sin(angle) * radius, 0],
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </>
        )}

        {/* Waveform - when speaking */}
        {state === 'speaking' && (
          <div className="absolute flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="w-1 bg-white/70 rounded-full"
                animate={{
                  height: [20, 60, 20],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Listening pulse rings */}
        {state === 'listening' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border border-indigo-400/30"
                initial={{ width: 150, height: 150, opacity: 0 }}
                animate={{
                  width: [150, 300, 300],
                  height: [150, 300, 300],
                  opacity: [0.6, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Outer glow - atmospheric */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentConfig.colors[0]}, transparent 80%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: currentConfig.speed * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
