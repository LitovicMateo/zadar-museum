import React, { useMemo, useState } from 'react';

import AppSelect from '@/components/forms/shared/AppSelect';
import NoContent from '@/components/NoContent/NoContent';
import { Avatar } from '@/components/UI/Avatar';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { Podium } from '@/components/UI/Podium';
import { RecordsCard, RecordsList } from '@/components/UI/RecordsList';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { StatsTable, type StatsGroup } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';
import { useTeamPlayerSplitRecords } from '@/hooks/queries/team/UseTeamPlayerSplitRecords';
import {
	useTeamPlayerSplitStats,
	type TeamPlayerScope
} from '@/hooks/queries/team/UseTeamPlayerSplitStats';
import { TeamPlayerAggStat } from '@/types/api/Team';

import CompetitionSelect from '../TeamLeaders/CompetitionSelect';
import { playerRecordOptions } from '../TeamRecords/Options';
import { playerStatsColumns } from '../playerStatsColumns';

type Mode = 'total' | 'average' | 'record';
type Location = 'total' | 'home' | 'away' | 'neutral';
type StatOption = { value: string; label: string };

const itemBorder = 'border border-court data-[state=on]:border-transparent';
const labelClass = 'mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground';

type Props = {
	teamSlug: string;
	/** All-time on the League tab; a specific season on the Season tab. */
	season?: string;
};

const TeamPlayerSplits: React.FC<Props> = ({ teamSlug, season }) => {
	const [mode, setMode] = useState<Mode>('total');
	const [location, setLocation] = useState<Location>('total');
	const [database, setDatabase] = useState<TeamPlayerScope>('team');
	const [league, setLeague] = useState<string>('');
	const [statKey, setStatKey] = useState<string>(playerRecordOptions[0].value);

	const { data: team } = useTeamDetails(teamSlug);
	const { data: mainTeam } = useMainTeam();
	const isMainTeam = !!team?.isMainTeam;

	const isRecord = mode === 'record';
	const leagueParam = league || undefined;

	const { data: aggData } = useTeamPlayerSplitStats(teamSlug, {
		stats: mode === 'average' ? 'average' : 'total',
		database,
		league: leagueParam,
		season,
		enabled: !isRecord
	});

	const { data: recordData } = useTeamPlayerSplitRecords(teamSlug, {
		statKey,
		database,
		league: leagueParam,
		season,
		enabled: isRecord
	});

	// Location availability is read from whichever response is active.
	const active = isRecord ? recordData : aggData;
	const hasHome = !!active?.home?.length;
	const hasAway = !!active?.away?.length;
	const hasNeutral = !!active?.neutral?.length;

	const effectiveLocation: Location =
		(location === 'home' && !hasHome) ||
		(location === 'away' && !hasAway) ||
		(location === 'neutral' && !hasNeutral)
			? 'total'
			: location;

	const groups = useMemo<StatsGroup<TeamPlayerAggStat>[]>(() => {
		const rows = aggData?.[effectiveLocation] ?? [];
		return rows.map((p) => ({ key: p.player_id, rows: [{ key: p.player_id, data: p }] }));
	}, [aggData, effectiveLocation]);

	const normalizedRecords = useMemo(() => {
		const rows = recordData?.[effectiveLocation] ?? [];
		return rows.map((r) => {
			const name = `${r.first_name} ${r.last_name}`;
			return {
				game_id: r.game_id,
				name,
				season: r.season,
				stat_value: Number(r.stat_value),
				avatar: <Avatar src={r.image_url} alt={name} className="h-full w-full" />
			};
		});
	}, [recordData, effectiveLocation]);

	const modeOptions: SegmentedOption<Mode>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'average', label: 'Average' },
		{ value: 'record', label: 'Record' }
	];
	const locationOptions: SegmentedOption<Location>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: !hasHome },
		{ value: 'away', label: 'Away', disabled: !hasAway },
		{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
	];
	const databaseOptions: SegmentedOption<TeamPlayerScope>[] = [
		{ value: 'team', label: team?.short_name ?? 'This team' },
		{ value: 'main', label: mainTeam?.short_name ?? 'Main team' }
	];

	const top3 = normalizedRecords.slice(0, 3);
	const rest = normalizedRecords.slice(3);

	return (
		<section className="space-y-4">
			<h2 className="font-display text-lg font-semibold text-court">Player Stats</h2>

			<MobileFilterSheet title="Filter player stats">
				<div className="flex flex-wrap items-end gap-3">
					<CompetitionSelect selectedCompetition={league} setSelectedCompetition={setLeague} />
					<SegmentedToggle
						value={mode}
						onValueChange={setMode}
						options={modeOptions}
						ariaLabel="Total, average or record"
						itemClassName={itemBorder}
					/>
					<SegmentedToggle
						value={effectiveLocation}
						onValueChange={setLocation}
						options={locationOptions}
						ariaLabel="Location filter"
						itemClassName={itemBorder}
					/>
					{!isMainTeam && (
						<SegmentedToggle
							value={database}
							onValueChange={setDatabase}
							options={databaseOptions}
							ariaLabel="Team filter"
							itemClassName={itemBorder}
						/>
					)}
					{isRecord && (
						<div className="w-44">
							<label className={labelClass}>Statistic</label>
							<AppSelect<StatOption>
								options={playerRecordOptions as unknown as StatOption[]}
								value={playerRecordOptions.find((o) => o.value === statKey) as unknown as StatOption}
								onChange={(opt) => opt && setStatKey(opt.value)}
								isSearchable={false}
								styles={selectStyle()}
								className="text-sm"
							/>
						</div>
					)}
				</div>
			</MobileFilterSheet>

			{isRecord ? (
				!normalizedRecords.length ? (
					<NoContent type="info" description="No records found" />
				) : (
					<div className="space-y-4">
						<Podium
							items={top3.map((r) => ({
								id: r.game_id,
								name: r.name,
								to: APP_ROUTES.game(r.game_id),
								value: r.stat_value,
								meta: r.season,
								avatar: r.avatar
							}))}
							eyebrow="Record"
							ariaLabel="Top player records"
						/>
						{rest.length > 0 && (
							<RecordsCard>
								<RecordsList records={rest} nameLabel="Player" startRank={4} showHeader={false} />
							</RecordsCard>
						)}
					</div>
				)
			) : !groups.length ? (
				<NoContent type="info" description="No player stats available for this selection." />
			) : (
				<StatsTable
					columns={playerStatsColumns}
					groups={groups}
					initialSort={{ columnId: 'points', dir: 'desc' }}
				/>
			)}
		</section>
	);
};

export default TeamPlayerSplits;
