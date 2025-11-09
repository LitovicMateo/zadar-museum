import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useGamesContext } from '@/hooks/context/useGamesContext';
import { useTeamSeasonLeagueStats } from '@/hooks/queries/team/useTeamSeasonLeagueStats';
import { useTeamSeasonStats } from '@/hooks/queries/team/useTeamSeasonStats';
import { useTeamLeagueStatsTable } from '@/hooks/useTeamLeagueStats';
import { TeamStats } from '@/types/api/team';

type View = 'total' | 'home' | 'away';

const TeamSeasonStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { selectedSeason } = useGamesContext();

	const [selected, setSelected] = useState<View>('total');

	const { data: seasonLeagueStats } = useTeamSeasonStats(selectedSeason!, teamSlug!);
	const { data: seasonStats } = useTeamSeasonLeagueStats(selectedSeason!, teamSlug!);

	const leagueStatsRow: TeamStats[] = useMemo(() => {
		if (!seasonLeagueStats?.length) return [];
		return seasonLeagueStats.map((team) => {
			return team[selected];
		});
	}, [seasonLeagueStats, selected]);

	const selectTotalStats: TeamStats[] = useMemo(() => {
		if (!seasonStats) return [];
		return [seasonStats[selected]];
	}, [seasonStats, selected]);

	const { TableHead, TableBody } = useTeamLeagueStatsTable(leagueStatsRow);
	const { TableFoot } = useTeamLeagueStatsTable(selectTotalStats);

	if (!seasonStats || !seasonLeagueStats) return null;

	return (
		<>
			<Heading title="Season Stats" type="secondary" />

			<form action="">
				<fieldset className="flex flex-row gap-4 font-abel">
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="total"
							value={'total'}
							checked={selected === 'total'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Total
					</label>
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="home"
							value={'home'}
							checked={selected === 'home'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Home
					</label>
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="away"
							value={'away'}
							checked={selected === 'away'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Away
					</label>
				</fieldset>
			</form>

			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</>
	);
};

export default TeamSeasonStats;
