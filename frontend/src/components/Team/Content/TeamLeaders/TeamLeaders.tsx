import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { Avatar } from '@/components/UI/Avatar';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { Podium } from '@/components/UI/Podium';
import { APP_ROUTES } from '@/constants/Routes';
import { useTeamCompetitions } from '@/hooks/queries/team/UseTeamCompetitions';
import { useTeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import Filters from './Filters';
import LeadersList from './LeadersList';
import { coachOptions, playerOptions } from './Options';

const TeamLeaders = () => {
	const { teamSlug } = useParams();
	const [selected, setSelected] = useState<'player' | 'coach'>('player');
	const [selectedCompetition, setSelectedCompetition] = useState<string>('');
	const [stat, setStat] = useState<string | null>(null);

	const { data: teamLeaders } = useTeamLeaders(teamSlug!, selected, stat, selectedCompetition);
	const { data: competitions } = useTeamCompetitions(teamSlug!);

	useLayoutEffect(() => {
		if (selected === 'player') {
			setStat(playerOptions[0].value);
		} else {
			setStat(coachOptions[0].value);
		}
	}, [selected]);

	if (!competitions) return null;

	const visible = stat ? (teamLeaders ?? []).filter((leader) => leader[stat] !== null) : [];
	const top3 = visible.slice(0, 3);
	const rest = visible.slice(3);

	return (
		<section className="space-y-5">
			<MobileFilterSheet title="Filter leaders">
				<Filters
					selected={selected}
					setSelected={setSelected}
					stat={stat}
					setStat={setStat}
					selectedCompetition={selectedCompetition}
					setSelectedCompetition={setSelectedCompetition}
				/>
			</MobileFilterSheet>
			{!visible.length ? (
				<NoContent type="info" description="No leaders found" />
			) : (
				<div className="space-y-4">
					<Podium
						items={top3.map((leader) => {
							const name = `${leader.first_name} ${leader.last_name}`;
							return {
								id: leader.id,
								name,
								to: selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id),
								value: leader[stat!],
								avatar: <Avatar src={leader.image_url} alt={name} className="h-full w-full" />
							};
						})}
						eyebrow={`Top ${selected}`}
						ariaLabel={`Top ${selected} leaders`}
					/>
					{rest.length > 0 && (
						<LeadersList teamLeaders={rest} stat={stat} selected={selected} startRank={4} />
					)}
				</div>
			)}
		</section>
	);
};

export default TeamLeaders;
