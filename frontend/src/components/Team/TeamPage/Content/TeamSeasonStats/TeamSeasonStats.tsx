import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import GamesFilter from '@/components/games-page/games-filter/GamesFilter';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import Pill from '@/components/ui/Pill';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useTeamLeagueStatsTable } from '@/hooks/UseTeamLeagueStats';
import { useGamesContext } from '@/hooks/context/UseGamesContext';
import { useTeamSeasonLeagueStats } from '@/hooks/queries/team/UseTeamSeasonLeagueStats';
import { useTeamSeasonStats } from '@/hooks/queries/team/UseTeamSeasonStats';
import { TeamStats } from '@/types/api/Team';

import styles from './TeamSeasonStats.module.css';

type View = 'total' | 'home' | 'away' | 'neutral';

const TeamSeasonStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { selectedSeason, seasons, setSelectedSeason } = useGamesContext();

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

	if (!seasonStats || !seasonLeagueStats || !seasons) return null;

	return (
		<section className={styles.section}>
			<div className={styles.controls}>
				<SeasonSelect
					seasons={seasons}
					selectedSeason={selectedSeason}
					compact
					onSeasonChange={(season) => {
						setSelectedSeason(season);
					}}
				/>
				<fieldset className={styles.fieldset}>
					<Pill label="total" isActive={effectiveSelected === 'total'} onClick={() => setSelected('total')}>
						Total
					</Pill>
					<Pill label="home" isActive={effectiveSelected === 'home'} onClick={() => setSelected('home')}>
						Home
					</Pill>
					<Pill label="away" isActive={effectiveSelected === 'away'} onClick={() => setSelected('away')}>
						Away
					</Pill>
					<Pill
						label="neutral"
						isActive={effectiveSelected === 'neutral'}
						onClick={() => setSelected('neutral')}
						disabled={!hasNeutral}
					>
						Neutral
					</Pill>
				</fieldset>
			</div>

			<TableWrapper>
				<UniversalTableHead table={mainTable} />
				<UniversalTableBody table={mainTable} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default TeamSeasonStats;
