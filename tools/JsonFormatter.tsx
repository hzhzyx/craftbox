
import React, { useState } from 'react';
import { Copy, Check, Braces } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
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
        <label className="text-sm font-medium text-muted-foreground">原始 JSON</label>
        <textarea
          className="w-full h-48 p-4 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"键": "值"}'
        />
      </div>

      <div className="flex gap-2 sm:gap-4 flex-wrap">
        <button
          onClick={() => formatJson(2)}
          className="flex-1 min-w-[120px] py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Braces className="w-4 h-4" /> 2 空格缩进
        </button>
        <button
          onClick={() => formatJson(4)}
          className="flex-1 min-w-[120px] py-2 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg border border-border hover:bg-secondary/80 transition-colors"
        >
          4 空格缩进
        </button>
        <button
          onClick={minifyJson}
          className="flex-1 min-w-[120px] py-2 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg border border-border hover:bg-secondary/80 transition-colors"
        >
          压缩 JSON
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          <strong>错误：</strong> {error}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">格式化结果</label>
          {output && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制结果'}
            </button>
          )}
        </div>
        <pre className="w-full min-h-[12rem] p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm overflow-auto max-h-[30rem]">
          {output || <span className="text-muted-foreground">输出结果将在此处显示...</span>}
        </pre>
      </div>
    </div>
  );
};
