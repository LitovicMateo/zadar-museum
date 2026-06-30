import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/Utils';

type FormCardProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

const FormCard: React.FC<FormCardProps> = ({ label, children, className }) => (
  <Card className={cn('shadow-xs gap-0', className)}>
    <CardHeader className="px-5 py-3 border-b border-border">
      <CardTitle className="text-[11px] font-semibold font-mono uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-5 py-4 flex flex-col gap-3">
      {children}
    </CardContent>
  </Card>
);

export default FormCard;
