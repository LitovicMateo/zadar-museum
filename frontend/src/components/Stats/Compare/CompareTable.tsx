import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/Utils';

export interface CompareRow<T> {
	label: string;
	key: keyof T;
}

interface CompareTableProps<T> {
	rows: CompareRow<T>[];
	left: T | null | undefined;
	right: T | null | undefined;
	leftLabel: string;
	rightLabel: string;
	leftImageUrl?: string | null;
	rightImageUrl?: string | null;
}

function formatStat(value: unknown): string {
	if (value === null || value === undefined) return '–';
	return String(value);
}

function EntityHeader({ imageUrl, label }: { imageUrl?: string | null; label: string }) {
	return (
		<div className="flex items-center gap-2">
			{imageUrl ? (
				<img src={imageUrl} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
			) : (
				<div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />
			)}
			<span>{label}</span>
		</div>
	);
}

function CompareTable<T>({ rows, left, right, leftLabel, rightLabel, leftImageUrl, rightImageUrl }: CompareTableProps<T>) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Stat</TableHead>
					<TableHead>
						<EntityHeader imageUrl={leftImageUrl} label={leftLabel} />
					</TableHead>
					<TableHead>
						<EntityHeader imageUrl={rightImageUrl} label={rightLabel} />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => {
					const leftValue = left ? left[row.key] : undefined;
					const rightValue = right ? right[row.key] : undefined;
					const leftIsHigher =
						typeof leftValue === 'number' && typeof rightValue === 'number' && leftValue > rightValue;
					const rightIsHigher =
						typeof leftValue === 'number' && typeof rightValue === 'number' && rightValue > leftValue;

					return (
						<TableRow key={String(row.key)}>
							<TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
							<TableCell className={cn(leftIsHigher && 'font-bold bg-primary/10')}>
								{formatStat(leftValue)}
							</TableCell>
							<TableCell className={cn(rightIsHigher && 'font-bold bg-primary/10')}>
								{formatStat(rightValue)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

export default CompareTable;
