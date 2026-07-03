import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import { cn } from '@/lib/Utils';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';

type DatabaseToggleProps = {
	className?: string;
};

const DatabaseToggle: React.FC<DatabaseToggleProps> = ({ className }) => {
	const { selectedDatabase, toggleDatabase } = useBoxscore();
	const { data: mainTeam } = useMainTeam();

	const options: { db: PlayerDB; label: string }[] = [
		{ db: 'main', label: mainTeam?.short_name ?? mainTeam?.name ?? 'Main' },
		{ db: 'opponent', label: 'Opponent' }
	];

	return (
		<div
			role="radiogroup"
			aria-label="Stats source"
			className={cn('inline-flex items-center rounded-lg bg-muted p-1', className)}
		>
			{options.map(({ db, label }) => {
				const active = selectedDatabase === db;
				return (
					<button
						key={db}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => toggleDatabase(db)}
						className={cn(
							'rounded-md px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.08em] transition-colors',
							active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
};

export default DatabaseToggle;
