
import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export const TimestampTool: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateTime, setDateTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimestamp = (ts: string) => {
    try {
      const val = ts.length === 13 ? parseInt(ts) : parseInt(ts) * 1000;
      if (isNaN(val)) return '无效时间戳';
      return new Date(val).toLocaleString();
    } catch {
      return '无效时间戳';
    }
  };

  const convertToTimestamp = (dtStr: string) => {
    try {
      const val = new Date(dtStr).getTime();
      if (isNaN(val)) return '无效日期格式';
      return Math.floor(val / 1000).toString();
    } catch {
      return '无效日期格式';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Current Time */}
      <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">当前时间 (Local)</span>
          <button onClick={() => copyToClipboard(Math.floor(now.getTime() / 1000).toString())} className="text-xs flex items-center gap-1 hover:text-primary transition-colors">
            <Copy className="w-3 h-3" /> 复制秒
          </button>
        </div>
        <div className="text-4xl font-mono font-black tracking-wider text-primary">
          {now.toLocaleTimeString()}
        </div>
        <div className="mt-2 text-sm font-mono text-muted-foreground">
          {Math.floor(now.getTime() / 1000)} (s) / {now.getTime()} (ms)
        </div>
      </div>

      {/* Converter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-bold">时间戳 → 本地时间</label>
          <div className="relative">
            <input 
              type="text" 
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full p-4 bg-secondary/50 border border-border rounded-xl font-mono focus:ring-2 focus:ring-primary outline-none"
              placeholder="输入 10 位或 13 位时间戳..."
            />
          </div>
          <div className="p-4 bg-muted rounded-xl min-h-[56px] flex items-center font-mono">
            {formatTimestamp(timestamp)}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold">本地时间 → 时间戳</label>
          <div className="relative">
            <input 
              type="text" 
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full p-4 bg-secondary/50 border border-border rounded-xl font-mono focus:ring-2 focus:ring-primary outline-none"
              placeholder="2024-01-01 12:00:00"
            />
          </div>
          <div className="p-4 bg-muted rounded-xl min-h-[56px] flex items-center font-mono">
            {dateTime ? convertToTimestamp(dateTime) : '等待输入...'}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
        支持自动识别秒 (10位) 和 毫秒 (13位)
      </div>
    </div>
  );
};
