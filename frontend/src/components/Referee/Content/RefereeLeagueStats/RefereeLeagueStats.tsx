import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import DatabaseSelect from '@/components/Team/TeamPage/Content/TeamLeagueStats/DatabaseSelect';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useRefereeLeagueStatsTable } from '@/hooks/UseRefereeLeagueStatsTable';
import { useRefereeLeagueStats } from '@/hooks/queries/referee/UseRefereeLeagueStats';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/UseRefereeTeamRecord';
import { RefereeStats } from '@/types/api/Referee';

import styles from './RefereeLeagueStats.module.css';

const RefereeLeagueStats: React.FC = () => {
	const { refereeId } = useParams();
	const [selected, setSelected] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const { data: leagueStats } = useRefereeLeagueStats(refereeId);
	const { data: teamRecord } = useRefereeTeamRecord(refereeId!);

	const hasNeutral = useMemo(
		() => leagueStats?.some((row) => row.neutral !== null && (row.neutral?.games ?? 0) > 0) ?? false,
		[leagueStats]
	);

	const leagueStatsRows: RefereeStats[] = useMemo(() => {
		if (!leagueStats?.length) return [];
		return leagueStats.map((row) => row[selected]).filter(Boolean) as RefereeStats[];
	}, [leagueStats, selected]);

	const footStats: RefereeStats[] = useMemo(() => {
		if (!teamRecord?.stats) return [];
		const selectedKey = selected.charAt(0).toUpperCase() + selected.slice(1);
		const match = teamRecord.stats.find((s) => s.key === selectedKey);
		return match ? [match] : [];
	}, [teamRecord, selected]);

	const { table: mainTable } = useRefereeLeagueStatsTable(leagueStatsRows);
	const { table: footTable } = useRefereeLeagueStatsTable(footStats);

	if (!leagueStats || !teamRecord) return null;

	return (
		<section className={styles.section}>
			<DatabaseSelect selected={selected} setSelected={setSelected} neutralDisabled={!hasNeutral} />
			<TableWrapper>
				<UniversalTableHead table={mainTable} />
				<UniversalTableBody table={mainTable} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default RefereeLeagueStats;
