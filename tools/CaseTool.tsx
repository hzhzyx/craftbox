
import React, { useState } from 'react';
import { Copy, Type } from 'lucide-react';

export const CaseTool: React.FC = () => {
  const [text, setText] = useState('helloWorld_example string');

  const toCamel = (str: string) => {
    return str.replace(/([-_ ][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '');
    });
  };

  const toPascal = (str: string) => {
    const camel = toCamel(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const toSnake = (str: string) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
              .replace(/[\s-]/g, '_')
              .replace(/^_+/, ''); // remove leading underscore if any
  };

  const toKebab = (str: string) => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
              .replace(/[\s_]/g, '-')
              .replace(/^-+/, '');
  };

  const toConstant = (str: string) => {
    return toSnake(str).toUpperCase();
  };

  const formats = [
    { name: 'camelCase', val: toCamel(text) },
    { name: 'PascalCase', val: toPascal(text) },
    { name: 'snake_case', val: toSnake(text) },
    { name: 'kebab-case', val: toKebab(text) },
    { name: 'CONSTANT_CASE', val: toConstant(text) },
    { name: 'UPPER CASE', val: text.toUpperCase() },
    { name: 'lower case', val: text.toLowerCase() },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <label className="absolute left-4 top-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Input Text
        </label>
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 pt-10 px-4 pb-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none font-medium text-lg"
            placeholder="Type any text here to convert..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formats.map((fmt) => (
          <div key={fmt.name} className="group relative p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors">
            <div className="text-xs font-bold text-muted-foreground mb-1">{fmt.name}</div>
            <div className="font-mono text-sm truncate pr-6 text-foreground">{fmt.val}</div>
            <button
                onClick={() => navigator.clipboard.writeText(fmt.val)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
