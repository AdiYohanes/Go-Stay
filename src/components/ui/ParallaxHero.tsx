"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ParallaxHero component for hero sections
 * Requirements: 7.5
 *
 * Uses Framer Motion useScroll and useTransform hooks
 * for parallax scrolling effects
 */

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  overlayOpacity?: number;
  parallaxStrength?: number;
  minHeight?: string;
  className?: string;
}

export function ParallaxHero({
  children,
  backgroundImage,
  backgroundOverlay = true,
  overlayOpacity = 0.4,
  parallaxStrength = 0.3,
  minHeight = "60vh",
  className = "",
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax effect: background moves slower than scroll
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${parallaxStrength * 100}%`],
  );

  // Fade out content as user scrolls
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Scale down slightly as user scrolls
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ minHeight }}
    >
      {/* Parallax Background */}
      {backgroundImage && (
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: "120%",
              top: "-10%",
            }}
          />
          {backgroundOverlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </motion.div>
      )}

      {/* Content with fade and scale effects */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ opacity, scale, minHeight }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Simple parallax background without content effects
 */
interface ParallaxBackgroundProps {
  backgroundImage: string;
  parallaxStrength?: number;
  className?: string;
  children?: ReactNode;
}

export function ParallaxBackground({
  backgroundImage,
  parallaxStrength = 0.2,
  className = "",
  children,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxStrength * 50}%`, `${parallaxStrength * 50}%`],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            height: "150%",
            top: "-25%",
          }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
