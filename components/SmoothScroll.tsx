'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: 0.1,
        smoothWheel: true,
      }}
      ref={lenisRef}
    />
  );
}
