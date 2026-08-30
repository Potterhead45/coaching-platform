'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

// Subtle standard spring & easing transitions
const defaultTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  duration?: number;
  viewportOnce?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  className = '',
  duration = 0.5,
  viewportOnce = true,
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: viewportOnce, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  distance = 20,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className = '',
  hoverY = -4,
}: {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
}) {
  return (
    <motion.div
      whileHover={{
        y: hoverY,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({
  children,
  className = '',
  duration = 4,
  distance = 8,
}: {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function CountUp({
  value,
  suffix = '',
  prefix = '',
  className = '',
  duration = 1.6,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [displayValue, setDisplayValue] = useState<string>('0');

  // Extract raw numerical value and potential non-numeric characters (e.g. 15,000+ -> 15000)
  const rawString = String(value).replace(/,/g, '');
  const numericMatch = rawString.match(/[\d.]+/);
  const targetNumber = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const isDecimal = String(targetNumber).includes('.');
  const hasPlus = String(value).includes('+');
  const hasPercent = String(value).includes('%');

  useEffect(() => {
    if (!inView || targetNumber === 0) {
      if (inView && targetNumber === 0) setDisplayValue('0');
      return;
    }

    const controls = animate(0, targetNumber, {
      duration,
      ease: [0.16, 1, 0.3, 1], // expo out easing
      onUpdate: (latest) => {
        let formatted = '';
        if (isDecimal) {
          formatted = latest.toFixed(1);
        } else if (targetNumber >= 1000) {
          formatted = Math.round(latest).toLocaleString('en-US');
        } else {
          formatted = String(Math.round(latest));
        }

        if (hasPlus) formatted += '+';
        if (hasPercent) formatted += '%';
        setDisplayValue(formatted);
      },
    });

    return () => controls.stop();
  }, [inView, targetNumber, isDecimal, hasPlus, hasPercent, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {inView ? displayValue : '0'}
      {suffix}
    </span>
  );
}
