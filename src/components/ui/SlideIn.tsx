"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * SlideIn component for slide entrance animations
 * Requirements: 7.1, 7.3
 */

type Direction = "up" | "down" | "left" | "right";

interface SlideInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

const getInitialPosition = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
};

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.3,
  distance = 20,
  className = "",
}: SlideInProps) {
  const initialPosition = getInitialPosition(direction, distance);

  const slideVariants: Variants = {
    hidden: {
      opacity: 0,
      ...initialPosition,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
