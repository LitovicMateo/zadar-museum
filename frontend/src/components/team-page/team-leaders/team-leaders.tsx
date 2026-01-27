import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import Heading from '@/components/ui/heading';
import { APP_ROUTES } from '@/constants/routes';
import { useTeamCompetitions } from '@/hooks/queries/team/useTeamCompetitions';
import { useTeamLeaders } from '@/hooks/queries/team/useTeamLeaders';

import Filters from './filters';
import { coachOptions, playerOptions } from './options';

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

	return (
		<section className="w-full h-fit py-4 flex flex-col gap-4">
			<Heading title={'Team Leaders'} />
			<Filters
				selected={selected}
				setSelected={setSelected}
				stat={stat}
				setStat={setStat}
				selectedCompetition={selectedCompetition}
				setSelectedCompetition={setSelectedCompetition}
			/>
			{!teamLeaders?.length ? (
				<NoContent type="info" description="No leaders found" />
			) : (
				<div className="rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white">
					<ul className="font-abel">
						<li className="flex justify-between px-4 py-3 font-semibold bg-slate-100 border-b-2 border-blue-500">
							<span className="text-gray-700">Player Name</span>
							<span className="text-gray-700">Statistic</span>
						</li>
						{teamLeaders?.map((leader, index) => {
							if (stat === null || leader[stat] === null) return null;

							const url =
								selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);
							return (
								<li
									key={leader.id}
									className={`flex justify-between px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group ${index === teamLeaders.length - 1 ? '' : 'border-b border-gray-200'}`}
								>
									<Link
										to={url}
										className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium"
									>
										{leader.first_name} {leader.last_name}
									</Link>
									<span className="px-2 font-bold text-gray-900 tabular-nums">{leader[stat]}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</section>
	);
};

export default TeamLeaders;
