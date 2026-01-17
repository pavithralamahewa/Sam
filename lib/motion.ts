/**
 * Motion Design System
 * Apple/Google-inspired spring physics and transitions
 */

export const springs = {
  // Gentle, organic motion (default for most UI)
  gentle: {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
    mass: 1,
  },

  // Snappy, responsive (for user-initiated actions)
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },

  // Bouncy, playful (for celebrations, success states)
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 15,
    mass: 1.2,
  },

  // Smooth, fluid (for page transitions)
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
    mass: 1,
  },

  // Wobbly, attention-grabbing (for alerts)
  wobbly: {
    type: "spring" as const,
    stiffness: 180,
    damping: 12,
    mass: 1,
  },
};

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
};

export const easings = {
  // Apple's standard easing
  apple: [0.4, 0.0, 0.2, 1],

  // Google Material easing
  material: [0.4, 0.0, 0.2, 1],

  // Custom easings
  entrance: [0.0, 0.0, 0.2, 1],
  exit: [0.4, 0.0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// Preset animations
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: springs.gentle,
  },

  slideUp: {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -40, opacity: 0 },
    transition: springs.snappy,
  },

  slideDown: {
    initial: { y: -40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 40, opacity: 0 },
    transition: springs.snappy,
  },

  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: springs.bouncy,
  },

  expandIn: {
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 20 },
    transition: springs.wobbly,
  },
};

// Stagger children animations
export const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: springs.gentle,
    },
  },
};

// Breathing animations (for ambient presence)
export const breathing = {
  scale: {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  glow: {
    animate: {
      boxShadow: [
        "0 20px 60px rgba(99, 102, 241, 0.6)",
        "0 20px 80px rgba(99, 102, 241, 0.8)",
        "0 20px 60px rgba(99, 102, 241, 0.6)",
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  pulse: {
    animate: {
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// Gesture animations
export const gestures = {
  tap: {
    tap: { scale: 0.97 },
    transition: springs.snappy,
  },

  hover: {
    scale: 1.02,
    transition: springs.gentle,
  },

  drag: {
    dragElastic: 0.1,
    dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
  },
};

// State-based colors with smooth transitions
export const stateColors = {
  idle: {
    primary: "#6366F1", // Indigo
    secondary: "#8B5CF6", // Purple
    glow: "rgba(99, 102, 241, 0.6)",
  },

  thinking: {
    primary: "#8B5CF6", // Purple
    secondary: "#A78BFA", // Light purple
    glow: "rgba(139, 92, 246, 0.6)",
  },

  alert: {
    primary: "#EC4899", // Pink
    secondary: "#F472B6", // Light pink
    glow: "rgba(236, 72, 153, 0.6)",
  },

  success: {
    primary: "#10B981", // Green
    secondary: "#34D399", // Light green
    glow: "rgba(16, 185, 129, 0.6)",
  },

  warning: {
    primary: "#F59E0B", // Amber
    secondary: "#FBBF24", // Yellow
    glow: "rgba(245, 158, 11, 0.6)",
  },

  learning: {
    primary: "#8B5CF6", // Purple
    secondary: "#A78BFA", // Light purple
    glow: "rgba(139, 92, 246, 0.6)",
  },
};

// Micro-interactions
export const microInteractions = {
  buttonPress: {
    whileTap: { scale: 0.96 },
    whileHover: { scale: 1.02 },
    transition: springs.snappy,
  },

  cardHover: {
    whileHover: {
      y: -4,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    },
    transition: springs.gentle,
  },

  ripple: {
    initial: { scale: 0, opacity: 0.6 },
    animate: { scale: 2, opacity: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Loading states
export const loadingAnimations = {
  spinner: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },

  dots: {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};
