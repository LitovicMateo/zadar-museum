import * as React from 'react';

import { Input } from '@/components/UI/Input';
import { cn } from '@/lib/Utils';

type StatFieldProps = { label: string } & React.ComponentProps<'input'>;

function StatField({ label, className, ...props }: StatFieldProps) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-[9px] font-mono font-medium uppercase tracking-wider text-muted-foreground leading-none">
				{label}
			</span>
			<Input className={cn('h-8 text-center font-mono tabular-nums', className)} {...props} />
		</div>
	);
}

export default StatField;
