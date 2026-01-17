'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, animations, stagger } from '@/lib/motion';
import { BusinessContext } from '@/lib/coo-engine';

interface OnboardingFlowProps {
  onComplete: (context: BusinessContext) => void;
}

type Step = 'welcome' | 'basics' | 'positioning' | 'expertise' | 'clients' | 'review';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [data, setData] = useState<Partial<BusinessContext>>({
    caseStudies: [],
    expertise: [],
    pipeline: [],
    recentConversations: [],
  });

  const nextStep = () => {
    const steps: Step[] = ['welcome', 'basics', 'positioning', 'expertise', 'clients', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['welcome', 'basics', 'positioning', 'expertise', 'clients', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    const fullContext: BusinessContext = {
      name: data.name || 'Precious',
      positioning: data.positioning || '',
      caseStudies: data.caseStudies || [],
      teamSize: data.teamSize || 5,
      expertise: data.expertise || [],
      availability: data.availability || 'medium',
      idealClient: data.idealClient || '',
      pricingModel: data.pricingModel || '',
      avgProjectValue: data.avgProjectValue || 10000,
      activeProjects: data.activeProjects || 0,
      pipeline: data.pipeline || [],
      recentConversations: data.recentConversations || [],
    };

    onComplete(fullContext);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] rounded-full blur-[100px] bg-indigo-500/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        variants={stagger.container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <WelcomeStep key="welcome" data={data} setData={setData} onNext={nextStep} />
          )}

          {step === 'basics' && (
            <BasicsStep
              key="basics"
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 'positioning' && (
            <PositioningStep
              key="positioning"
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 'expertise' && (
            <ExpertiseStep
              key="expertise"
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 'clients' && (
            <ClientsStep
              key="clients"
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 'review' && (
            <ReviewStep
              key="review"
              data={data}
              onComplete={handleComplete}
              onBack={prevStep}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Welcome Step
function WelcomeStep({
  data,
  setData,
  onNext,
}: {
  data: Partial<BusinessContext>;
  setData: (data: Partial<BusinessContext>) => void;
  onNext: () => void;
}) {
  return (
    <motion.div {...animations.slideUp} className="text-center">
      <motion.div
        className="text-6xl mb-6"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        👋
      </motion.div>

      <h1 className="text-5xl font-bold text-white mb-4">
        Let's get your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI COO</span> ready
      </h1>

      <p className="text-xl text-gray-400 mb-12 leading-relaxed">
        I'll ask you a few questions to understand Precious deeply.
        <br />
        This helps me make smarter decisions and drive revenue effectively.
      </p>

      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold rounded-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
      >
        Let's Begin
      </motion.button>

      <p className="text-sm text-gray-500 mt-6">Takes ~3 minutes</p>
    </motion.div>
  );
}

// Basics Step
function BasicsStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: Partial<BusinessContext>;
  setData: (data: Partial<BusinessContext>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(data.name || '');
  const [teamSize, setTeamSize] = useState(data.teamSize?.toString() || '');
  const [activeProjects, setActiveProjects] = useState(data.activeProjects?.toString() || '');

  const handleNext = () => {
    setData({
      ...data,
      name,
      teamSize: parseInt(teamSize) || 5,
      activeProjects: parseInt(activeProjects) || 0,
    });
    onNext();
  };

  return (
    <motion.div {...animations.slideUp} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">The Basics</h2>
        <p className="text-gray-400">Tell me about your agency</p>
      </div>

      <div className="space-y-6">
        <InputField
          label="Agency Name"
          value={name}
          onChange={setName}
          placeholder="Precious"
        />

        <InputField
          label="Team Size"
          value={teamSize}
          onChange={setTeamSize}
          placeholder="5"
          type="number"
        />

        <InputField
          label="Active Projects Right Now"
          value={activeProjects}
          onChange={setActiveProjects}
          placeholder="2"
          type="number"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!name}>
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

// Positioning Step
function PositioningStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: Partial<BusinessContext>;
  setData: (data: Partial<BusinessContext>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [positioning, setPositioning] = useState(data.positioning || '');
  const [idealClient, setIdealClient] = useState(data.idealClient || '');
  const [avgValue, setAvgValue] = useState(data.avgProjectValue?.toString() || '');

  const handleNext = () => {
    setData({
      ...data,
      positioning,
      idealClient,
      avgProjectValue: parseInt(avgValue) || 10000,
    });
    onNext();
  };

  return (
    <motion.div {...animations.slideUp} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Positioning</h2>
        <p className="text-gray-400">How do you describe what you do?</p>
      </div>

      <div className="space-y-6">
        <TextAreaField
          label="One-line positioning"
          value={positioning}
          onChange={setPositioning}
          placeholder="We help B2B SaaS companies convert 2x more users through conversion-focused UX design"
          rows={2}
        />

        <TextAreaField
          label="Ideal Client Profile"
          value={idealClient}
          onChange={setIdealClient}
          placeholder="B2B SaaS companies with $1M+ ARR, struggling with conversion rates, have product-market fit"
          rows={3}
        />

        <InputField
          label="Average Project Value"
          value={avgValue}
          onChange={setAvgValue}
          placeholder="15000"
          type="number"
          prefix="$"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!positioning}>
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

// Expertise Step
function ExpertiseStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: Partial<BusinessContext>;
  setData: (data: Partial<BusinessContext>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [expertise, setExpertise] = useState<string[]>(data.expertise || []);

  const expertiseOptions = [
    'UX Research',
    'UI Design',
    'Conversion Optimization',
    'User Testing',
    'Wireframing',
    'Prototyping',
    'Design Systems',
    'Mobile Design',
    'Web Design',
    'Product Strategy',
    'Analytics',
    'A/B Testing',
  ];

  const toggleExpertise = (skill: string) => {
    setExpertise((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleNext = () => {
    setData({ ...data, expertise });
    onNext();
  };

  return (
    <motion.div {...animations.slideUp} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Core Expertise</h2>
        <p className="text-gray-400">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {expertiseOptions.map((skill) => (
          <SkillPill
            key={skill}
            skill={skill}
            selected={expertise.includes(skill)}
            onClick={() => toggleExpertise(skill)}
          />
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleNext} disabled={expertise.length === 0}>
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

// Clients Step (simplified - can add case studies later)
function ClientsStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: Partial<BusinessContext>;
  setData: (data: Partial<BusinessContext>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div {...animations.slideUp} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Almost Done!</h2>
        <p className="text-gray-400">You can add case studies later in settings</p>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <p className="text-gray-300 leading-relaxed">
          Your AI COO will learn from:
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>Email conversations with leads</li>
            <li>Meeting notes and outcomes</li>
            <li>Project successes and wins</li>
            <li>Your unique communication style</li>
          </ul>
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </motion.div>
  );
}

// Review Step
function ReviewStep({
  data,
  onComplete,
  onBack,
}: {
  data: Partial<BusinessContext>;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div {...animations.slideUp} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Ready to Launch</h2>
        <p className="text-gray-400">Here's what I learned about {data.name}</p>
      </div>

      <div className="space-y-4">
        <ReviewItem label="Positioning" value={data.positioning || '-'} />
        <ReviewItem label="Team Size" value={data.teamSize?.toString() || '-'} />
        <ReviewItem label="Expertise" value={data.expertise?.join(', ') || '-'} />
        <ReviewItem label="Ideal Client" value={data.idealClient || '-'} />
        <ReviewItem
          label="Avg Project Value"
          value={`$${data.avgProjectValue?.toLocaleString()}`}
        />
      </div>

      <motion.div
        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/30"
        animate={{ borderColor: ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.3)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-white font-medium mb-2">🧠 I'm ready to:</p>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>✓ Monitor your pipeline 24/7</li>
          <li>✓ Respond to hot leads instantly</li>
          <li>✓ Draft personalized proposals</li>
          <li>✓ Optimize your revenue strategy</li>
        </ul>
      </motion.div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={onComplete}>🚀 Activate COO</Button>
      </div>
    </motion.div>
  );
}

// UI Components
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            prefix ? 'pl-8' : ''
          }`}
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
      />
    </div>
  );
}

function SkillPill({
  skill,
  selected,
  onClick,
}: {
  skill: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={`px-4 py-3 rounded-xl font-medium transition-all ${
        selected
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
          : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-gray-600'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {skill}
    </motion.button>
  );
}

function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  return (
    <motion.button
      className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
          : 'bg-gray-800 text-gray-300 border border-gray-700'
      }`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/30 rounded-xl px-4 py-3 border border-gray-700/50">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-white">{value}</div>
    </div>
  );
}
