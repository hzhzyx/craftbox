
import React from 'react';
import { X } from 'lucide-react';
import { Tool } from '../types';
import { Base64Tool } from '../tools/Base64Tool';
import { JsonFormatter } from '../tools/JsonFormatter';
import { TimestampTool } from '../tools/TimestampTool';
import { IpTool } from '../tools/IpTool';
import { DnsTool } from '../tools/DnsTool';
import { ImageConverter } from '../tools/ImageConverter';
import { PdfConverter } from '../tools/PdfConverter';
import { QrCodeTool } from '../tools/QrCodeTool';
import { DiffTool } from '../tools/DiffTool';
import { CronTool } from '../tools/CronTool';
import { ColorTool } from '../tools/ColorTool';
import { RegexTool } from '../tools/RegexTool';
import { UrlEncoder } from '../tools/UrlEncoder';
import { HashTool } from '../tools/HashTool';
import { PasswordTool } from '../tools/PasswordTool';
import { JwtTool } from '../tools/JwtTool';
import { MarkdownTool } from '../tools/MarkdownTool';
import { CaseTool } from '../tools/CaseTool';
import { AiAssistant } from '../tools/AiAssistant';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  // Simple router for tool components
  const renderTool = () => {
    switch (tool.id) {
      case 'base64':
        return <Base64Tool />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'timestamp-converter':
        return <TimestampTool />;
      case 'ip-viewer':
        return <IpTool />;
      case 'dns-lookup':
        return <DnsTool />;
      case 'image-converter':
        return <ImageConverter />;
      case 'pdf-converter':
        return <PdfConverter />;
      case 'qrcode-studio':
        return <QrCodeTool />;
      case 'diff-viewer':
        return <DiffTool />;
      case 'cron-helper':
        return <CronTool />;
      case 'color-converter':
        return <ColorTool />;
      case 'regex-tester':
        return <RegexTool />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'hash-generator':
        return <HashTool />;
      case 'password-gen':
        return <PasswordTool />;
      case 'jwt-decoder':
        return <JwtTool />;
      case 'markdown-preview':
        return <MarkdownTool />;
      case 'case-converter':
        return <CaseTool />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              {tool.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
            <p className="text-muted-foreground max-w-sm">
              该工具 ({tool.id}) 正在开发中！逻辑将在下一版本中实现。
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-secondary rounded-lg">
              {tool.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">{tool.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {renderTool()}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            隐私承诺：所有数据均在浏览器本地处理。
          </span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            按 Esc 键关闭
          </button>
        </div>
      </div>
    </div>
  );
};
