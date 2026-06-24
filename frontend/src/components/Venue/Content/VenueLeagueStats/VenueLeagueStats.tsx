import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useVenueLeagueStats } from '@/hooks/queries/venue/UseVenueLeagueStats';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';
import { VenueLeagueStats as VenueLeagueStatsType } from '@/types/api/Venue';

import { venueLeagueHeading, venueStatsColumns } from '../venueColumns';

import styles from './VenueLeagueStats.module.css';

const VenueLeagueStats = () => {
	const { venueSlug } = useParams();

	const { data: leagueStats, isLoading: isLoadingLeagueStats } = useVenueLeagueStats(venueSlug!);
	const { data: record, isLoading: isLoadingRecord } = useVenueTeamRecord(venueSlug!);

	const groups = useMemo(
		() =>
			buildPhaseGroups<VenueLeagueStatsType, VenueLeagueStatsType>(leagueStats, {
				combined: (e) => e,
				regular: (e) => (e.regular as VenueLeagueStatsType) ?? null,
				playoff: (e) => (e.playoff as VenueLeagueStatsType) ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => venueLeagueHeading(r),
			}),
		[leagueStats]
	);

	const footerRows = useMemo<StatsDataRow<VenueLeagueStatsType>[]>(
		() => (record ? [{ key: 'total', data: record as unknown as VenueLeagueStatsType }] : []),
		[record]
	);

	if (isLoadingLeagueStats || isLoadingRecord) {
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!leagueStats || leagueStats.length === 0) {
		return <NoContent type="info" description="No league stats available for this venue." />;
	}

	return (
		<section className={styles.content}>
			<StatsTable
				columns={venueStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'light' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default VenueLeagueStats;
