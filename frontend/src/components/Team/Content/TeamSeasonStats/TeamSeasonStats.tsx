import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useGamesContext } from '@/hooks/context/UseGamesContext';
import { useTeamSeasonLeagueStats } from '@/hooks/queries/team/UseTeamSeasonLeagueStats';
import { useTeamSeasonStats } from '@/hooks/queries/team/UseTeamSeasonStats';
import { TeamStats, TeamStatsResponse } from '@/types/api/Team';

import { TeamLeagueCell, teamStatsColumns } from '../teamColumns';

type View = 'total' | 'home' | 'away' | 'neutral';

const TeamSeasonStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { selectedSeason, seasons, setSelectedSeason } = useGamesContext();

	const [selected, setSelected] = useState<View>('total');

	const { data: seasonLeagueStats } = useTeamSeasonStats(selectedSeason!, teamSlug!);
	const { data: seasonStats } = useTeamSeasonLeagueStats(selectedSeason!, teamSlug!);

	const hasHome = (seasonStats?.home?.games ?? 0) > 0;
	const hasAway = (seasonStats?.away?.games ?? 0) > 0;
	const hasNeutral = (seasonStats?.neutral?.games ?? 0) > 0;

	// If the current selection becomes unavailable (e.g. navigated to a season
	// with no games at that location while it was active), fall back to 'total'.
	const effectiveSelected: View =
		(selected === 'home' && !hasHome) || (selected === 'away' && !hasAway) || (selected === 'neutral' && !hasNeutral)
			? 'total'
			: selected;

	const groups = useMemo(
		() =>
			buildPhaseGroups<TeamStatsResponse, TeamStats>(seasonLeagueStats, {
				combined: (e) => e[effectiveSelected],
				regular: (e) => e.regular?.[effectiveSelected] ?? null,
				playoff: (e) => e.playoff?.[effectiveSelected] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <TeamLeagueCell leagueSlug={r.league_slug} />,
			}),
		[seasonLeagueStats, effectiveSelected],
	);

	const footerRows = useMemo<StatsDataRow<TeamStats>[]>(() => {
		const row = seasonStats?.[effectiveSelected];
		return row ? [{ key: 'total', data: row }] : [];
	}, [seasonStats, effectiveSelected]);

	if (!seasons) return null;

	if (!seasonStats || !seasonLeagueStats) {
		return <NoContent type="info" description="No stats available for the selected season." />;
	}

	const locationOptions: SegmentedOption<View>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: !hasHome },
		{ value: 'away', label: 'Away', disabled: !hasAway },
		{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
	];

	return (
		<section className="space-y-4">
			<MobileFilterSheet title="Filter season">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
					<SeasonSelect
						seasons={seasons}
						selectedSeason={selectedSeason}
						compact
						onSeasonChange={(season) => {
							setSelectedSeason(season);
						}}
					/>
					<SegmentedToggle
						value={effectiveSelected}
						onValueChange={setSelected}
						options={locationOptions}
						ariaLabel="Location filter"
					/>
				</div>
			</MobileFilterSheet>

			<StatsTable
				columns={teamStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'default' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default TeamSeasonStats;
