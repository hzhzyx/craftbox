
import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, FileType } from 'lucide-react';

export const ImageConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setFileName(file.name.split('.')[0]);
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL(format, quality);
      const link = document.createElement('a');
      link.download = `${fileName}.${format.split('/')[1]}`;
      link.href = url;
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-6">
      {!image ? (
        <label 
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${
            isDragging 
              ? 'border-primary bg-primary/10 scale-[1.02]' 
              : 'border-border hover:bg-secondary/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`w-10 h-10 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
          <span className={`text-sm font-medium transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
            {isDragging ? '松开以开始转换' : '点击或拖拽图片到此处'}
          </span>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="relative group rounded-xl overflow-hidden border border-border bg-muted max-h-80 flex justify-center">
            <img src={image} alt="Preview" className="max-w-full h-auto object-contain" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              重新上传
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2">
                <FileType className="w-4 h-4" /> 目标格式
              </label>
              <select 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl focus:outline-none"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            
            {(format === 'image/jpeg' || format === 'image/webp') && (
              <div className="space-y-3">
                <label className="text-sm font-bold">质量 (Quality): {Math.round(quality * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-12 accent-primary"
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Download className="w-5 h-5" /> 立即转换并下载
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
