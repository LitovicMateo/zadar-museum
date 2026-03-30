import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useRefereeSeasonLeagueStats } from '@/hooks/queries/referee/UseRefereeSeasonLeagueStats';
import { useRefereeSeasonStats } from '@/hooks/queries/referee/UseRefereeSeasonStats';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';

import { useRefereeStatsTable } from '../RefereeGamelog/UseRefereeStatsTable';

import styles from './RefereeSeasonStats.module.css';

const RefereeSeasonStats: React.FC = () => {
	const { refereeId } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const { data: seasons } = useRefereeSeasons(refereeId!);

	const { data: seasonStats } = useRefereeSeasonStats(refereeId, selectedSeason);
	const { data: seasonLeagueStats } = useRefereeSeasonLeagueStats(refereeId, selectedSeason);

	const leagueStats = useMemo(() => {
		if (!seasonLeagueStats) return [];
		return seasonLeagueStats.map((league) => league.stats.total);
	}, [seasonLeagueStats]);

	const { table } = useRefereeStatsTable(leagueStats);
	const { table: footTable } = useRefereeStatsTable(seasonStats);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	if (!seasonStats || !seasons || seasonStats.length === 0) return null;

	return (
		<div className={styles.section}>
			<SeasonSelect
				seasons={seasons}
				selectedSeason={selectedSeason}
				compact
				onSeasonChange={setSelectedSeason}
			/>

			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</div>
	);
};

export default RefereeSeasonStats;
