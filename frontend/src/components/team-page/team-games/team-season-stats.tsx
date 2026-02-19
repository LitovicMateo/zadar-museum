import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useGamesContext } from '@/hooks/context/useGamesContext';
import { useTeamSeasonLeagueStats } from '@/hooks/queries/team/useTeamSeasonLeagueStats';
import { useTeamSeasonStats } from '@/hooks/queries/team/useTeamSeasonStats';
import {
	LeagueStatsTableBody,
	LeagueStatsTableFoot,
	LeagueStatsTableHead,
	useTeamLeagueStatsTable
} from '@/hooks/useTeamLeagueStats';
import { TeamStats } from '@/types/api/team';

type View = 'total' | 'home' | 'away' | 'neutral';

const TeamSeasonStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { selectedSeason } = useGamesContext();

	const [selected, setSelected] = useState<View>('total');

	const { data: seasonLeagueStats } = useTeamSeasonStats(selectedSeason!, teamSlug!);
	const { data: seasonStats } = useTeamSeasonLeagueStats(selectedSeason!, teamSlug!);

	const hasNeutral = (seasonStats?.neutral?.games ?? 0) > 0;

	// If the current selection becomes unavailable (e.g. navigated to a season
	// with no neutral games while 'neutral' was active), fall back to 'total'.
	const effectiveSelected: View = selected === 'neutral' && !hasNeutral ? 'total' : selected;

	const leagueStatsRow: TeamStats[] = useMemo(() => {
		if (!seasonLeagueStats?.length) return [];
		return seasonLeagueStats.map((team) => team[effectiveSelected]).filter(Boolean) as TeamStats[];
	}, [seasonLeagueStats, effectiveSelected]);

	const selectTotalStats: TeamStats[] = useMemo(() => {
		if (!seasonStats) return [];
		const row = seasonStats[effectiveSelected];
		return row ? [row] : [];
	}, [seasonStats, effectiveSelected]);

	const { table: mainTable } = useTeamLeagueStatsTable(leagueStatsRow);
	const { table: footTable } = useTeamLeagueStatsTable(selectTotalStats);

	if (!seasonStats || !seasonLeagueStats) return null;

	console.log("LS", seasonLeagueStats);
	

	return (
		<>
			<Heading title="Season Stats" type="secondary" />

			<form action="">
				<fieldset className="flex flex-row gap-4 font-abel">
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="view"
							value={'total'}
							checked={effectiveSelected === 'total'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Total
					</label>
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="view"
							value={'home'}
							checked={effectiveSelected === 'home'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Home
					</label>
					<label htmlFor="" className="flex gap-2">
						<input
							type="radio"
							name="view"
							value={'away'}
							checked={effectiveSelected === 'away'}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Away
					</label>
					<label
						htmlFor=""
						className={`flex gap-2 ${!hasNeutral ? 'opacity-40 cursor-not-allowed' : ''}`}
					>
						<input
							type="radio"
							name="view"
							value={'neutral'}
							checked={effectiveSelected === 'neutral'}
							disabled={!hasNeutral}
							onChange={(e) => setSelected(e.target.value as View)}
						/>
						Neutral
					</label>
				</fieldset>
			</form>

			<TableWrapper>
				<LeagueStatsTableHead table={mainTable} />
				<LeagueStatsTableBody table={mainTable} />
				<LeagueStatsTableFoot table={footTable} />
			</TableWrapper>
		</>
	);
};

export default TeamSeasonStats;
