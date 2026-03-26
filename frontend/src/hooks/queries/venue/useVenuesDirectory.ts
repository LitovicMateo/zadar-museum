import { useMemo } from 'react';

import { useVenues } from '@/hooks/queries/venue/UseVenues';
import { VenueDirectoryEntry } from '@/types/api/Venue';

import { useVenuesTeamRecord } from './useVenuesTeamRecord';

export const useVenuesDirectory = () => {
	const { data: venues, isLoading } = useVenues('name', 'asc');
	const { data: venueStats, isLoading: isTeamRecordLoading } = useVenuesTeamRecord();

	// console.log('VENUE STATS', venueStats);

	const directory = useMemo<VenueDirectoryEntry[] | undefined>(() => {
		if (!venues || isTeamRecordLoading) return undefined;

		const statsMap = new Map(venueStats ? venueStats.map((s) => [String(s.venue_slug), s]) : []);

		// console.log(statsMap);

		return venues.map((venue) => {
			const stats = statsMap.get(venue.slug);

			console.log('Mapping venue', venue.slug, 'to stats', stats);
			return {
				id: venue.id,
				name: venue.name,
				slug: venue.slug,
				nation: venue.country,
				image: venue.image,
				city: venue.city,
				games: stats ? String(stats.games) : null,
				wins: stats ? String(stats.wins) : null,
				losses: stats ? String(stats.losses) : null,
				win_percentage: stats ? String(stats.win_percentage) : null
			} as VenueDirectoryEntry;
		});
	}, [venues, venueStats, isTeamRecordLoading]);

	return {
		directory,
		stats: venueStats,
		isLoading: isLoading || isTeamRecordLoading
	};
};
