import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import Pill from '@/components/UI/Pill';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useGamesContext } from '@/hooks/context/UseGamesContext';
import { useTeamSeasonLeagueStats } from '@/hooks/queries/team/UseTeamSeasonLeagueStats';
import { useTeamSeasonStats } from '@/hooks/queries/team/UseTeamSeasonStats';
import { TeamStats, TeamStatsResponse } from '@/types/api/Team';

import { TeamLeagueCell, teamStatsColumns } from '../teamColumns';

import styles from './TeamSeasonStats.module.css';

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
					<Pill
						label="home"
						isActive={effectiveSelected === 'home'}
						onClick={() => setSelected('home')}
						isDisabled={!hasHome}
					>
						Home
					</Pill>
					<Pill
						label="away"
						isActive={effectiveSelected === 'away'}
						onClick={() => setSelected('away')}
						isDisabled={!hasAway}
					>
						Away
					</Pill>
					<Pill
						label="neutral"
						isActive={effectiveSelected === 'neutral'}
						onClick={() => setSelected('neutral')}
						isDisabled={!hasNeutral}
					>
						Neutral
					</Pill>
				</fieldset>
			</div>

			<StatsTable
				columns={teamStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'light' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default TeamSeasonStats;
