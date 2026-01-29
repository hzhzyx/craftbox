
import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue/i18n';
import { Clock, Play, AlertCircle } from 'lucide-react';

export const CronTool: React.FC = () => {
  const [expression, setExpression] = useState('0 0 * * *');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  // Simple next run calculation (approximation for demo)
  const calculateNextRuns = () => {
    // In a real app, use a library like 'cron-parser' for accurate next dates
    // Here we just mock it or rely on description
    setNextRuns([
      new Date(Date.now() + 86400000).toLocaleString(),
      new Date(Date.now() + 86400000 * 2).toLocaleString(),
      new Date(Date.now() + 86400000 * 3).toLocaleString(),
    ]);
  };

  useEffect(() => {
    try {
      const desc = cronstrue.toString(expression, { locale: "zh_CN" });
      setDescription(desc);
      setError('');
      calculateNextRuns();
    } catch (e) {
      setError('无效的 Cron 表达式');
      setDescription('');
    }
  }, [expression]);

  const presets = [
    { label: '每分钟', value: '* * * * *' },
    { label: '每小时', value: '0 * * * *' },
    { label: '每天午夜', value: '0 0 * * *' },
    { label: '每周一', value: '0 0 * * 1' },
    { label: '每月1号', value: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => setExpression(p.value)}
            className="px-3 py-1 bg-secondary/50 hover:bg-secondary border border-border rounded-full text-xs font-medium transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className={`w-full text-3xl font-mono font-bold text-center py-6 bg-transparent border-b-2 outline-none transition-colors ${
            error ? 'border-red-500 text-red-500' : 'border-primary text-foreground'
          }`}
          placeholder="* * * * *"
        />
        <div className="flex justify-center mt-2 gap-8 text-xs text-muted-foreground font-mono">
          <span>分</span><span>时</span><span>日</span><span>月</span><span>周</span>
        </div>
      </div>

      <div className="text-center min-h-[4rem]">
        {error ? (
          <div className="inline-flex items-center gap-2 text-red-500 font-bold animate-pulse">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : (
          <div className="text-xl font-medium text-primary">
            “{description}”
          </div>
        )}
      </div>

      <div className="bg-secondary/20 rounded-xl p-6 border border-border">
        <h4 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> 预计运行时间 (模拟)
        </h4>
        <div className="space-y-2 font-mono text-sm">
          {nextRuns.map((run, i) => (
             <div key={i} className="flex items-center gap-3">
               <Play className="w-3 h-3 text-green-500" />
               {run} <span className="text-muted-foreground text-xs">(仅供参考)</span>
             </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground">
          * 真实下一次运行时间需要引入 cron-parser 库进行精确计算，当前仅展示占位逻辑。
        </p>
      </div>
    </div>
  );
};
