import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/Utils';

export type SegmentedOption<T extends string> = {
	value: T;
	label: string;
	disabled?: boolean;
};

type SegmentedToggleProps<T extends string> = {
	value: T;
	onValueChange: (value: T) => void;
	options: SegmentedOption<T>[];
	ariaLabel?: string;
	className?: string;
	itemClassName?: string;
};

/**
 * Shared segmented control built on shadcn ToggleGroup — the single-select
 * pill bar used across the redesigned profiles (location/view/category filters).
 */
function SegmentedToggle<T extends string>({
	value,
	onValueChange,
	options,
	ariaLabel,
	className,
	itemClassName
}: SegmentedToggleProps<T>) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(v) => v && onValueChange(v as T)}
			aria-label={ariaLabel}
			className={cn('rounded-lg bg-muted p-1', className)}
		>
			{options.map((opt) => (
				<ToggleGroupItem
					key={opt.value}
					value={opt.value}
					disabled={opt.disabled}
					className={cn(
						'rounded-md px-3 font-mono text-xs uppercase tracking-[0.08em] data-[state=on]:bg-court data-[state=on]:text-white data-[state=on]:shadow-sm',
						itemClassName
					)}
				>
					{opt.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export default SegmentedToggle;
