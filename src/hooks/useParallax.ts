import { useState, useEffect } from 'react';
import { calculateParallaxOffset } from '../services/parallax.service';
import { ParallaxLayerConfig, ParallaxTransformResult } from '../domain/models';

export interface UseParallaxOptions extends ParallaxLayerConfig {
  elementTop?: number;
}

export function useParallax(options: UseParallaxOptions): ParallaxTransformResult {
  const {
    speedFactor,
    direction = 'vertical',
    maxOffsetPx = 180,
    reducedMotion = false,
    elementTop = 0,
  } = options;

  const [result, setResult] = useState<ParallaxTransformResult>(() =>
    calculateParallaxOffset(
      typeof window !== 'undefined' ? window.scrollY : 0,
      elementTop,
      { speedFactor, direction, maxOffsetPx, reducedMotion }
    )
  );

  useEffect(() => {
    const handleScroll = () => {
      const next = calculateParallaxOffset(window.scrollY, elementTop, {
        speedFactor,
        direction,
        maxOffsetPx,
        reducedMotion,
      });
      setResult(next);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speedFactor, direction, maxOffsetPx, reducedMotion, elementTop]);

  return result;
}
