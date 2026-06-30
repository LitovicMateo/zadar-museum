import React from 'react';
import { cn } from '@/lib/Utils';

type FormGridProps = {
  cols?: 2 | 3 | 5;
  children: React.ReactNode;
  className?: string;
};

const colsMap: Record<number, string> = {
  2: 'grid grid-cols-2 gap-2',
  3: 'grid grid-cols-3 gap-2',
  5: 'grid grid-cols-5 gap-2',
};

const FormGrid: React.FC<FormGridProps> = ({ cols = 2, children, className }) => (
  <div className={cn(colsMap[cols], className)}>{children}</div>
);

export default FormGrid;
