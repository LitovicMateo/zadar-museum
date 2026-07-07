import React, { useState } from 'react';

import NoContent from '@/components/NoContent/NoContent';
import { Avatar } from '@/components/UI/Avatar';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueSeasonLeaders } from '@/hooks/queries/league/UseLeagueSeasonLeaders';
import { SeasonPlayerLeader } from '@/types/api/Competition';

import LeaderCard, { LeaderRow } from './LeaderCard';
import { LEADER_CATEGORIES, LEADER_MODES, type LeaderMode } from './Options';

type SeasonLeadersProps = {
	leagueSlug: string;
	season: string;
};

const SeasonLeaders: React.FC<SeasonLeadersProps> = ({ leagueSlug, season }) => {
	const [mode, setMode] = useState<LeaderMode>('total');
	const { data: leaders } = useLeagueSeasonLeaders(leagueSlug, season);

	const players = leaders ?? [];

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="font-display text-lg font-semibold text-court">Seasonal Leaders</h2>
				<SegmentedToggle<LeaderMode>
					value={mode}
					onValueChange={setMode}
					options={LEADER_MODES}
					ariaLabel="Total or average leaders"
					itemClassName="border border-court data-[state=on]:border-transparent"
				/>
			</div>

			{players.length === 0 ? (
				<NoContent type="info" description="No leaders found" />
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{LEADER_CATEGORIES.map((cat) => {
						const field = (cat.mode ? `${cat.base}_${mode}` : cat.base) as keyof SeasonPlayerLeader;
						const rows: LeaderRow[] = [...players]
							.filter((p) => p[field] != null)
							.sort((a, b) => Number(b[field]) - Number(a[field]))
							.slice(0, 5)
							.map((p) => {
								const name = `${p.first_name} ${p.last_name}`;
								return {
									key: p.player_id,
									to: APP_ROUTES.player(p.player_id),
									name,
									value: Number(p[field]),
									leading: <Avatar src={p.image_url} alt={name} className="h-full w-full" />
								};
							});
						const formatValue = cat.mode && mode === 'avg' ? (v: number) => v.toFixed(1) : undefined;

						return <LeaderCard key={cat.base} title={cat.label} rows={rows} formatValue={formatValue} />;
					})}
				</div>
			)}
		</section>
	);
};

export default SeasonLeaders;
