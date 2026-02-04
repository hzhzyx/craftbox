
import React, { useEffect, useRef } from 'react';

export const BackgroundEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      container.style.setProperty('--mouse-x', `${clientX}px`);
      container.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
    >
      {/* 1. 静态噪点纹理 (增加质感) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* 2. 动态流光背景 (深处的光斑) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-indigo-900/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />

      {/* 3. 鼠标聚光灯 (增强版：双层流光) */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.15), transparent 80%),
            radial-gradient(100px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.2), transparent 100%)
          `
        }}
      />
    </div>
  );
};
