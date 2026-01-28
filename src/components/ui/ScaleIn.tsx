"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * ScaleIn component for scale entrance animations
 * Requirements: 7.1, 7.3
 */

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  initialScale = 0.9,
  className = "",
}: ScaleInProps) {
  const scaleVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
