import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useTeamLeagueStats } from '@/hooks/queries/team/UseTeamLeagueStats';
import { useTeamTotalStats } from '@/hooks/queries/team/UseTeamTotalStats';
import { TeamStats, TeamStatsResponse } from '@/types/api/Team';

import DatabaseSelect from './DatabaseSelect';
import TeamPlayerSplits from '../TeamPlayerSplits/TeamPlayerSplits';
import { TeamLeagueCell, teamStatsColumns } from '../teamColumns';

const TeamLeagueStats: React.FC = () => {
	const { teamSlug } = useParams();
	const [selected, setSelected] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const { data: leagueStats } = useTeamLeagueStats(teamSlug!);
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const hasHome = !!leagueStats?.some((team) => (team.home?.games ?? 0) > 0);
	const hasAway = !!leagueStats?.some((team) => (team.away?.games ?? 0) > 0);
	const hasNeutral = !!leagueStats?.some((team) => (team.neutral?.games ?? 0) > 0);

	// If the current selection becomes unavailable, fall back to 'total'.
	const effectiveSelected: 'total' | 'home' | 'away' | 'neutral' =
		(selected === 'home' && !hasHome) || (selected === 'away' && !hasAway) || (selected === 'neutral' && !hasNeutral)
			? 'total'
			: selected;

	const groups = useMemo(
		() =>
			buildPhaseGroups<TeamStatsResponse, TeamStats>(leagueStats, {
				combined: (e) => e[effectiveSelected],
				regular: (e) => e.regular?.[effectiveSelected] ?? null,
				playoff: (e) => e.playoff?.[effectiveSelected] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <TeamLeagueCell leagueSlug={r.league_slug} />,
			}),
		[leagueStats, effectiveSelected],
	);

	const footerRows = useMemo<StatsDataRow<TeamStats>[]>(() => {
		const row = totalStats?.[effectiveSelected];
		return row ? [{ key: 'total', data: row }] : [];
	}, [totalStats, effectiveSelected]);

	if (!leagueStats || !totalStats) {
		return <NoContent type="info" description="No league stats available for this team yet." />;
	}

	return (
		<section className="space-y-4">
			<MobileFilterSheet title="Filter stats">
				<DatabaseSelect
					selected={effectiveSelected}
					setSelected={setSelected}
					homeDisabled={!hasHome}
					awayDisabled={!hasAway}
					neutralDisabled={!hasNeutral}
				/>
			</MobileFilterSheet>
			<StatsTable
				columns={teamStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'default' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>

			<TeamPlayerSplits teamSlug={teamSlug!} />
		</section>
	);
};

export default TeamLeagueStats;
