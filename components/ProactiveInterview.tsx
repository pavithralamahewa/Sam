'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { springs } from '@/lib/motion';
import { BusinessContext } from '@/lib/coo-engine';
import { AIOrb } from './AIOrb';

interface ProactiveInterviewProps {
  onComplete: (context: BusinessContext) => void;
}

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export function ProactiveInterview({ onComplete }: ProactiveInterviewProps) {
  const [phase, setPhase] = useState<'orb' | 'conversation'>('orb');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [step, setStep] = useState(0);
  const [aiText, setAiText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState<any>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 13], ['0%', '100%']);

  const questions = [
    // Opening sequence
    { orb: 'idle', orbDuration: 2000, next: 1 },
    { orb: 'thinking', orbDuration: 1500, next: 2 }, // AI received signal to start
    { orb: 'speaking', ai: 'Hi.', delay: 1000, next: 3 },
    { orb: 'speaking', ai: "I'm Sam. Your new COO.", delay: 1800, next: 4 },

    // Interview
    { orb: 'speaking', ai: "What's your agency called?", input: true, key: 'name', ack: 'Nice.', next: 5 },
    { orb: 'speaking', ai: 'How big is the team?', input: true, key: 'teamSize', type: 'number', ack: 'Good.', next: 6 },
    { orb: 'speaking', ai: 'What do you do? One line.', input: true, key: 'positioning', ack: 'Got it.', next: 7 },
    { orb: 'speaking', ai: "Who's your ideal client?", input: true, key: 'idealClient', ack: 'Perfect.', next: 8 },
    { orb: 'speaking', ai: 'Typical project value?', input: true, key: 'avgProjectValue', type: 'number', ack: 'Okay.', next: 9 },
    { orb: 'speaking', ai: 'What are you best at?', input: true, key: 'expertise', ack: 'Understood.', next: 10 },

    // Closing
    { orb: 'thinking', orbDuration: 1500, next: 11 }, // Processing
    { orb: 'speaking', ai: `I know ${data.name || 'you'} now.`, delay: 1800, next: 12 },
    { orb: 'speaking', ai: 'Activating...', delay: 2000, complete: true },
  ];

  useEffect(() => {
    if (step >= questions.length) return;

    const q = questions[step];

    // Update orb state
    if (q.orb) {
      setOrbState(q.orb as OrbState);
    }

    // Show orb-only phase or conversation
    if (q.ai) {
      setPhase('conversation');
      setAiText(q.ai);

      if (q.input) {
        setOrbState('listening');
        setTimeout(() => {
          setShowInput(true);
          inputRef.current?.focus();
        }, 500);
      } else {
        setShowInput(false);
        const timer = setTimeout(() => {
          if (q.complete) {
            onComplete({
              name: data.name || 'Precious',
              positioning: data.positioning || '',
              idealClient: data.idealClient || '',
              avgProjectValue: data.avgProjectValue || 10000,
              teamSize: data.teamSize || 5,
              expertise: data.expertise || [],
              caseStudies: [],
              availability: 'medium',
              pricingModel: 'project-based',
              activeProjects: 1,
              pipeline: [],
              recentConversations: [],
            });
          } else {
            setStep(q.next || step + 1);
          }
        }, q.delay || 1500);
        return () => clearTimeout(timer);
      }
    } else {
      // Orb-only phase (idle or thinking)
      setPhase('orb');
      const timer = setTimeout(() => {
        setStep(q.next || step + 1);
      }, q.orbDuration || 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    progress.set(step / 12);
  }, [step]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const q = questions[step];
    const answer = userInput.trim();
    const newData = { ...data };

    if (q.type === 'number') {
      newData[q.key!] = parseInt(answer.replace(/[^0-9]/g, '')) || 0;
    } else if (q.key === 'expertise') {
      newData[q.key] = answer.split(',').map((s: string) => s.trim());
    } else {
      newData[q.key!] = answer;
    }

    setData(newData);
    setUserInput('');
    setShowInput(false);
    setOrbState('thinking'); // AI processing

    // Brief thinking state
    setTimeout(() => {
      setOrbState('speaking');
      setAiText(q.ack || 'Got it.');

      setTimeout(() => {
        setStep(q.next || step + 1);
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient floating orbs */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              i === 0
                ? 'radial-gradient(circle, rgba(99,102,241,0.06), transparent)'
                : i === 1
                ? 'radial-gradient(circle, rgba(139,92,246,0.06), transparent)'
                : 'radial-gradient(circle, rgba(236,72,153,0.06), transparent)',
            filter: 'blur(60px)',
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}

      {/* AI Orb - Always visible */}
      <div className="relative z-10 mb-16">
        <AIOrb state={orbState} />
      </div>

      {/* Conversation area - only when AI speaks */}
      <AnimatePresence mode="wait">
        {phase === 'conversation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl px-8"
          >
            {/* AI text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={aiText}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
              >
                <h1 className="text-6xl md:text-7xl font-extralight text-white/95 tracking-tight leading-tight">
                  {aiText}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Input */}
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-3xl mx-auto"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-5 text-white text-4xl font-light text-center placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="..."
                        autoComplete="off"
                      />

                      {/* Active line */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                        initial={{ width: '0%', x: '50%' }}
                        animate={{ width: '100%', x: '0%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          style={{ width: progressWidth }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
