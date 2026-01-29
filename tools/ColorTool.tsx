
import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export const ColorTool: React.FC = () => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; 
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const rgbVal = hexToRgb(val);
      if (rgbVal) {
        setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
        const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      }
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div 
          className="w-48 h-48 rounded-full shadow-2xl transition-colors duration-300 border-4 border-white dark:border-gray-800"
          style={{ backgroundColor: hex }}
        />
        <input 
          type="color" 
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="w-full h-12 cursor-pointer opacity-0 absolute" 
        />
        <div className="text-sm text-muted-foreground text-center">
          点击上方色块或使用下方输入框调整颜色
        </div>
      </div>

      <div className="space-y-6">
        {[
          { label: 'HEX', value: hex, onChange: handleHexChange },
          { label: 'RGB', value: rgb, readOnly: true },
          { label: 'HSL', value: hsl, readOnly: true },
        ].map((field) => (
          <div key={field.label} className="space-y-2 group">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
            <div className="relative">
              <input 
                type="text" 
                value={field.value}
                onChange={(e) => field.onChange && field.onChange(e.target.value)}
                readOnly={field.readOnly}
                className="w-full p-4 bg-secondary/30 border border-border rounded-xl font-mono text-lg focus:ring-2 focus:ring-primary outline-none transition-all group-hover:bg-secondary/50"
              />
              <button 
                onClick={() => copy(field.value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-border">
          <div className="grid grid-cols-5 gap-2">
            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'].map(color => (
              <button
                key={color}
                className="w-full h-8 rounded-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleHexChange(color)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
