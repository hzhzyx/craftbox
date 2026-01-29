import React, { useState, useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';

export const RegexTool: React.FC = () => {
  const [regexStr, setRegexStr] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('Hello world! My email is test@example.com and my phone is 123-456-7890.');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState('');

  const templates = [
    { name: 'Email', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', flags: 'gm' },
    { name: 'URL', regex: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)', flags: 'gm' },
    { name: 'Phone (US)', regex: '\d{3}-\d{3}-\d{4}', flags: 'gm' },
    { name: 'Date (YYYY-MM-DD)', regex: '\d{4}-\d{2}-\d{2}', flags: 'gm' },
    { name: 'IPv4', regex: '\b(?:\d{1,3}\.){3}\d{1,3}\b', flags: 'gm' },
  ];

  useEffect(() => {
    try {
      if (!regexStr) {
        setMatches([]);
        setError('');
        return;
      }
      const regex = new RegExp(regexStr, flags);
      const allMatches = Array.from(text.matchAll(regex));
      setMatches(allMatches);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  }, [regexStr, flags, text]);

  const applyTemplate = (t: typeof templates[0]) => {
    setRegexStr(t.regex);
    setFlags(t.flags);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {templates.map(t => (
          <button
            key={t.name}
            onClick={() => applyTemplate(t)}
            className="flex-shrink-0 px-3 py-1 bg-secondary/50 border border-border rounded-full text-xs font-medium hover:bg-secondary transition-colors"
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-grow relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">/</span>
            <input
              type="text"
              value={regexStr}
              onChange={(e) => setRegexStr(e.target.value)}
              className={`w-full h-12 pl-6 pr-4 bg-secondary/30 border rounded-xl font-mono focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'}`}
              placeholder="输入正则表达式..."
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">/</span>
          </div>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-20 h-12 px-3 bg-secondary/30 border border-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="flags"
          />
        </div>
        {error && <div className="text-xs text-red-500 font-mono">{error}</div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-bold text-muted-foreground uppercase">测试文本</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow w-full p-4 bg-secondary/30 border border-border rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="输入要匹配的文本..."
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground uppercase">匹配结果 ({matches.length})</label>
          </div>
          <div className="flex-grow w-full p-4 bg-background border border-border rounded-xl font-mono text-sm overflow-y-auto">
            {matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((match, i) => (
                  <div key={i} className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Match {i + 1}</span>
                      <span>Index: {match.index}</span>
                    </div>
                    <div className="break-all font-bold text-green-700 dark:text-green-400">
                      {match[0]}
                    </div>
                    {match.length > 1 && (
                      <div className="mt-2 pl-2 border-l-2 border-green-500/20 space-y-1">
                        {Array.from(match).slice(1).map((group, gi) => (
                           <div key={gi} className="text-xs">
                             <span className="text-muted-foreground">Group {gi + 1}: </span>
                             <span className="bg-background px-1 rounded">{group}</span>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Info className="w-8 h-8 mb-2" />
                <span>暂无匹配项</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
