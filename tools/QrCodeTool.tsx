
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link, Upload, Image as ImageIcon } from 'lucide-react';

export const QrCodeTool: React.FC = () => {
  const [text, setText] = useState('https://github.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeImage, setIncludeImage] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    src: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    height: 48,
    width: 48,
    excavate: true,
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSettings(prev => ({
          ...prev,
          src: event.target?.result as string
        }));
        setIncludeImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <Link className="w-4 h-4" /> 内容 (URL 或 文本)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="输入想要生成二维码的内容..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">前景色</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden shrink-0"
              />
              <input 
                type="text" 
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">背景色</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden shrink-0"
              />
              <input 
                type="text" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Logo 嵌入
          </label>
          <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="use-logo"
                checked={includeImage}
                onChange={(e) => setIncludeImage(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="use-logo" className="text-sm cursor-pointer select-none">
                启用 Logo 中心嵌入
              </label>
            </div>
            
            {includeImage && (
              <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-200">
                <div className="w-12 h-12 bg-white rounded border border-border flex items-center justify-center overflow-hidden shrink-0">
                  <img src={imageSettings.src} alt="Logo Preview" className="w-full h-full object-contain" />
                </div>
                <label className="flex-grow cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-lg hover:bg-secondary/80 transition-colors border border-border w-fit">
                    <Upload className="w-3 h-3" />
                    更换 Logo 图片...
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 bg-white/5 p-8 rounded-2xl border border-border">
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <QRCodeCanvas
            id="qrcode"
            value={text}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            level={"H"}
            imageSettings={includeImage ? imageSettings : undefined}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full px-8">
           <input
            type="range"
            min="128"
            max="512"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="flex-grow h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono w-12 text-right">{size}px</span>
        </div>

        <button 
          onClick={downloadQR}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Download className="w-5 h-5" /> 下载 PNG
        </button>
      </div>
    </div>
  );
};

