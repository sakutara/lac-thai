import {
  ParallaxLayerConfig,
  ParallaxTransformResult,
  Tilt3DValues,
} from '../domain/models';

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateParallaxOffset(
  scrollY: number,
  elementTop: number,
  config: ParallaxLayerConfig
): ParallaxTransformResult {
  if (config.reducedMotion || config.speedFactor === 0) {
    return {
      offsetX: 0,
      offsetY: 0,
      transformStyle: 'translate3d(0px, 0px, 0px)',
    };
  }

  const maxOffset = config.maxOffsetPx ?? 180;
  const rawDelta = (scrollY - elementTop) * config.speedFactor;
  const clampedDelta = Number(clampValue(rawDelta, -maxOffset, maxOffset).toFixed(2));

  if (config.direction === 'horizontal') {
    return {
      offsetX: clampedDelta,
      offsetY: 0,
      transformStyle: `translate3d(${clampedDelta}px, 0px, 0px)`,
    };
  }

  return {
    offsetX: 0,
    offsetY: clampedDelta,
    transformStyle: `translate3d(0px, ${clampedDelta}px, 0px)`,
  };
}

export function calculateCardTilt(
  cursorX: number,
  cursorY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxTiltDeg: number = 8,
  reducedMotion: boolean = false
): Tilt3DValues {
  if (reducedMotion || rect.width <= 0 || rect.height <= 0) {
    return resetCardTilt();
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const normX = clampValue((cursorX - centerX) / (rect.width / 2), -1, 1);
  const normY = clampValue((cursorY - centerY) / (rect.height / 2), -1, 1);

  const rotateY = Number((normX * maxTiltDeg).toFixed(2));
  const rotateX = Number((-normY * maxTiltDeg).toFixed(2));
  const scale = 1.02;

  return {
    rotateX,
    rotateY,
    scale,
    transformStyle: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`,
  };
}

export function resetCardTilt(): Tilt3DValues {
  return {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transformStyle: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  };
}
