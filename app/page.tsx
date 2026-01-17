'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IntelligentPresence } from '@/components/IntelligentPresence';
import { AIConversation } from '@/components/AIConversation';
import { COOEngine, BusinessContext, COODecision } from '@/lib/coo-engine';

type AppState = 'onboarding' | 'running';
type COOState = 'idle' | 'thinking' | 'alert' | 'success' | 'learning';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [cooState, setCooState] = useState<COOState>('idle');
  const [currentThought, setCurrentThought] = useState<string>('');

  // Business metrics
  const [revenue, setRevenue] = useState(3800);
  const [pipeline, setPipeline] = useState(18500);
  const [hotLeads, setHotLeads] = useState(3);
  const [lastAction, setLastAction] = useState('System initialized');

  // COO Engine
  const engineRef = useRef<COOEngine | null>(null);
  const thinkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize COO Engine
  const handleOnboardingComplete = async (context: BusinessContext) => {
    setCooState('learning');
    setCurrentThought('Learning about your business...');

    try {
      // Get API key from environment or allow user to provide
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

      if (!apiKey) {
        // In production, show UI to enter API key
        console.error('No Anthropic API key found');
        alert('Please set NEXT_PUBLIC_ANTHROPIC_API_KEY in your .env.local file');
        return;
      }

      // Initialize engine
      engineRef.current = new COOEngine(apiKey);
      await engineRef.current.learn(context);

      setCurrentThought('Business context loaded');
      setLastAction('Learned about Precious');

      setTimeout(() => {
        setCooState('idle');
        setAppState('running');
        setCurrentThought('Monitoring pipeline...');

        // Start continuous thinking loop
        startThinkingLoop();
      }, 2000);

    } catch (error) {
      console.error('Failed to initialize COO:', error);
      setCurrentThought('Initialization failed');
      setCooState('idle');
    }
  };

  // Continuous thinking loop - COO analyzes business every 30 seconds
  const startThinkingLoop = () => {
    if (thinkingIntervalRef.current) {
      clearInterval(thinkingIntervalRef.current);
    }

    const think = async () => {
      if (!engineRef.current || cooState === 'thinking') return;

      setCooState('thinking');
      setCurrentThought('Analyzing current state...');

      try {
        const decision = await engineRef.current.think();

        if (decision) {
          handleCOODecision(decision);
        } else {
          setCooState('idle');
          setCurrentThought('All systems nominal');
        }
      } catch (error) {
        console.error('COO thinking error:', error);
        setCooState('idle');
        setCurrentThought('Analysis complete');
      }
    };

    // Think immediately, then every 30 seconds
    think();
    thinkingIntervalRef.current = setInterval(think, 30000);
  };

  // Handle COO's decisions
  const handleCOODecision = (decision: COODecision) => {
    console.log('COO Decision:', decision);

    switch (decision.type) {
      case 'intervention':
        setCooState('alert');
        setCurrentThought(decision.title || 'Attention required');
        setLastAction(`Alert: ${decision.title}`);

        // In a real app, show intervention overlay with decision.suggestedActions
        // For now, just log it
        console.log('INTERVENTION:', {
          title: decision.title,
          description: decision.description,
          actions: decision.suggestedActions,
          confidence: decision.confidence,
        });

        // Auto-dismiss after 10 seconds if not interacted with
        setTimeout(() => {
          if (cooState === 'alert') {
            setCooState('idle');
            setCurrentThought('Monitoring resumed');
          }
        }, 10000);
        break;

      case 'background_action':
        setCurrentThought(`Executing: ${decision.actionTaken}`);
        setLastAction(decision.actionTaken || 'Background task');

        setTimeout(() => {
          setCooState('success');
          setCurrentThought(decision.result || 'Task complete');

          setTimeout(() => {
            setCooState('idle');
            setCurrentThought('Monitoring pipeline...');
          }, 3000);
        }, 2000);
        break;

      case 'strategic_insight':
        setCurrentThought(decision.insight || 'New insight available');
        setLastAction(`Insight: ${decision.insight?.substring(0, 50)}...`);

        setTimeout(() => {
          setCooState('idle');
        }, 5000);
        break;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
      }
    };
  }, []);

  // Demo mode - simulate metrics changes
  useEffect(() => {
    if (appState === 'running') {
      const interval = setInterval(() => {
        // Simulate small metric changes
        setRevenue((prev) => prev + Math.random() * 100 - 50);
        setPipeline((prev) => Math.max(0, prev + Math.random() * 500 - 250));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [appState]);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'onboarding' && (
          <AIConversation key="conversation" onComplete={handleOnboardingComplete} />
        )}

        {appState === 'running' && (
          <IntelligentPresence
            key="presence"
            state={cooState}
            revenue={revenue}
            pipeline={pipeline}
            hotLeads={hotLeads}
            lastAction={lastAction}
            currentThought={currentThought}
            onTap={() => {
              // In real app, open dashboard
              console.log('Open dashboard');
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
