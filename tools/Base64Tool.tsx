
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(btoa(input));
    } catch (e) {
      setOutput('错误：无效的编码输入');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('错误：无效的 Base64 字符串');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">输入</label>
        <textarea
          className="w-full h-40 p-4 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在此处粘贴文本或 Base64 字符串..."
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleEncode}
          className="flex-1 py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          编码
        </button>
        <button
          onClick={handleDecode}
          className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg border border-border hover:bg-secondary/80 transition-colors"
        >
          解码
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">输出</label>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制' : '复制结果'}
          </button>
        </div>
        <div className="w-full min-h-[10rem] p-4 bg-muted/30 border border-border rounded-lg font-mono break-all whitespace-pre-wrap">
          {output || <span className="text-muted-foreground">结果将在此处显示...</span>}
        </div>
      </div>
    </div>
  );
};
