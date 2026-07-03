import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppSelect from '@/components/forms/shared/AppSelect';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import TeamLogo from '@/components/Schedule/TeamLogo';
import { Avatar } from '@/components/UI/Avatar';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { Podium } from '@/components/UI/Podium';
import { RecordsCard, RecordsList } from '@/components/UI/RecordsList';
import { APP_ROUTES } from '@/constants/Routes';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';
import { useTeamPlayerRecords } from '@/hooks/queries/team/UseTeamPlayerRecords';
import { useTeamSeasons } from '@/hooks/queries/team/UseTeamSeasons';
import { useTeamTeamRecords } from '@/hooks/queries/team/UseTeamTeamRecords';

import { RECORDS_VARIANTS, type RecordsVariant } from './Options';

type Option = { value: string; label: string };

type TeamRecordsProps = {
	variant: RecordsVariant;
};

const labelClass = 'mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground';

const TeamRecords = ({ variant }: TeamRecordsProps) => {
	const { teamSlug } = useParams();
	const { options, nameLabel } = RECORDS_VARIANTS[variant];
	const [statKey, setStatKey] = useState<string>(options[0].value);
	const [selectedSeason, setSelectedSeason] = useState<string>('');

	const { data: seasons } = useTeamSeasons(teamSlug!);
	const logos = useTeamLogos();
	// Both hooks are called unconditionally (rules of hooks); the inactive variant
	// is gated off by passing an empty statKey, which disables its query.
	const playerRecords = useTeamPlayerRecords(teamSlug!, variant === 'player' ? statKey : '', selectedSeason);
	const teamRecords = useTeamTeamRecords(teamSlug!, variant === 'team' ? statKey : '', selectedSeason);

	const normalized =
		variant === 'player'
			? (playerRecords.data ?? []).map((r) => {
					const name = `${r.first_name} ${r.last_name}`;
					return {
						game_id: r.game_id,
						name,
						season: r.season,
						stat_value: Number(r.stat_value),
						avatar: <Avatar src={r.image_url} alt={name} className="h-full w-full" />
					};
				})
			: (teamRecords.data ?? []).map((r) => ({
					game_id: r.game_id,
					name: r.opponent_name,
					season: r.season,
					stat_value: Number(r.stat_value),
					avatar: <TeamLogo image={logos.get(r.opponent_slug)} name={r.opponent_name} className="h-full w-full" />
				}));

	const top3 = normalized.slice(0, 3);
	const rest = normalized.slice(3);

	return (
		<section className="space-y-5">
			<MobileFilterSheet title="Filter records">
				<div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
					<div className="sm:w-48">
						<label className={labelClass}>Statistic</label>
						<AppSelect<Option>
							options={options as unknown as Option[]}
							value={options.find((o) => o.value === statKey) as unknown as Option}
							onChange={(opt) => opt && setStatKey(opt.value)}
							isSearchable={false}
							styles={selectStyle()}
							className="text-sm"
						/>
					</div>
					<div className="sm:w-40">
						<label className={labelClass}>Season</label>
						<SeasonSelect
							compact
							fullWidth
							showAll
							seasons={seasons ?? []}
							selectedSeason={selectedSeason}
							onSeasonChange={setSelectedSeason}
						/>
					</div>
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
						ariaLabel={`Top ${nameLabel.toLowerCase()} records`}
					/>
					{rest.length > 0 && (
						<RecordsCard>
							<RecordsList records={rest} nameLabel={nameLabel} startRank={4} showHeader={false} />
						</RecordsCard>
					)}
				</div>
			)}
		</section>
	);
};

export default TeamRecords;
