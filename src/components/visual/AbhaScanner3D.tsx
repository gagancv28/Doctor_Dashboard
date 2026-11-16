import React, { useEffect, useRef } from 'react';

interface AbhaScanner3DProps {
  isScanning?: boolean;
  className?: string;
}

export const AbhaScanner3D: React.FC<AbhaScanner3DProps> = ({
  isScanning = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let laserY = 0;
    let laserDirection = 1;

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

      angle += 0.01;
      const centerX = width / 2;
      const centerY = height / 2;

      // Card dimensions
      const cardW = Math.min(width * 0.72, 220);
      const cardH = cardW * 0.63; // standard ID card ratio

      // Floating translation
      const floatY = Math.sin(angle * 1.5) * 3;

      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Subtle isometric 3D tilt
      ctx.transform(1, -0.04, 0.05, 0.95, 0, 0);

      // Card Shadow (tactile realistic soft shadow)
      ctx.shadowColor = 'rgba(11, 79, 138, 0.12)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;

      // Main Card Body (ABHA Health Card)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2DFD8';
      ctx.lineWidth = 1;

      const r = 8;
      const x = -cardW / 2;
      const y = -cardH / 2;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + cardW - r, y);
      ctx.quadraticCurveTo(x + cardW, y, x + cardW, y + r);
      ctx.lineTo(x + cardW, y + cardH - r);
      ctx.quadraticCurveTo(x + cardW, y + cardH, x + cardW - r, y + cardH);
      ctx.lineTo(x + r, y + cardH);
      ctx.quadraticCurveTo(x, y + cardH, x, y + cardH - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Card Top Header Stripe (Trust Blue)
      ctx.fillStyle = '#0B4F8A';
      ctx.fillRect(x, y, cardW, 16);

      // ABHA Card Title in header
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('NATIONAL HEALTH AUTHORITY', x + 8, y + 11);

      // 3D Abstract QR Code Matrix on Right
      const qrSize = cardH * 0.48;
      const qrX = x + cardW - qrSize - 12;
      const qrY = y + 26;

      ctx.fillStyle = '#F4F3EE';
      ctx.fillRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
      ctx.strokeStyle = '#E2DFD8';
      ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

      // Draw stylized QR code squares
      ctx.fillStyle = '#111111';
      const qCells = 5;
      const cellSize = qrSize / qCells;
      for (let rIdx = 0; rIdx < qCells; rIdx++) {
        for (let cIdx = 0; cIdx < qCells; cIdx++) {
          if (
            (rIdx === 0 && cIdx === 0) ||
            (rIdx === 0 && cIdx === qCells - 1) ||
            (rIdx === qCells - 1 && cIdx === 0) ||
            (rIdx === 2 && cIdx === 2) ||
            (rIdx === 1 && cIdx === 3) ||
            (rIdx === 3 && cIdx === 1)
          ) {
            ctx.fillRect(qrX + cIdx * cellSize + 1, qrY + rIdx * cellSize + 1, cellSize - 2, cellSize - 2);
          }
        }
      }

      // Patient Details Lines on Left
      ctx.fillStyle = '#0B4F8A';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('ABHA: 91-4829-1049-2819', x + 10, y + 34);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('Lakshmi Gowda', x + 10, y + 48);

      ctx.fillStyle = '#5E5B54';
      ctx.font = '7px sans-serif';
      ctx.fillText('lakshmi.gowda@abdm', x + 10, y + 59);
      ctx.fillText('Female • 34 Years • O+ve', x + 10, y + 69);

      // Gold Chip Visual
      ctx.fillStyle = '#E5C07B';
      ctx.fillRect(x + 10, y + 78, 18, 13);
      ctx.strokeStyle = '#D19A66';
      ctx.strokeRect(x + 10, y + 78, 18, 13);

      ctx.restore();

      // Laser Scanning Light Bar (Animated)
      if (isScanning) {
        laserY += 1.8 * laserDirection;
        if (laserY > cardH + 10) laserDirection = -1;
        if (laserY < -10) laserDirection = 1;

        ctx.save();
        ctx.translate(centerX, centerY + floatY);

        const currentLaserY = y + laserY;

        // Laser glow gradient
        const laserGrad = ctx.createLinearGradient(0, currentLaserY - 6, 0, currentLaserY + 6);
        laserGrad.addColorStop(0, 'rgba(11, 79, 138, 0)');
        laserGrad.addColorStop(0.5, 'rgba(11, 79, 138, 0.85)');
        laserGrad.addColorStop(1, 'rgba(11, 79, 138, 0)');

        ctx.fillStyle = laserGrad;
        ctx.fillRect(-cardW / 2 - 10, currentLaserY - 4, cardW + 20, 8);

        // Core laser beam
        ctx.strokeStyle = '#0B4F8A';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-cardW / 2 - 8, currentLaserY);
        ctx.lineTo(cardW / 2 + 8, currentLaserY);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
