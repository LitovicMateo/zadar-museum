import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/Utils';

type FormCardProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

const FormCard: React.FC<FormCardProps> = ({ label, children, className }) => (
  <Card className={cn('shadow-xs gap-0 overflow-hidden border-border py-0', className)}>
    <CardHeader className="flex items-center gap-2 bg-court px-3 py-1.5">
      <span className="h-3 w-1 rounded-full bg-record" aria-hidden />
      <CardTitle className="text-[10px] font-semibold font-mono uppercase tracking-[0.12em] text-court-foreground/90">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 py-2.5 flex flex-col gap-2">
      {children}
    </CardContent>
  </Card>
);

export default FormCard;
