
import { ReactNode } from 'react';

export type Category = 'Conversion' | 'Text' | 'Data' | 'Crypto' | 'Dev';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: ReactNode;
}

export interface ToolComponentProps {
  onClose: () => void;
}
