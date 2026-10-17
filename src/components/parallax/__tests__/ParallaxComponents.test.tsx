import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ParallaxSection,
  ParallaxLayer,
  ParallaxTiltCard,
} from '../ParallaxSection';

describe('Parallax Components — ParallaxSection, ParallaxLayer, ParallaxTiltCard (TDD)', () => {
  it('renders ParallaxSection with background image, decorative Thai leaves, and children', () => {
    render(
      <ParallaxSection
        backgroundImageUrl="https://lacthai.vn/www/uploads/images/Cover%20website.jpg"
        showThaiLeaves
        testId="hero-parallax"
      >
        <ParallaxLayer speedFactor={-0.15} testId="floating-layer">
          <span>Vị Thái chuẩn cho người sành</span>
        </ParallaxLayer>
      </ParallaxSection>
    );

    expect(screen.getByTestId('hero-parallax')).toBeInTheDocument();
    expect(screen.getByTestId('floating-layer')).toBeInTheDocument();
    expect(screen.getByText('Vị Thái chuẩn cho người sành')).toBeInTheDocument();
  });

  it('updates ParallaxTiltCard transform on mouseMove and resets on mouseLeave', () => {
    render(
      <ParallaxTiltCard testId="tilt-card">
        <div>Cá Trê Chiên Xù</div>
      </ParallaxTiltCard>
    );

    const card = screen.getByTestId('tilt-card');
    // Mock bounding rect so tilt calculation produces non-zero values
    card.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect;

    fireEvent.mouseMove(card, { clientX: 180, clientY: 20 });
    expect(card.style.transform).toContain('scale3d(1.02, 1.02, 1)');

    fireEvent.mouseLeave(card);
    expect(card.style.transform).toContain('rotateX(0deg) rotateY(0deg)');
  });
});
