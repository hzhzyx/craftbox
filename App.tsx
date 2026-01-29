
import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ToolCard } from './components/ToolCard';
import { ToolModal } from './components/ToolModal';
import { TOOLS } from './constants';
import { Tool, Category } from './types';
import { Sparkles, Github, Search, Command, Zap } from 'lucide-react';

const CATEGORIES: { label: string; value: Category | 'All' }[] = [
  { label: '全部', value: 'All' },
  { label: '转换', value: 'Conversion' },
  { label: '文本', value: 'Text' },
  { label: '数据', value: 'Data' },
  { label: '安全', value: 'Crypto' },
  { label: '实验室', value: 'Dev' }
];

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTool(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const query = search.toLowerCase();
      return (tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)) &&
             (activeCategory === 'All' || tool.category === activeCategory);
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航：极致简约 */}
      <nav className="h-16 px-6 flex items-center justify-between border-b border-white/[0.05] bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter italic">CraftBox</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-full text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            所有操作均在本地运行
          </div>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-6 py-20">
        {/* Hero 区：非对称布局增加设计感 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
              <Sparkles className="w-3 h-3" />
              <span>V2.0 · 匠心重制</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6">
              给代码点<br/><span className="text-primary">仪式感。</span>
            </h1>
            <p className="text-lg text-muted-foreground/80 font-medium">
              不再忍受简陋的工具网站。在这里，每一个字符的转换都是一种视觉享受。
            </p>
          </div>
          
          <div className="flex-shrink-0 flex items-center gap-4 text-xs font-mono text-muted-foreground pb-2">
            <span className="flex flex-col items-end">
              <span>CREATED BY</span>
              <span className="text-foreground font-bold">@YOUR_NAME</span>
            </span>
            <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center">
              JS
            </div>
          </div>
        </div>

        {/* 交互区 */}
        <div className="sticky top-16 z-40 py-4 mb-12 bg-black/20 backdrop-blur-md -mx-6 px-6">
          <SearchBar value={search} onChange={setSearch} />
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat.value 
                    ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' 
                    : 'bg-white/[0.03] border border-white/[0.05] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 工具网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onClick={() => setSelectedTool(tool)} 
              />
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
              <div className="inline-block p-6 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <p className="text-xl font-bold mb-2">Ops!</p>
                <p className="text-muted-foreground">这道题... 我也不会解。</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 页脚：保持干净 */}
      <footer className="border-t border-white/[0.03] py-20 bg-black/40">
        <div className="container max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-black text-xl italic italic">
              CraftBox
            </div>
            <p className="text-xs text-muted-foreground">
              Built with Passion, Grain, and 100% Client-side Logic.
            </p>
          </div>
          <div className="flex gap-12 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">致敬开发者</a>
            <a href="#" className="hover:text-primary transition-colors">实验室日志</a>
            <a href="#" className="hover:text-primary transition-colors">反馈建议</a>
          </div>
        </div>
      </footer>

      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};

export default App;
