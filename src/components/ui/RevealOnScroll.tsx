"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * RevealOnScroll component for content sections
 * Requirements: 7.5
 *
 * Uses Framer Motion useInView hook to trigger
 * animations when elements enter the viewport
 */

type RevealAnimation =
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "blur";

interface RevealOnScrollProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const blurVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

const animationVariants: Record<RevealAnimation, Variants> = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  blur: blurVariants,
};

export function RevealOnScroll({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const variants = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered reveal for lists of items
 */
interface StaggeredRevealProps {
  children: ReactNode[];
  animation?: RevealAnimation;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  itemClassName?: string;
}

export function StaggeredReveal({
  children,
  animation = "slideUp",
  staggerDelay = 0.1,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  className = "",
  itemClassName = "",
}: StaggeredRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const variants = animationVariants[animation];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants}
          transition={{ duration, ease: "easeOut" }}
          className={cn(itemClassName)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
