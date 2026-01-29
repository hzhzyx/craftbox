
import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { 
  Bot, 
  Settings, 
  Send, 
  Loader2, 
  FileText, 
  Code2, 
  Database, 
  Image as ImageIcon, 
  Key, 
  Save,
  MessageSquare,
  Sparkles
} from 'lucide-react';

// --- Types ---
type ModelProvider = 'deepseek' | 'moonshot' | 'zhipu' | 'aliyun' | 'openai' | 'z-ai' | 'custom';

interface AiConfig {
  provider: ModelProvider;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

interface Scene {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
}

// --- Constants & Presets ---
const PROVIDERS: Record<ModelProvider, { name: string; baseUrl: string; defaultModel: string }> = {
  zhipu: {
    name: '智谱 AI (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4',
  },
  'z-ai': {
    name: 'z.ai (CLM)',
    baseUrl: 'https://api.z.ai/v1',
    defaultModel: 'clm',
  },
  deepseek: {
    name: 'DeepSeek (深度求索)',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
  },
  moonshot: {
    name: 'Moonshot (Kimi)',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
  },
  aliyun: {
    name: '阿里通义 (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
  },
  openai: {
    name: 'OpenAI (官方)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  custom: {
    name: '自定义 (Custom)',
    baseUrl: '',
    defaultModel: '',
  },
};

const SCENES: Scene[] = [
  {
    id: 'daily-report',
    name: '日报生成',
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    description: '输入今日工作碎片，一键生成专业日报。',
    systemPrompt: '你是一个专业的职场助手。请根据用户提供的碎片化工作内容，整理出一份格式标准、语气专业、条理清晰的日报。包含【今日工作内容】、【遇到的问题】、【明日计划】三个部分。保持简洁干练。',
    userPromptTemplate: '今日工作：\n',
  },
  {
    id: 'code-explain',
    name: '代码解释',
    icon: <Code2 className="w-5 h-5 text-green-500" />,
    description: '粘贴代码，秒懂逻辑与潜在风险。',
    systemPrompt: '你是一个资深技术专家。请解释用户发送的代码片段。要求：1. 简述代码功能；2. 逐行或逐块分析逻辑；3. 指出潜在的 Bug 或优化点。输出格式使用 Markdown，代码块要指定语言。',
    userPromptTemplate: '请解释这段代码：\n\n',
  },
  {
    id: 'sql-helper',
    name: 'SQL 翻译官',
    icon: <Database className="w-5 h-5 text-purple-500" />,
    description: '复杂 SQL 语句转白话文解释。',
    systemPrompt: '你是一个数据库专家。请用通俗易懂的语言解释这段 SQL 语句的执行逻辑和业务含义。分析涉及的表、连接方式、过滤条件。如果有明显的性能风险（如全表扫描），请一并指出。',
    userPromptTemplate: '分析这条 SQL：\n\n',
  },
  {
    id: 'mj-prompt',
    name: 'MJ 提示词',
    icon: <ImageIcon className="w-5 h-5 text-pink-500" />,
    description: '简短描述转 Midjourney 高质量咒语。',
    systemPrompt: '你是一个 AI 绘画提示词专家。请将用户简短的画面描述，扩展为适用于 Midjourney 的英文提示词 (Prompt)。\n策略：\n1. 翻译成英文。\n2. 补充细节：主体、环境、光影、艺术风格 (如 Cyberpunk, Ghibli, Oil painting)、视角、画质词 (8k, masterpiece, photorealistic)。\n3. 格式：直接输出英文 Prompt 文本，不需要解释，用逗号分隔关键词。',
    userPromptTemplate: '画面描述：',
  },
];

export const AiAssistant: React.FC = () => {
  // --- State ---
  const [config, setConfig] = useState<AiConfig>(() => {
    const saved = localStorage.getItem('gemini_ai_config');
    return saved ? JSON.parse(saved) : {
      provider: 'deepseek',
      apiKey: '',
      baseUrl: PROVIDERS.deepseek.baseUrl,
      modelName: PROVIDERS.deepseek.defaultModel
    };
  });
  
    const [showConfig, setShowConfig] = useState(!config.apiKey);
  
    const [activeScene, setActiveScene] = useState<Scene | null>(null);
  
    const [input, setInput] = useState('');
  
    const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  
    const [loading, setLoading] = useState(false);
  
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
  
  
    // --- Effects ---
  
    useEffect(() => {
  
      localStorage.setItem('gemini_ai_config', JSON.stringify(config));
  
    }, [config]);
  
  
  
    useEffect(() => {
  
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
    }, [messages]);
  
  
  
    // --- Handlers ---
  
    const handleProviderChange = (p: ModelProvider) => {
  
      setConfig(prev => ({
  
        ...prev,
  
        provider: p,
  
        baseUrl: PROVIDERS[p].baseUrl || prev.baseUrl,
  
        modelName: PROVIDERS[p].defaultModel || prev.modelName
  
      }));
  
    };
  
  
  
    const handleSceneSelect = (scene: Scene) => {
  
      setActiveScene(scene);
  
      setMessages([]);
  
      setInput(scene.userPromptTemplate);
  
    };
  
  
  
    const handleSubmit = async () => {
  
      if (!input.trim() || !activeScene || !config.apiKey) return;
  
      
  
      const userMsg = input;
  
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
  
      setInput('');
  
      setLoading(true);
  
  
  
      try {
  
        const openai = new OpenAI({
  
          baseURL: config.baseUrl,
  
          apiKey: config.apiKey,
  
          dangerouslyAllowBrowser: true 
  
        });
  
  
  
        const completion = await openai.chat.completions.create({
  
          messages: [
  
            { role: 'system', content: activeScene.systemPrompt },
  
            ...messages.map(m => ({ role: m.role, content: m.content })),
  
            { role: 'user', content: userMsg }
  
          ],
  
          model: config.modelName,
  
          stream: true,
  
        });
  
  
  
        let fullResponse = '';
  
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
  
  
  
        for await (const chunk of completion) {
  
          const content = chunk.choices[0]?.delta?.content || '';
  
          fullResponse += content;
  
          setMessages(prev => {
  
            const newMsgs = [...prev];
  
            newMsgs[newMsgs.length - 1].content = fullResponse;
  
            return newMsgs;
  
          });
  
        }
  
  
  
      } catch (error: any) {
  
        setMessages(prev => [...prev, { 
  
          role: 'assistant', 
  
          content: `❌ 请求失败: ${error.message || '网络错误'}. 请检查 API Key 和 Base URL 配置。` 
  
        }]);
  
      } finally {
  
        setLoading(false);
  
      }
  
    };
  
  
  
    // --- Renders ---
  
    
  
    // 1. Config View
  
    if (showConfig) {
  
      return (
  
        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
  
          <div className="text-center space-y-2">
  
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
  
              <Bot className="w-8 h-8" />
  
            </div>
  
            <h2 className="text-2xl font-bold">配置 AI 引擎</h2>
  
            <p className="text-muted-foreground text-sm">
  
              您的 API Key 仅存储在本地浏览器中，直接与模型服务商通信。
  
            </p>
  
          </div>
  
  
  
          <div className="w-full space-y-4 p-6 bg-secondary/20 border border-border rounded-2xl">
  
            <div className="space-y-2">
  
              <label className="text-xs font-bold uppercase text-muted-foreground">模型服务商</label>
  
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
  
                {(Object.keys(PROVIDERS) as ModelProvider[]).map(p => (
  
                  <button
  
                    key={p}
  
                    onClick={() => handleProviderChange(p)}
  
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all text-left truncate ${
  
                      config.provider === p 
  
                        ? 'bg-primary text-white shadow-md' 
  
                        : 'bg-background hover:bg-secondary border border-transparent'
  
                    }`}
  
                  >
  
                    {PROVIDERS[p].name}
  
                  </button>
  
                ))}
  
              </div>
  
            </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                className="w-full h-10 pl-9 pr-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder={`sk-... (输入 ${PROVIDERS[config.provider].name.split(' ')[0]} Key)`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Base URL (可选)</label>
            <input 
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
              className="w-full h-10 px-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Model Name</label>
            <input 
              type="text"
              value={config.modelName}
              onChange={(e) => setConfig({...config, modelName: e.target.value})}
              className="w-full h-10 px-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
            />
          </div>

          <button 
            onClick={() => config.apiKey && setShowConfig(false)}
            disabled={!config.apiKey}
            className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" /> 保存并开始
          </button>
        </div>
      </div>
    );
  }

  // 2. Scene Selector View
  if (!activeScene) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> 选择应用场景
            </h2>
            <button 
                onClick={() => setShowConfig(true)}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 bg-secondary/50 px-3 py-1.5 rounded-full transition-colors"
            >
                <Settings className="w-3 h-3" /> {PROVIDERS[config.provider].name.split(' ')[0]}
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCENES.map(scene => (
            <button
              key={scene.id}
              onClick={() => handleSceneSelect(scene)}
              className="flex items-start gap-4 p-6 bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-primary/30 rounded-2xl transition-all text-left group"
            >
              <div className="p-3 bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                {scene.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{scene.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {scene.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-muted-foreground flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            当前使用模型: <span className="font-mono font-bold text-blue-500">{config.modelName}</span>
        </div>
      </div>
    );
  }

  // 3. Chat/Workspace View
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveScene(null)}
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            ← 返回
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 font-bold">
            {activeScene.icon}
            {activeScene.name}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
              onClick={() => setShowConfig(true)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-all"
              title="配置 AI"
          >
              <Settings className="w-4 h-4" />
          </button>
          <button 
              onClick={() => setMessages([])}
              className="text-xs text-muted-foreground hover:text-red-500 transition-colors bg-secondary/30 px-2 py-1 rounded"
          >
              清空
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 min-h-0">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30 select-none">
                {activeScene.icon}
                <p className="mt-2 text-sm">准备就绪，请输入内容...</p>
            </div>
        )}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
              {msg.role === 'user' ? 'Me' : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-secondary/50 border border-border rounded-tl-none prose dark:prose-invert max-w-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-4 bg-secondary/50 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full h-24 p-4 pr-14 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm leading-relaxed shadow-sm"
          placeholder="输入内容... (Shift + Enter 换行)"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
