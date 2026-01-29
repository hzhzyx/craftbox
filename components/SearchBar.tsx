
import React, { useEffect, useRef } from 'react';
import { Search, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative group max-w-2xl mx-auto w-full mb-12">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full h-14 pl-12 pr-24 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-lg"
        placeholder="搜索工具..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none hidden sm:flex">
        <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground bg-muted border border-border rounded shadow-sm">
          <Command className="w-3 h-3" /> K
        </kbd>
      </div>
    </div>
  );
};
