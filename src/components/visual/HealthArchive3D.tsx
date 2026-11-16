import React, { useEffect, useRef } from 'react';

interface HealthArchive3DProps {
  className?: string;
  variant?: 'compact' | 'hero' | 'timeline';
}

export const HealthArchive3D: React.FC<HealthArchive3DProps> = ({
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
    let angle = 0;

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
      angle += 0.008;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle precision grid backdrop
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.03)';
      ctx.lineWidth = 0.5;
      const step = 20;
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw 4 layered translucent health archive document sheets in subtle isometric 3D perspective
      const sheets = [
        { z: -30, offset: -16, opacity: 0.15, isAccent: false, label: 'LAB RECORD' },
        { z: -10, offset: -8, opacity: 0.25, isAccent: false, label: 'PRESCRIPTION' },
        { z: 10, offset: 0, opacity: 0.65, isAccent: false, label: 'DISCHARGE' },
        { z: 30, offset: 8, opacity: 0.95, isAccent: true, label: 'CODESCRIBE AI' },
      ];

      sheets.forEach((sheet, idx) => {
        const floatY = Math.sin(angle + idx * 0.8) * 4;
        const sheetWidth = Math.min(width * 0.68, 200);
        const sheetHeight = sheetWidth * 1.35;

        // Isometric offset
        const isoX = centerX + sheet.offset + Math.cos(angle * 0.5) * 4;
        const isoY = centerY + sheet.offset * 0.6 + floatY;

        ctx.save();
        ctx.translate(isoX, isoY);

        // Skew slightly for subtle 3D paper stack feel
        ctx.transform(1, -0.05, 0.08, 0.92, 0, 0);

        // Sheet background
        ctx.fillStyle = sheet.isAccent ? '#FAF9F6' : '#FFFFFF';
        ctx.strokeStyle = sheet.isAccent ? 'rgba(13, 92, 58, 0.4)' : 'rgba(226, 223, 216, 0.8)';
        ctx.lineWidth = sheet.isAccent ? 1.5 : 1;

        // Soft shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Draw rounded card
        const r = 3;
        const w = sheetWidth;
        const h = sheetHeight;
        const x = -w / 2;
        const y = -h / 2;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        // Draw clinical document lines inside the sheet
        if (sheet.isAccent || idx >= 2) {
          ctx.fillStyle = sheet.isAccent ? 'rgba(13, 92, 58, 0.8)' : 'rgba(17, 17, 17, 0.2)';
          // Mini header bar
          ctx.fillRect(x + 12, y + 14, w * 0.45, 4);

          // Body lines
          ctx.fillStyle = 'rgba(17, 17, 17, 0.08)';
          ctx.fillRect(x + 12, y + 26, w * 0.75, 2.5);
          ctx.fillRect(x + 12, y + 33, w * 0.65, 2.5);
          ctx.fillRect(x + 12, y + 40, w * 0.8, 2.5);

          // Clinical waveform signal line on top sheet
          if (sheet.isAccent) {
            ctx.strokeStyle = '#0D5C3A';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const startLineY = y + 54;
            for (let lx = 0; lx < w * 0.75; lx += 2) {
              const ly = startLineY + Math.sin(lx * 0.15 + angle * 2) * 3;
              if (lx === 0) ctx.moveTo(x + 12 + lx, ly);
              else ctx.lineTo(x + 12 + lx, ly);
            }
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
