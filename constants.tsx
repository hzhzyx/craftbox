
import React from 'react';
import { 
  Hash, 
  Code2, 
  FileJson, 
  Link, 
  Lock, 
  Type, 
  FileCode, 
  RefreshCw,
  Clock,
  Globe,
  Network,
  FileText,
  Image as ImageIcon,
  QrCode,
  GitCompare,
  CalendarClock,
  Palette,
  Bot,
  Sparkles,
  Regex
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'ai-assistant',
    name: 'AI 灵感中心',
    description: '接入 DeepSeek、Kimi 等大模型。内置日报生成、代码解释、SQL 分析等效率模版。',
    category: 'Dev',
    icon: <Bot className="w-5 h-5" />
  },
  {
    id: 'base64',
    name: 'Base64 实验室',
    description: '二进制与文本的优雅转身。支持文件和文本的快速编解码。',
    category: 'Conversion',
    icon: <Code2 className="w-5 h-5" />
  },
  {
    id: 'json-formatter',
    name: 'JSON 炼金术',
    description: '把杂乱无章的 JSON 变成赏心悦目的艺术品，自带校验。',
    category: 'Data',
    icon: <FileJson className="w-5 h-5" />
  },
  {
    id: 'qrcode-studio',
    name: '二维码工坊',
    description: '即刻生成可定制的二维码。支持文本、链接及 WIFI 配置。',
    category: 'Conversion',
    icon: <QrCode className="w-5 h-5" />
  },
  {
    id: 'diff-viewer',
    name: '文本差异对比',
    description: '精准识别两段文本的细微差别。支持行级与字符级高亮。',
    category: 'Dev',
    icon: <GitCompare className="w-5 h-5" />
  },
  {
    id: 'regex-tester',
    name: '正则演练场',
    description: '实时匹配测试，内置常用模板。让正则表达式不再难懂。',
    category: 'Dev',
    icon: <Regex className="w-5 h-5" />
  },
  {
    id: 'cron-helper',
    name: 'Cron 翻译官',
    description: '不再死记硬背。可视化解析和生成 Cron 定时任务表达式。',
    category: 'Dev',
    icon: <CalendarClock className="w-5 h-5" />
  },
  {
    id: 'color-converter',
    name: '色彩调色板',
    description: 'HEX, RGB, HSL 全格式互转。设计师与开发者的沟通桥梁。',
    category: 'Conversion',
    icon: <Palette className="w-5 h-5" />
  },
  {
    id: 'timestamp-converter',
    name: '时间驿站',
    description: 'Unix 时间戳与人类语言的互换。跨越时区的精准校对。',
    category: 'Conversion',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'ip-viewer',
    name: 'IP 定位器',
    description: '查看您的公网 IP 和内网 IP，快速掌握网络身份。',
    category: 'Dev',
    icon: <Globe className="w-5 h-5" />
  },
  {
    id: 'dns-lookup',
    name: 'DNS 探测仪',
    description: '通过 HTTPS 协议查询域名解析记录，洞察网络指向。',
    category: 'Dev',
    icon: <Network className="w-5 h-5" />
  },
  {
    id: 'image-converter',
    name: '图影变幻',
    description: 'PNG, JPG, WebP 格式互转，无损或有损的视觉平衡。',
    category: 'Conversion',
    icon: <ImageIcon className="w-5 h-5" />
  },
  {
    id: 'pdf-converter',
    name: 'PDF 合约师',
    description: '将图片合成为 PDF 文档，办公效率的加速器。',
    category: 'Conversion',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'url-encoder',
    name: 'URL 过滤器',
    description: '百分号编码不再头疼，一键让链接变乖。',
    category: 'Dev',
    icon: <Link className="w-5 h-5" />
  },
  {
    id: 'hash-generator',
    name: '指纹生成器',
    description: 'MD5, SHA-256... 任何数据都有它独特的数字指纹。',
    category: 'Crypto',
    icon: <Hash className="w-5 h-5" />
  },
  {
    id: 'password-gen',
    name: '熵增保险箱',
    description: '生成连你自己都记不住、电脑也猜不出的高强度密码。',
    category: 'Crypto',
    icon: <Lock className="w-5 h-5" />
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 窥镜',
    description: '无需后端，直接在浏览器里看透令牌背后的秘密。',
    category: 'Dev',
    icon: <RefreshCw className="w-5 h-5" />
  },
  {
    id: 'markdown-preview',
    name: 'MD 画布',
    description: '像写信一样写代码。GitHub 风格实时预览。',
    category: 'Text',
    icon: <FileCode className="w-5 h-5" />
  },
  {
    id: 'case-converter',
    name: '命名变声器',
    description: '在驼峰、蛇形、帕斯卡命名间丝滑切换，强迫症福音。',
    category: 'Text',
    icon: <Type className="w-5 h-5" />
  }
];


