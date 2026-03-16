import { useParams } from 'react-router-dom';

import { useVenueLeagueStatsTable } from '@/components/Venue/Content/VenueLeagueStats/UseVenueLeagueStatsTable';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useVenueLeagueStats } from '@/hooks/queries/venue/UseVenueLeagueStats';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';
import { VenueLeagueStats as VenueLeagueStatsType } from '@/types/api/Venue';

import styles from './VenueLeagueStats.module.css';

const VenueLeagueStats = () => {
	const { venueSlug } = useParams();

	const { data: leagueStats } = useVenueLeagueStats(venueSlug!);
	const { data: record } = useVenueTeamRecord(venueSlug!);

	const { table } = useVenueLeagueStatsTable(leagueStats);
	const { table: footTable } = useVenueLeagueStatsTable(
		record ? [record as unknown as VenueLeagueStatsType] : undefined
	);

	if (!leagueStats || leagueStats.length === 0) {
		return null;
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
