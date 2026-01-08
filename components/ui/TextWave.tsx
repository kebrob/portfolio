'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

interface TextWaveProps {
  text: string;
  className?: string;
  loop?: boolean;
  speed?: number;
  direction?: 'left' | 'right';
  delay?: number;
  invertBox?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export default function TextWave({
  text,
  className = '',
  loop = true,
  speed = 50,
  direction = 'right',
  delay = 0,
  invertBox,
}: Readonly<TextWaveProps>) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const chars = text.split('');

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    let animation: any;
    let timeoutId: NodeJS.Timeout;

    const charCount = chars.length;

    const mapRange = (value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) => {
      if (fromLow === fromHigh) return toLow;
      const percentage = (value - fromLow) / (fromHigh - fromLow);
      return toLow + percentage * (toHigh - toLow);
    };

    const runAnimation = () => {
      const start = direction === 'right' ? 0 : charCount - 1;
      const end = direction === 'right' ? charCount - 1 : 0;
      const duration = Math.exp(mapRange(speed, 0, 100, Math.log(0.3), Math.log(0.01))) * charCount;

      animation = animate(start, end, {
        ease: 'linear',
        duration,
        onUpdate: (value) => {
          const newIndex = Math.round(value);
          if (newIndex !== currentIndexRef.current) {
            // Remove highlight from previous character
            const prevChar = charsRef.current[currentIndexRef.current];
            if (prevChar && invertBox) {
              prevChar.style.backgroundColor = '';
              prevChar.style.color = '';
            }

            // Add highlight to current character
            const currentChar = charsRef.current[newIndex];
            if (currentChar && invertBox) {
              currentChar.style.backgroundColor = invertBox.backgroundColor || '#000';
              currentChar.style.color = invertBox.textColor || '#fff';
            }

            currentIndexRef.current = newIndex;
          }
        },
        onComplete: () => {
          // Clear the last character
          const lastChar = charsRef.current[currentIndexRef.current];
          if (lastChar && invertBox) {
            lastChar.style.backgroundColor = '';
            lastChar.style.color = '';
          }

          if (loop) {
            timeoutId = setTimeout(runAnimation, delay * 1000);
          }
        },
      });
    };

    if (delay > 0) {
      timeoutId = setTimeout(runAnimation, delay * 1000);
    } else {
      runAnimation();
    }

    return () => {
      animation?.stop();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isReady, chars.length, loop, speed, direction, delay, invertBox]);

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline-block' }}>
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charsRef.current[i] = el;
          }}
          style={{
            display: 'inline-block',
            willChange: 'background-color, color',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
