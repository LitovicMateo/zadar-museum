import React from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/card';

export type LeaderRow = {
	key: string;
	to: string;
	name: string;
	value: number;
	leading: React.ReactNode;
};

type LeaderCardProps = {
	title: string;
	rows: LeaderRow[];
	formatValue?: (v: number) => string;
};

const defaultFormatValue = (v: number): string => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/**
 * A single stat category: a Court-navy header over a ranked top-5 list, each
 * row leading with a player avatar or team logo. Rows are styled uniformly.
 */
const LeaderCard: React.FC<LeaderCardProps> = ({ title, rows, formatValue = defaultFormatValue }) => {
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<div className="bg-court px-4 py-2.5">
				<h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white">{title}</h3>
			</div>
			{rows.length === 0 ? (
				<p className="px-4 py-6 text-center text-sm text-muted-foreground">No data</p>
			) : (
				<ul className="divide-y divide-border">
					{rows.map((row, i) => (
						<li key={row.key}>
							<Link
								to={row.to}
								className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/60"
							>
								<span className="w-4 shrink-0 text-right font-mono text-xs text-muted-foreground">
									{i + 1}
								</span>
								<span className="h-8 w-8 shrink-0">{row.leading}</span>
								<span className="min-w-0 flex-1 truncate text-sm font-medium">{row.name}</span>
								<span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
									{formatValue(row.value)}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
};

export default LeaderCard;
