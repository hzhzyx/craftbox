
import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const JwtTool: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!token) {
      setHeader('');
      setPayload('');
      setError(null);
      return;
    }

    try {
      const decodedHeader = jwtDecode(token, { header: true });
      const decodedPayload = jwtDecode(token);
      
      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);
    } catch (e) {
      setError('无效的 JWT 格式');
      setHeader('');
      setPayload('');
    }
  }, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-muted-foreground">Encoded Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={`flex-grow w-full p-4 bg-secondary/30 border rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'}`}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
        {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}
        {!error && token && (
            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> 解码成功
            </div>
        )}
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-bold text-red-500 uppercase tracking-widest">Header</label>
          <pre className="flex-grow p-4 bg-background border border-border rounded-xl font-mono text-xs overflow-auto text-red-600 dark:text-red-400">
            {header || '// Header'}
          </pre>
        </div>
        <div className="flex flex-col gap-2 flex-[2] min-h-0">
          <label className="text-sm font-bold text-purple-500 uppercase tracking-widest">Payload</label>
          <pre className="flex-grow p-4 bg-background border border-border rounded-xl font-mono text-xs overflow-auto text-purple-600 dark:text-purple-400">
            {payload || '// Payload Data'}
          </pre>
        </div>
      </div>
    </div>
  );
};
