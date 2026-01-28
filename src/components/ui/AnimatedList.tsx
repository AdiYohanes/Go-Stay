"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * AnimatedList component with stagger support
 * Requirements: 7.1, 7.3
 *
 * Renders a list of items with staggered entrance animations
 */

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  staggerDelay?: number;
  animation?: "fade" | "slide" | "scale";
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const animationVariants = {
  fade: fadeVariants,
  slide: slideVariants,
  scale: scaleVariants,
};

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  staggerDelay = 0.1,
  animation = "slide",
  className = "",
}: AnimatedListProps<T>) {
  const itemVariants = animationVariants[animation];

  const customContainerVariants: Variants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={customContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={keyExtractor(item)} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
