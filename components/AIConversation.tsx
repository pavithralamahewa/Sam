'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/motion';
import { BusinessContext } from '@/lib/coo-engine';

interface Message {
  id: string;
  from: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface AIConversationProps {
  onComplete: (context: BusinessContext) => void;
}

export function AIConversation({ onComplete }: AIConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [stage, setStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Collected data
  const [data, setData] = useState<any>({});

  const conversationFlow = [
    {
      question: "Hey! I'm your new AI COO. What's your agency called?",
      key: 'name',
      type: 'text',
    },
    {
      question: "Nice! And how many people are on the team at {name}?",
      key: 'teamSize',
      type: 'number',
    },
    {
      question: "Got it. In one sentence - what does {name} do? What's your positioning?",
      key: 'positioning',
      type: 'text',
    },
    {
      question: "Perfect. Who's your ideal client? Describe them for me.",
      key: 'idealClient',
      type: 'text',
    },
    {
      question: "And what's a typical project worth to you? Just ballpark.",
      key: 'avgProjectValue',
      type: 'number',
      prefix: '$',
    },
    {
      question: "Last thing - what are you best at? (UX design, conversion optimization, etc.)",
      key: 'expertise',
      type: 'text',
    },
  ];

  useEffect(() => {
    // Start conversation
    setTimeout(() => {
      addAIMessage(conversationFlow[0].question);
      inputRef.current?.focus();
    }, 1000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAIMessage = (content: string) => {
    const interpolated = content.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: 'ai',
        content: interpolated,
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: 'user',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userInput = input.trim();
    addUserMessage(userInput);
    setInput('');
    setIsThinking(true);

    // Save data
    const currentStep = conversationFlow[stage];
    const newData = { ...data };

    if (currentStep.type === 'number') {
      newData[currentStep.key] = parseInt(userInput.replace(/[^0-9]/g, '')) || 0;
    } else if (currentStep.key === 'expertise') {
      newData[currentStep.key] = userInput.split(',').map((s) => s.trim());
    } else {
      newData[currentStep.key] = userInput;
    }

    setData(newData);

    // AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsThinking(false);

    // Next question or complete
    if (stage < conversationFlow.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStage(stage + 1);
      addAIMessage(conversationFlow[stage + 1].question);
    } else {
      // Complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      addAIMessage(
        `Perfect! I've learned everything I need about ${newData.name}. Let me activate and start monitoring your pipeline... 🧠`
      );

      setTimeout(() => {
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
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full blur-[100px] bg-indigo-500/20" />
      </motion.div>

      {/* Conversation container */}
      <div className="relative z-10 w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-12 space-y-6 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={springs.gentle}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-6 py-4 ${
                    message.from === 'ai'
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-white'
                      : 'bg-white/5 text-white border border-white/10'
                  }`}
                >
                  <p className="text-lg leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={springs.gentle}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl px-6 py-4">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                        animate={{
                          y: [0, -8, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div
          className="px-8 pb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, ...springs.gentle }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isThinking}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />

            {/* Send button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 py-3 font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              whileHover={{ scale: input.trim() && !isThinking ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() && !isThinking ? 0.95 : 1 }}
            >
              Send
            </motion.button>
          </form>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {conversationFlow.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= stage ? 'bg-indigo-500 w-8' : 'bg-white/10 w-1.5'
                }`}
                animate={{
                  width: i === stage ? 32 : i < stage ? 32 : 6,
                }}
                transition={springs.snappy}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hidden scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
