
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Copy } from 'lucide-react';

export const HashTool: React.FC = () => {
  const [input, setInput] = useState('');

  const calculate = (text: string, algo: any) => {
    try {
      return algo(text).toString();
    } catch {
      return '';
    }
  };

  const algos = [
    { name: 'MD5', val: calculate(input, CryptoJS.MD5) },
    { name: 'SHA-1', val: calculate(input, CryptoJS.SHA1) },
    { name: 'SHA-256', val: calculate(input, CryptoJS.SHA256) },
    { name: 'SHA-512', val: calculate(input, CryptoJS.SHA512) },
    { name: 'RIPEMD-160', val: calculate(input, CryptoJS.RIPEMD160) },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 p-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="输入任意内容..."
        />
      </div>

      <div className="space-y-4">
        {algos.map((algo) => (
          <div key={algo.name} className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">{algo.name}</label>
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={algo.val}
                className="w-full p-3 bg-muted/30 border border-border rounded-lg font-mono text-sm text-foreground/80 focus:outline-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(algo.val)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
