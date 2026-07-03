import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import { Skeleton } from '@/components/UI/Skeleton';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useVenueSeasonLeagueStats } from '@/hooks/queries/venue/UseVenueSeasonLeagueStats';
import { useVenueSeasonStats } from '@/hooks/queries/venue/UseVenueSeasonStats';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';
import { VenueLeagueStats, VenueSeasonStats as VenueSeasonStatsType } from '@/types/api/Venue';

import { venueLeagueHeading, venueStatsColumns } from '../venueColumns';

const VenueSeasonStats = () => {
	const { venueSlug } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const { data: seasons } = useVenueSeasons(venueSlug!);

	const { data: seasonStats, isLoading: isLoadingSeasonStats } = useVenueSeasonStats(venueSlug!, selectedSeason);
	const { data: seasonLeagueStats, isLoading: isLoadingSeasonLeagueStats } = useVenueSeasonLeagueStats(
		venueSlug!,
		selectedSeason
	);

	const groups = useMemo(
		() =>
			buildPhaseGroups<VenueSeasonStatsType, VenueLeagueStats>(seasonLeagueStats, {
				combined: (e) => e,
				regular: (e) => (e.regular as VenueLeagueStats) ?? null,
				playoff: (e) => (e.playoff as VenueLeagueStats) ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => venueLeagueHeading(r)
			}),
		[seasonLeagueStats]
	);

	const footerRows = useMemo<StatsDataRow<VenueLeagueStats>[]>(
		() => (seasonStats ?? []).map((data, i) => ({ key: `season-${i}`, data: data as unknown as VenueLeagueStats })),
		[seasonStats]
	);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons]);

	if (!seasons || seasons.length === 0) {
		return <NoContent type="info" description="No season stats available for this venue." />;
	}

	if (isLoadingSeasonStats || isLoadingSeasonLeagueStats) {
		return (
			<section className="space-y-4">
				<Skeleton className="h-9 w-48 rounded-lg" />
				<Skeleton className="h-48 rounded-xl" />
			</section>
		);
	}

	if (!seasonStats || !seasonLeagueStats || seasonStats.length === 0) {
		return <NoContent type="info" description="No season stats available for this venue." />;
	}

	return (
		<section className="space-y-4">
			<SeasonSelect
				compact
				seasons={seasons}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
			/>
			<StatsTable
				columns={venueStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'light' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default VenueSeasonStats;
