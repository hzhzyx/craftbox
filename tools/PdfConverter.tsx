
import React, { useState } from 'react';
import { Upload, Download, FileText, Plus, X, ArrowDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const PdfConverter: React.FC = () => {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          url: event.target?.result as string,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
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
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setLoading(true);
    const pdf = new jsPDF();
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imgData = img.url;
      
      // Add a new page for each image except the first one
      if (i > 0) pdf.addPage();
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save('crafted-document.pdf');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div 
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all ${
          isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border bg-secondary/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="text-lg font-bold mb-2">图片转 PDF</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center">选择一张或多张图片，我们将按顺序将它们合成到一个 PDF 文档中。</p>
        <label className="px-6 py-3 bg-primary text-white rounded-xl font-bold cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-5 h-5" /> 选择图片
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} />
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-muted group">
                <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={generatePdf}
              disabled={loading}
              className="w-full py-4 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-5 h-5" /> {loading ? '正在生成...' : `生成 PDF (${images.length} 页)`}
            </button>
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">
              转换完成后文件将自动开始下载
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
