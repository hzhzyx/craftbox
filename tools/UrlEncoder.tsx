
import React, { useState } from 'react';
import { Copy, ArrowRightLeft } from 'lucide-react';

export const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
    } catch (e) {
      setOutput('Error: Malformed URL sequence');
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    process(val, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    process(input, newMode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 px-6 py-2 bg-secondary/50 rounded-full font-bold text-sm hover:bg-secondary transition-colors"
        >
          {mode === 'encode' ? '编码 (Encode)' : '解码 (Decode)'}
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">输入</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full h-32 p-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的 URL...'}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">结果</label>
        <div className="relative">
          <textarea
            readOnly
            value={output}
            className="w-full h-32 p-4 bg-background border border-border rounded-xl focus:outline-none resize-none"
          />
          {output && (
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="absolute right-4 bottom-4 p-2 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
