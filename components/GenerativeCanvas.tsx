import React, { useMemo } from 'react';
import { VisualConfig } from '../types';

interface Props {
  config: VisualConfig;
}

export const GenerativeCanvas: React.FC<Props> = ({ config }) => {
  
  // Create abstract shapes based on config
  const shapes = useMemo(() => {
    return Array.from({ length: config.complexity === 'complex' ? 6 : 3 }).map((_, i) => {
      // Deterministic randomness based on index for stability during render
      const size = 30 + (i * 15); 
      const delay = i * 0.5;
      
      let animationClass = '';
      if (config.animationSpeed === 'slow') animationClass = 'animate-pulse-slow';
      else if (config.animationSpeed === 'fast') animationClass = 'animate-bounce';
      else if (config.animationSpeed === 'chaos') animationClass = 'animate-ping';
      else animationClass = 'animate-float';

      let borderRadius = '';
      if (config.shapeStyle === 'rounded') borderRadius = '50%';
      else if (config.shapeStyle === 'sharp') borderRadius = '0%';
      else if (config.shapeStyle === 'liquid') borderRadius = `${30 + (i*10)}% ${70 - (i*10)}% ${50 + (i*5)}% ${50 - (i*5)}% / ${30 + (i*5)}%`;

      return {
        id: i,
        style: {
          width: `${size}%`,
          height: `${size}%`,
          backgroundColor: config.colors[i % config.colors.length],
          borderRadius: borderRadius,
          position: 'absolute' as const,
          top: `${20 + (i * 10)}%`,
          left: `${10 + (i * 15)}%`,
          filter: 'blur(40px)',
          opacity: 0.6,
          animationDelay: `${delay}s`,
          transform: `rotate(${i * 45}deg)`,
          mixBlendMode: 'screen' as const
        },
        animationClass
      };
    });
  }, [config]);

  return (
    // Adjusted height: h-56 for mobile, h-80 for desktop
    <div className="w-full h-56 sm:h-64 md:h-80 bg-black/80 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
      {/* Background Base */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: config.colors[0] }}
      ></div>

      {/* Generated Shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`transition-all duration-1000 ${shape.animationClass}`}
          style={shape.style}
        ></div>
      ))}

      {/* Noise Texture Overlay for "Artifact" feel */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-2 w-full animate-[float_3s_linear_infinite] pointer-events-none"></div>
    </div>
  );
};