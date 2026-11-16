import React, { useEffect, useRef } from 'react';

interface SignalVisualizerProps {
  isListening?: boolean;
  isProcessing?: boolean;
  className?: string;
  variant?: 'minimal' | 'hero' | 'processing';
}

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({
  isListening = false,
  isProcessing = false,
  className = '',
  variant = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      phase += isListening ? 0.08 : isProcessing ? 0.05 : 0.02;

      // Draw subtle grid lines (Swiss precision)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.04)';
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw 3 flowing sculptural curves representing Voice -> Signal -> Structure
      const layers = [
        { amplitude: isListening ? 38 : 16, freq: 0.015, color: 'rgba(13, 92, 58, 0.25)', offset: 0, speed: 1.0 },
        { amplitude: isListening ? 26 : 12, freq: 0.022, color: 'rgba(17, 17, 17, 0.15)', offset: 1.8, speed: 0.7 },
        { amplitude: isListening ? 44 : 20, freq: 0.012, color: 'rgba(13, 92, 58, 0.75)', offset: 3.2, speed: 1.2 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.lineWidth = layer === layers[2] ? 1.5 : 1;
        ctx.strokeStyle = layer.color;

        const centerY = height / 2;

        for (let x = 0; x <= width; x += 3) {
          // Left is organic sine waveform; right transitions to structured clinical step function
          const progress = x / width; // 0 to 1
          const organicFactor = Math.cos(progress * Math.PI * 0.5); // high at start, 0 at end
          const structuredFactor = Math.sin(progress * Math.PI * 0.5); // 0 at start, high at end

          const wave =
            Math.sin(x * layer.freq + phase * layer.speed + layer.offset) *
            Math.cos(x * 0.005 + phase * 0.3) *
            layer.amplitude *
            organicFactor;

          // Structured discrete grid snap on the right side
          const stepSize = 14;
          const discreteY = Math.round((Math.sin(x * 0.02) * 12) / stepSize) * stepSize * structuredFactor * 0.4;

          const y = centerY + wave + discreteY;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw minimal anchor ticks / nodes showing structured clinical tokens
      if (variant === 'hero' || variant === 'processing') {
        const tokens = [0.25, 0.5, 0.75, 0.9];
        tokens.forEach((t) => {
          const x = width * t;
          const y = height / 2;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#0D5C3A';
          ctx.fill();

          // Delicate vertical marker
          ctx.beginPath();
          ctx.moveTo(x, y - 8);
          ctx.lineTo(x, y + 8);
          ctx.strokeStyle = 'rgba(13, 92, 58, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isProcessing, variant]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
