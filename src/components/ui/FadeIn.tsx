"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * FadeIn component for fade entrance animations
 * Requirements: 7.1, 7.3
 */

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { delay: number; duration: number }) => ({
    opacity: 1,
    transition: {
      delay: custom.delay,
      duration: custom.duration,
    },
  }),
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  className = "",
}: FadeInProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      custom={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
