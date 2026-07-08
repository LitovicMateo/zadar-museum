import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppSelect from '@/components/forms/shared/AppSelect';

import NoContent from '@/components/NoContent/NoContent';
import TeamLogo from '@/components/Schedule/TeamLogo';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { Podium } from '@/components/UI/Podium';
import { RecordsCard, RecordsList } from '@/components/UI/RecordsList';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { APP_ROUTES } from '@/constants/Routes';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerSplitRecords } from '@/hooks/queries/player/UsePlayerSplitRecords';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';

import { playerRecordOptions } from '../recordOptions';
import PlayerCompetitionSelect from './PlayerCompetitionSelect';

type Location = 'total' | 'home' | 'away' | 'neutral';
type StatOption = { value: string; label: string };

const itemBorder = 'border border-court data-[state=on]:border-transparent';
const labelClass = 'mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground';

/** All-time single-game records for a player, filterable by competition and location. */
const PlayerLeagueRecords: React.FC = () => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();
	const logos = useTeamLogos();

	const [statKey, setStatKey] = useState<string>(playerRecordOptions[0].value);
	const [league, setLeague] = useState<string>('');
	const [location, setLocation] = useState<Location>('total');

	const { data } = usePlayerSplitRecords(playerId!, statKey, league || undefined, selectedDatabase);

	const hasHome = !!data?.home?.length;
	const hasAway = !!data?.away?.length;
	const hasNeutral = !!data?.neutral?.length;

	const effectiveLocation: Location =
		(location === 'home' && !hasHome) ||
		(location === 'away' && !hasAway) ||
		(location === 'neutral' && !hasNeutral)
			? 'total'
			: location;

	const normalized = useMemo(() => {
		const rows = data?.[effectiveLocation] ?? [];
		return rows.map((r) => ({
			game_id: r.game_id,
			name: r.opponent_team_name,
			season: r.season,
			stat_value: Number(r.stat_value),
			avatar: <TeamLogo image={logos.get(r.opponent_team_slug)} name={r.opponent_team_name} className="h-full w-full" />
		}));
	}, [data, effectiveLocation, logos]);

	const locationOptions: SegmentedOption<Location>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: !hasHome },
		{ value: 'away', label: 'Away', disabled: !hasAway },
		{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
	];

	const top3 = normalized.slice(0, 3);
	const rest = normalized.slice(3);

	return (
		<section className="space-y-4">
			<h2 className="font-display text-lg font-semibold text-court">Single-Game Records</h2>

			<MobileFilterSheet title="Filter records">
				<div className="flex flex-wrap items-end gap-3">
					<div className="w-48">
						<label className={labelClass}>Competition</label>
						<PlayerCompetitionSelect selectedCompetition={league} setSelectedCompetition={setLeague} />
					</div>
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
					<SegmentedToggle
						value={effectiveLocation}
						onValueChange={setLocation}
						options={locationOptions}
						ariaLabel="Location filter"
						itemClassName={itemBorder}
					/>
				</div>
			</MobileFilterSheet>

			{!normalized.length ? (
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
						eyebrow="All-time record"
						ariaLabel="Top single-game records"
					/>
					{rest.length > 0 && (
						<RecordsCard>
							<RecordsList records={rest} nameLabel="Opponent" startRank={4} showHeader={false} />
						</RecordsCard>
					)}
				</div>
			)}
		</section>
	);
};

export default PlayerLeagueRecords;
