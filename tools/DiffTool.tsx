import React, { useState, useEffect } from 'react';
import { diffLines, Change } from 'diff';
import { Split, FileDiff } from 'lucide-react';

export const DiffTool: React.FC = () => {
  const [oldText, setOldText] = useState(`{
  "name": "devbox",
  "version": "1.0.0"
}`);
  const [newText, setNewText] = useState(`{
  "name": "devbox-pro",
  "version": "2.0.0",
  "private": true
}`);
  const [diff, setDiff] = useState<Change[]>([]);

  useEffect(() => {
    setDiff(diffLines(oldText, newText));
  }, [oldText, newText]);

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      <div className="grid grid-cols-2 gap-4 flex-shrink-0">
        <div className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
          <FileDiff className="w-4 h-4" /> 原始内容 (Old)
        </div>
        <div className="text-sm font-bold flex items-center gap-2 text-primary">
          <FileDiff className="w-4 h-4" /> 修改后 (New)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
        <textarea
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
          className="w-full h-full p-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm resize-none"
          placeholder="粘贴旧文本..."
        />
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full h-full p-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm resize-none"
          placeholder="粘贴新文本..."
        />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden flex-shrink-0 max-h-[40%] overflow-y-auto">
        <div className="p-2 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-widest sticky top-0">
          Diff Result
        </div>
        <div className="p-4 font-mono text-sm">
          {diff.map((part, index) => {
            const color = part.added ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                          part.removed ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 
                          'text-muted-foreground';
            const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
            return (
              <span key={index} className={`block ${color} px-1 rounded hover:opacity-80`}>
                {part.value.split('\n').filter(l => l).map((line, i) => (
                    <div key={i}>{prefix}{line}</div>
                ))}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
