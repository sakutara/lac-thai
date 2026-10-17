import React, { useState } from 'react';
import { useParallax } from '../../hooks/useParallax';
import { calculateCardTilt, resetCardTilt } from '../../services/parallax.service';

export interface ParallaxSectionProps {
  backgroundImageUrl?: string;
  speedFactor?: number;
  overlayClassName?: string;
  className?: string;
  showThaiLeaves?: boolean;
  testId?: string;
  children: React.ReactNode;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImageUrl,
  speedFactor = 0.22,
  overlayClassName = 'bg-gradient-to-b from-[#0B1F17]/80 via-[#0B1F17]/65 to-[#0B1F17]/90',
  className = '',
  showThaiLeaves = false,
  testId,
  children,
}) => {
  const bgParallax = useParallax({ speedFactor, maxOffsetPx: 140 });
  const leafTopParallax = useParallax({ speedFactor: -0.15, maxOffsetPx: 90 });
  const leafBottomParallax = useParallax({ speedFactor: 0.18, maxOffsetPx: 90 });

  return (
    <section
      data-testid={testId}
      className={`relative overflow-hidden ${className}`}
    >
      {backgroundImageUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-24 inset-x-0 z-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url("${backgroundImageUrl}")`,
            transform: bgParallax.transformStyle,
          }}
        />
      )}

      {backgroundImageUrl && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-0 ${overlayClassName}`}
        />
      )}

      {showThaiLeaves && (
        <>
          <div
            aria-hidden="true"
            style={{ transform: leafTopParallax.transformStyle }}
            className="pointer-events-none absolute -top-8 left-6 z-0 h-36 w-36 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 blur-xl"
          />
          <div
            aria-hidden="true"
            style={{ transform: leafBottomParallax.transformStyle }}
            className="pointer-events-none absolute -bottom-10 right-8 z-0 h-44 w-44 rounded-full border border-[#D4AF37]/20 bg-[#123528]/40 blur-xl"
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </section>
  );
};

export interface ParallaxLayerProps {
  speedFactor?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  testId?: string;
  children: React.ReactNode;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  speedFactor = -0.12,
  direction = 'vertical',
  className = '',
  testId,
  children,
}) => {
  const { transformStyle } = useParallax({ speedFactor, direction });

  return (
    <div
      data-testid={testId}
      style={{ transform: transformStyle }}
      className={`will-change-transform transition-transform duration-75 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

export interface ParallaxTiltCardProps {
  className?: string;
  maxTiltDeg?: number;
  testId?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ParallaxTiltCard: React.FC<ParallaxTiltCardProps> = ({
  className = '',
  maxTiltDeg = 7,
  testId,
  children,
  onClick,
}) => {
  const [transformStyle, setTransformStyle] = useState<string>(
    resetCardTilt().transformStyle
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tilt = calculateCardTilt(
      event.clientX,
      event.clientY,
      rect,
      maxTiltDeg
    );
    setTransformStyle(tilt.transformStyle);
  };

  const handleMouseLeave = () => {
    setTransformStyle(resetCardTilt().transformStyle);
  };

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};
