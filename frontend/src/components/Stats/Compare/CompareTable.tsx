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

// Postgres bigint columns (e.g. SUM() of integer stat columns) come back from the API
// as numeric strings rather than numbers, unlike numeric/float columns, so string values
// must be coerced before comparing.
function toComparableNumber(value: unknown): number | null {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function EntityHeader({ imageUrl, label }: { imageUrl?: string | null; label: string }) {
	return (
		<div className="flex items-center gap-2.5">
			{imageUrl ? (
				<img src={imageUrl} className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-2 ring-record/40" alt="" />
			) : (
				<div className="h-9 w-9 flex-shrink-0 rounded-full bg-white/15 ring-2 ring-white/20" />
			)}
			<span className="font-display font-bold text-white">{label}</span>
		</div>
	);
}

function CompareTable<T>({ rows, left, right, leftLabel, rightLabel, leftImageUrl, rightImageUrl }: CompareTableProps<T>) {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="border-0 bg-court hover:bg-court">
						<TableHead className="font-mono text-xs uppercase tracking-[0.08em] text-white/60">Stat</TableHead>
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
						const leftNum = toComparableNumber(leftValue);
						const rightNum = toComparableNumber(rightValue);
						const leftIsHigher = leftNum !== null && rightNum !== null && leftNum > rightNum;
						const rightIsHigher = leftNum !== null && rightNum !== null && rightNum > leftNum;

						return (
							<TableRow key={String(row.key)}>
								<TableCell className="font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground">
									{row.label}
								</TableCell>
								<TableCell className={cn('tabular-nums', leftIsHigher && 'bg-record/20 font-bold text-court')}>
									{formatStat(leftValue)}
								</TableCell>
								<TableCell className={cn('tabular-nums', rightIsHigher && 'bg-record/20 font-bold text-court')}>
									{formatStat(rightValue)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default CompareTable;
