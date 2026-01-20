'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/motion';
import { BusinessContext } from '@/lib/coo-engine';

interface NaturalInterviewProps {
  onComplete: (context: BusinessContext) => void;
}

export function NaturalInterview({ onComplete }: NaturalInterviewProps) {
  const [stage, setStage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState<any>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const flow = [
    // Opening - set the scene
    {
      ai: "Hi.",
      pause: 1200,
      then: () => say("I'm Sam. Your new COO.", 1800),
    },
    {
      ai: "I'm Sam. Your new COO.",
      pause: 2000,
      then: () => say("Before we start... I need to know your business.", 2200),
    },
    {
      ai: "Before we start... I need to know your business.",
      pause: 1800,
      then: () => say("What's your agency called?", 800, true, 'name'),
    },

    // Question 1: Name
    {
      ai: "What's your agency called?",
      input: true,
      key: 'name',
      onAnswer: (answer: string) => {
        say("Nice.", 1000);
      },
      then: () => say(`How big is the team at ${data.name}?`, 1200, true, 'teamSize'),
    },

    // Question 2: Team
    {
      ai: `How big is the team at ${data.name}?`,
      input: true,
      key: 'teamSize',
      type: 'number',
      onAnswer: (answer: string) => {
        const size = parseInt(answer);
        if (size <= 2) say("Small team. I like it.", 1400);
        else if (size <= 5) say("Good size.", 1200);
        else say("Solid team.", 1200);
      },
      then: () => say("In one line - what do you do?", 1500, true, 'positioning'),
    },

    // Question 3: Positioning
    {
      ai: "In one line - what do you do?",
      input: true,
      key: 'positioning',
      onAnswer: () => say("Got it.", 1000),
      then: () => say("Who's your ideal client?", 1300, true, 'idealClient'),
    },

    // Question 4: Client
    {
      ai: "Who's your ideal client?",
      input: true,
      key: 'idealClient',
      onAnswer: () => say("Perfect.", 1000),
      then: () => say("What's a typical project worth?", 1400, true, 'avgProjectValue'),
    },

    // Question 5: Value
    {
      ai: "What's a typical project worth?",
      input: true,
      key: 'avgProjectValue',
      type: 'number',
      prefix: '$',
      onAnswer: (answer: string) => {
        const val = parseInt(answer.replace(/[^0-9]/g, ''));
        if (val < 5000) say("Starting out. We'll grow that.", 1500);
        else if (val < 20000) say("Good ticket size.", 1200);
        else say("Strong.", 1000);
      },
      then: () => say("Last one - what are you best at?", 1500, true, 'expertise'),
    },

    // Question 6: Expertise
    {
      ai: "Last one - what are you best at?",
      input: true,
      key: 'expertise',
      onAnswer: () => say("Understood.", 1200),
      then: () => finish(),
    },
  ];

  const currentStep = flow[stage];

  // Auto-progress through intro
  useEffect(() => {
    if (!currentStep) return;

    if (!currentStep.input) {
      const timer = setTimeout(() => {
        if (currentStep.then) currentStep.then();
      }, currentStep.pause || 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, currentStep]);

  const say = (text: string, pause: number = 1500, input: boolean = false, key?: string) => {
    setShowInput(false);
    setDisplayText('');

    setTimeout(() => {
      setDisplayText(text);
      if (input && key) {
        setTimeout(() => {
          setShowInput(true);
          inputRef.current?.focus();
        }, 600);
      }
    }, 100);
  };

  const handleSubmit = () => {
    if (!userInput.trim() || !currentStep.input) return;

    const answer = userInput.trim();
    const newData = { ...data };

    // Save data
    if (currentStep.type === 'number') {
      newData[currentStep.key!] = parseInt(answer.replace(/[^0-9]/g, '')) || 0;
    } else if (currentStep.key === 'expertise') {
      newData[currentStep.key] = answer.split(',').map((s: string) => s.trim());
    } else {
      newData[currentStep.key!] = answer;
    }

    setData(newData);
    setUserInput('');
    setShowInput(false);

    // Acknowledge
    if (currentStep.onAnswer) {
      currentStep.onAnswer(answer);
    }

    // Move to next with updated data
    const delay = (currentStep.onAnswer !== undefined) ? 1400 : 800;
    setTimeout(() => {
      if (currentStep.then) {
        currentStep.then();
      } else {
        setStage(stage + 1);
      }
    }, delay);
  };

  const finish = () => {
    say(`Thanks.`, 1500);
    setTimeout(() => {
      say(`I know ${data.name} now.`, 2000);
      setTimeout(() => {
        say('Activating...', 1500);
        setTimeout(() => {
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
        }, 2500);
      }, 2200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Subtle breathing glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), black)',
            'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12), black)',
            'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), black)',
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* AI voice - natural, conversational */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-light text-white/90 leading-relaxed">
              {displayText}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Input - only when AI is listening */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={springs.snappy}
              className="max-w-2xl mx-auto"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/20 focus:border-indigo-400 px-4 py-4 text-white text-3xl text-center placeholder-white/30 focus:outline-none transition-colors"
                  placeholder="..."
                  autoComplete="off"
                  autoFocus
                />
              </form>

              {/* Subtle hint */}
              <motion.p
                className="text-center mt-8 text-white/30 text-sm tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Press Enter
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal progress - bottom corner */}
        <div className="absolute bottom-8 right-8 flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className={`w-1 h-1 rounded-full ${
                i <= Math.floor(stage / 2) ? 'bg-indigo-400/60' : 'bg-white/10'
              }`}
              animate={{
                scale: i === Math.floor(stage / 2) ? [1, 1.5, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: i === Math.floor(stage / 2) ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
