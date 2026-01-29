
import React, { useState } from 'react';
import { marked } from 'marked';
import { Eye, Code } from 'lucide-react';

export const MarkdownTool: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your **markdown** here.\n\n- List item 1\n- List item 2\n\n> Blockquote example');

  const createMarkup = () => {
    return { __html: marked.parse(markdown) };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] gap-4">
      <div className="flex gap-4 border-b border-border pb-2 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 font-bold text-sm text-muted-foreground">
            <Code className="w-4 h-4" /> Markdown Source
        </div>
        <div className="flex-1 flex items-center gap-2 font-bold text-sm text-muted-foreground">
            <Eye className="w-4 h-4" /> Preview
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="flex-1 h-full p-6 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono text-sm leading-relaxed"
          placeholder="# Type here..."
        />
        <div 
          className="flex-1 h-full p-6 bg-background border border-border rounded-xl overflow-y-auto prose dark:prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={createMarkup()}
        />
      </div>
    </div>
  );
};
