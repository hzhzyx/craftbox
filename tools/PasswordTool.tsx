
import React, { useState } from 'react';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';

export const PasswordTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let charset = '';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  // Initial generation
  React.useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative p-8 bg-card border border-border rounded-2xl flex flex-col items-center gap-6 text-center">
          <div className="break-all font-mono text-3xl font-bold tracking-wider text-foreground">
            {password}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigator.clipboard.writeText(password)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
            >
              <Copy className="w-4 h-4" /> 复制
            </button>
            <button
              onClick={generate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" /> 重新生成
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-foreground block">
            密码长度: {length}
          </label>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'A-Z 大写字母', state: useUpper, set: setUseUpper },
            { label: 'a-z 小写字母', state: useLower, set: setUseLower },
            { label: '0-9 数字', state: useNumbers, set: setUseNumbers },
            { label: '#@! 特殊符号', state: useSymbols, set: setUseSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
              <input
                type="checkbox"
                checked={opt.state}
                onChange={(e) => opt.set(e.target.checked)}
                className="w-5 h-5 accent-primary rounded"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        使用浏览器 Crypto API 生成，安全无忧
      </div>
    </div>
  );
};
