import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './constants/button-variants';

export default function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';

	// compute base classes from variants first, then append user className so
	// explicit classes passed via props will appear later in the class list
	// and therefore override variant defaults when necessary.
	const base = buttonVariants({ variant, size });
	return <Comp data-slot="button" className={cn(base, className)} {...props} />;
}
