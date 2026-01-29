
import React, { useState } from 'react';
import { Search, Loader2, Globe, Server } from 'lucide-react';

export const DnsTool: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('A');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch(`https://cloudflare-dns.com/query?name=${domain}&type=${type}`, {
        headers: { accept: 'application/dns-json' }
      });
      const data = await res.json();
      setResults(data.Answer || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="输入域名，例如 google.com"
            className="w-full h-12 pl-4 pr-12 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            onClick={lookup}
            disabled={loading}
            className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        <select 
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-12 px-4 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {results.length > 0 ? (
          results.map((res, i) => (
            <div key={i} className="p-4 bg-secondary/30 border border-border rounded-xl flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="p-2 bg-background rounded-lg border border-border">
                <Server className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-grow">
                <div className="text-sm font-mono font-bold">{res.data}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  TTL: {res.TTL} | TYPE: {res.type}
                </div>
              </div>
            </div>
          ))
        ) : !loading && domain ? (
          <div className="py-12 text-center text-muted-foreground italic">
            没有找到解析记录。
          </div>
        ) : null}
      </div>

      {!domain && (
        <div className="py-12 flex flex-col items-center gap-4 text-muted-foreground opacity-50">
          <Globe className="w-12 h-12" />
          <p className="text-sm">请输入域名并选择记录类型开始探测</p>
        </div>
      )}
    </div>
  );
};
