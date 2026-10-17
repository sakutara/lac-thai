import { describe, it, expect } from 'vitest';
import {
  calculateParallaxOffset,
  calculateCardTilt,
  resetCardTilt,
} from '../parallax.service';

describe('ParallaxService — 60fps Parallax & 3D Tilt Math (TDD)', () => {
  it('calculates vertical parallax offset and clamps within maxOffsetPx', () => {
    const res = calculateParallaxOffset(400, 100, {
      speedFactor: 0.3,
      maxOffsetPx: 180,
      direction: 'vertical',
      reducedMotion: false,
    });
    // (400 - 100) * 0.3 = 90
    expect(res.offsetY).toBe(90);
    expect(res.offsetX).toBe(0);
    expect(res.transformStyle).toBe('translate3d(0px, 90px, 0px)');

    // Test clamping when scroll delta is large
    const clamped = calculateParallaxOffset(2000, 0, {
      speedFactor: 0.5,
      maxOffsetPx: 120,
    });
    expect(clamped.offsetY).toBe(120);
    expect(clamped.transformStyle).toBe('translate3d(0px, 120px, 0px)');
  });

  it('supports horizontal direction and negative speedFactor for floating Thai leaves', () => {
    const res = calculateParallaxOffset(300, 100, {
      speedFactor: -0.2,
      direction: 'horizontal',
    });
    expect(res.offsetX).toBe(-40);
    expect(res.offsetY).toBe(0);
    expect(res.transformStyle).toBe('translate3d(-40px, 0px, 0px)');
  });

  it('returns zero offset when reducedMotion is enabled or speedFactor is 0', () => {
    const reduced = calculateParallaxOffset(500, 100, {
      speedFactor: 0.4,
      reducedMotion: true,
    });
    expect(reduced.offsetY).toBe(0);
    expect(reduced.transformStyle).toBe('translate3d(0px, 0px, 0px)');

    const zeroSpeed = calculateParallaxOffset(500, 100, {
      speedFactor: 0,
    });
    expect(zeroSpeed.offsetY).toBe(0);
  });

  it('calculates 3D card tilt based on cursor position and resets cleanly', () => {
    const rect = { left: 100, top: 100, width: 200, height: 200 };
    // Cursor at top-right corner (300, 100)
    const tilt = calculateCardTilt(300, 100, rect, 10, false);
    expect(tilt.rotateY).toBeGreaterThan(0);
    expect(tilt.rotateX).toBeGreaterThan(0);
    expect(tilt.scale).toBe(1.02);
    expect(tilt.transformStyle).toContain('perspective(1000px)');

    // Reduced motion returns flat card
    const flat = calculateCardTilt(300, 100, rect, 10, true);
    expect(flat.rotateX).toBe(0);
    expect(flat.rotateY).toBe(0);
    expect(flat.scale).toBe(1);

    const reset = resetCardTilt();
    expect(reset.rotateX).toBe(0);
    expect(reset.rotateY).toBe(0);
    expect(reset.scale).toBe(1);
  });
});
