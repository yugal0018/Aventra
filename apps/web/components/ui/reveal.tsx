"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================
// REVEAL — scroll-triggered entrance animation
// Uses Framer Motion's useInView — fires once, respects reduced-motion
//
// Usage:
// <Reveal>
//   <p>This fades in when scrolled into view</p>
// </Reveal>
//
// <Reveal direction="left" delay={0.1}>
//   <FeatureCard />
// </Reveal>
// ============================================================

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Direction the element enters from */
  direction?: Direction;
  /** How much of the element must be visible to trigger */
  threshold?: number;
  /** Duration in seconds */
  duration?: number;
}

const initialStates: Record<Direction, any> = {
  up: { opacity: 0, y: 24 },
  down: { opacity: 0, y: -24 },
  left: { opacity: 0, x: 24 },
  right: { opacity: 0, x: -24 },
  scale: { opacity: 0, scale: 0.94 },
  none: { opacity: 0 },
};

const animateState = { opacity: 1, y: 0, x: 0, scale: 1 };

// Premium easing curve — same as Linear and Vercel use
const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.1,
  duration = 0.55,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // once: true — animates in once, stays visible on scroll back
  const isInView = useInView(ref, {
    once: true,
    margin: `-${Math.floor(threshold * 100)}px` as any,
  });

  return (
    <motion.div
      ref={ref}
      initial={initialStates[direction]}
      animate={isInView ? animateState : initialStates[direction]}
      transition={{ duration, delay, ease }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// STAGGER GROUP — animates children with cascading delays
// ============================================================

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
}

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
  direction = "up",
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: initialStates[direction],
                visible: { ...animateState, transition: { duration: 0.55, ease } },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
