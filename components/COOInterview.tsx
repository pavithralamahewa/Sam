'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { springs } from '@/lib/motion';
import { BusinessContext } from '@/lib/coo-engine';

interface COOInterviewProps {
  onComplete: (context: BusinessContext) => void;
}

type Scene = 'arrival' | 'introduction' | 'interview' | 'synthesis';

export function COOInterview({ onComplete }: COOInterviewProps) {
  const [scene, setScene] = useState<Scene>('arrival');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [collectedData, setCollectedData] = useState<any>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  // Interview questions - COO asks you
  const interview = [
    {
      question: "What's the name of your agency?",
      voiceLine: "Let's start simple.",
      key: 'name',
      type: 'text',
    },
    {
      question: "How many people work there?",
      voiceLine: "Tell me about your team.",
      key: 'teamSize',
      type: 'number',
    },
    {
      question: "In one sentence - what does your agency do?",
      voiceLine: "Now, your positioning...",
      key: 'positioning',
      type: 'text',
    },
    {
      question: "Who's your ideal client?",
      voiceLine: "Who do you serve best?",
      key: 'idealClient',
      type: 'text',
    },
    {
      question: "What's a typical project worth?",
      voiceLine: "Let's talk numbers.",
      key: 'avgProjectValue',
      type: 'number',
      prefix: '$',
    },
    {
      question: "What are you best at?",
      voiceLine: "And finally...",
      key: 'expertise',
      type: 'text',
    },
  ];

  // SCENE 1: Arrival - Cinematic opening
  useEffect(() => {
    if (scene === 'arrival') {
      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setVoiceText('A presence awakens...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setScene('introduction');
      };
      sequence();
    }
  }, [scene]);

  // SCENE 2: Introduction - AI introduces itself
  useEffect(() => {
    if (scene === 'introduction') {
      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        await typeText("I'm your new Chief Operating Officer.");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await typeText("But I don't know your business yet.");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await typeText("Before I can help you grow, I need to understand who you are.");
        await new Promise((resolve) => setTimeout(resolve, 2500));

        await typeText("This won't take long. Just a few questions.");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await typeText("Ready?");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setScene('interview');
      };
      sequence();
    }
  }, [scene]);

  // SCENE 3: Interview - Ask questions
  useEffect(() => {
    if (scene === 'interview' && currentQuestion < interview.length) {
      const sequence = async () => {
        setIsListening(false);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const q = interview[currentQuestion];
        await typeText(q.voiceLine);
        await new Promise((resolve) => setTimeout(resolve, 1200));

        await typeText(q.question);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsListening(true);
        inputRef.current?.focus();
      };
      sequence();
    }
  }, [scene, currentQuestion]);

  const typeText = async (text: string) => {
    setVoiceText('');
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      setVoiceText(words.slice(0, i + 1).join(' '));
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  };

  const handleAnswer = async () => {
    if (!userInput.trim()) return;

    const q = interview[currentQuestion];
    const answer = userInput.trim();

    // Save answer
    const newData = { ...collectedData };
    if (q.type === 'number') {
      newData[q.key] = parseInt(answer.replace(/[^0-9]/g, '')) || 0;
    } else if (q.key === 'expertise') {
      newData[q.key] = answer.split(',').map((s) => s.trim());
    } else {
      newData[q.key] = answer;
    }
    setCollectedData(newData);

    setUserInput('');
    setIsListening(false);

    // Acknowledge
    await typeText('Got it.');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Next question or finish
    if (currentQuestion < interview.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Synthesis
      setScene('synthesis');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await typeText(`Thank you.`);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await typeText(`I understand ${newData.name} now.`);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await typeText('Initializing...');
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Complete
      onComplete({
        name: newData.name || 'Precious',
        positioning: newData.positioning || '',
        idealClient: newData.idealClient || '',
        avgProjectValue: newData.avgProjectValue || 10000,
        teamSize: newData.teamSize || 5,
        expertise: newData.expertise || [],
        caseStudies: [],
        availability: 'medium',
        pricingModel: 'project-based',
        activeProjects: 1,
        pipeline: [],
        recentConversations: [],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Ambient breathing background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: scene === 'arrival'
            ? ['radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1), black)',
               'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2), black)',
               'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1), black)']
            : scene === 'interview'
            ? 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15), black)'
            : 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2), black)',
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Particle field */}
      {scene !== 'arrival' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* SCENE 1: Arrival */}
        {scene === 'arrival' && (
          <motion.div
            key="arrival"
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.p
              className="mt-12 text-2xl text-white/60 font-light"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {voiceText}
            </motion.p>
          </motion.div>
        )}

        {/* SCENE 2: Introduction */}
        {scene === 'introduction' && (
          <motion.div
            key="introduction"
            className="relative z-10 max-w-4xl text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springs.gentle}
          >
            <motion.div
              className="text-5xl md:text-7xl font-light text-white leading-relaxed mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, ...springs.gentle }}
            >
              {voiceText}
            </motion.div>

            {/* Listening indicator */}
            <motion.div
              className="flex justify-center gap-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-indigo-400/50 rounded-full"
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 3: Interview */}
        {scene === 'interview' && (
          <motion.div
            key="interview"
            className="relative z-10 max-w-4xl w-full px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Voice line (small, top) */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={springs.gentle}
            >
              <p className="text-indigo-400 text-sm font-light tracking-wide uppercase">
                {interview[currentQuestion]?.voiceLine}
              </p>
            </motion.div>

            {/* Main question (large, center) */}
            <motion.div
              className="text-center mb-16"
              key={currentQuestion}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springs.bouncy}
            >
              <h1 className="text-4xl md:text-6xl font-light text-white leading-tight">
                {voiceText}
              </h1>
            </motion.div>

            {/* Input (when listening) */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  transition={springs.snappy}
                  className="relative max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAnswer();
                      }}
                      className="w-full bg-white/5 backdrop-blur-xl border-2 border-indigo-500/30 rounded-2xl px-8 py-6 text-white text-2xl text-center placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                      placeholder="Type here..."
                      autoFocus
                    />

                    {/* Glowing border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(99,102,241,0)',
                          '0 0 30px 2px rgba(99,102,241,0.3)',
                          '0 0 0 0 rgba(99,102,241,0)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Subtle hint */}
                  <motion.p
                    className="text-center mt-6 text-gray-600 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Press Enter to continue
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {interview.map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-white/20"
                  animate={{
                    width: i === currentQuestion ? 32 : 8,
                    backgroundColor:
                      i < currentQuestion
                        ? 'rgba(99,102,241,0.8)'
                        : i === currentQuestion
                        ? 'rgba(99,102,241,0.5)'
                        : 'rgba(255,255,255,0.2)',
                  }}
                  transition={springs.snappy}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* SCENE 4: Synthesis */}
        {scene === 'synthesis' && (
          <motion.div
            key="synthesis"
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={springs.bouncy}
          >
            <motion.div
              className="text-6xl font-light text-white mb-8"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {voiceText}
            </motion.div>

            {/* Synthesis particles */}
            <div className="relative w-64 h-64 mx-auto">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-indigo-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                    y: Math.sin((i / 12) * Math.PI * 2) * 100,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
