import * as React from 'react';

import { cn } from '@/lib/Utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './constants/ButtonVariants';
import styles from './Button.module.css';

const variantClass: Record<string, string> = {
	default: styles.variantDefault,
	destructive: styles.variantDestructive,
	outline: styles.variantOutline,
	secondary: styles.variantSecondary,
	ghost: styles.variantGhost,
	link: styles.variantLink,
};

const sizeClass: Record<string, string> = {
	default: styles.sizeDefault,
	sm: styles.sizeSm,
	lg: styles.sizeLg,
	icon: styles.sizeIcon,
};

export default function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			data-slot="button"
			className={cn(
				styles.base,
				variantClass[variant ?? 'default'],
				sizeClass[size ?? 'default'],
				className,
			)}
			{...props}
		/>
	);
}
