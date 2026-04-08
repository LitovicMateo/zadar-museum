import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useVenueLeagueStatsTable } from '@/components/Venue/Content/VenueLeagueStats/UseVenueLeagueStatsTable';
import { useVenueLeagueStats } from '@/hooks/queries/venue/UseVenueLeagueStats';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';
import { VenueLeagueStats as VenueLeagueStatsType } from '@/types/api/Venue';

import styles from './VenueLeagueStats.module.css';

const VenueLeagueStats = () => {
	const { venueSlug } = useParams();

	const { data: leagueStats, isLoading: isLoadingLeagueStats } = useVenueLeagueStats(venueSlug!);
	const { data: record, isLoading: isLoadingRecord } = useVenueTeamRecord(venueSlug!);

	const { table } = useVenueLeagueStatsTable(leagueStats);
	const { table: footTable } = useVenueLeagueStatsTable(
		record ? [record as unknown as VenueLeagueStatsType] : undefined
	);

	if (isLoadingLeagueStats || isLoadingRecord) {
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!leagueStats || leagueStats.length === 0) {
		return <NoContent type="info" description="No league stats available for this venue." />;
	}

	return (
		<section className={styles.content}>
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default VenueLeagueStats;
