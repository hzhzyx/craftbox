
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col p-6 bg-white/[0.02] border border-white/[0.05] rounded-[24px] card-hover-effect overflow-hidden text-left"
    >
      {/* 装饰性的背景编号 */}
      <span className="absolute top-4 right-6 text-white/[0.02] font-black text-4xl italic group-hover:text-primary/10 transition-colors">
        {tool.id.slice(0, 2).toUpperCase()}
      </span>

      <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all group-hover:scale-110 group-hover:-rotate-3 text-muted-foreground group-hover:text-primary">
        {tool.icon}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-bold tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm text-muted-foreground/60 leading-relaxed line-clamp-2 font-medium">
          {tool.description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-white/[0.02] flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
          LOCAL_ONLY
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
      </div>
    </button>
  );
};
