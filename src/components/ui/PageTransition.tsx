"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * PageTransition component
 * Requirements: 7.7
 *
 * Implements fade and slide transitions between pages
 * Uses AnimatePresence for exit animations
 */

type TransitionType = "fade" | "slide" | "slideUp" | "scale";

interface PageTransitionProps {
  children: ReactNode;
  transition?: TransitionType;
  duration?: number;
  className?: string;
}

const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const transitionVariants: Record<TransitionType, Variants> = {
  fade: fadeVariants,
  slide: slideVariants,
  slideUp: slideUpVariants,
  scale: scaleVariants,
};

export function PageTransition({
  children,
  transition = "fade",
  duration = 0.3,
  className = "",
}: PageTransitionProps) {
  const pathname = usePathname();
  const variants = transitionVariants[transition];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Simple wrapper for content that should animate on mount
 * Does not track pathname changes
 */
interface ContentTransitionProps {
  children: ReactNode;
  transition?: TransitionType;
  duration?: number;
  delay?: number;
  className?: string;
}

export function ContentTransition({
  children,
  transition = "slideUp",
  duration = 0.3,
  delay = 0,
  className = "",
}: ContentTransitionProps) {
  const variants = transitionVariants[transition];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
