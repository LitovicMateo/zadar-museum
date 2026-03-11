import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { APP_ROUTES } from '@/constants/Routes';
import { useTeamCompetitions } from '@/hooks/queries/team/UseTeamCompetitions';
import { useTeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import Filters from './Filters';
import { coachOptions, playerOptions } from './Options';
import styles from './TeamLeaders.module.css';

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
		<section className={styles.section}>
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
				<div className={styles.card}>
					<ul className={styles.list}>
						<li className={styles.header}>
							<span className={styles.headerCell}>Player Name</span>
							<span className={styles.headerCell}>Statistic</span>
						</li>
						{teamLeaders?.map((leader, index) => {
							if (stat === null || leader[stat] === null) return null;

							const url =
								selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);
							return (
								<li
									key={leader.id}
									className={`${styles.item} ${index === teamLeaders.length - 1 ? "" : styles.itemBorder}`}
								>
									<Link
										to={url}
										className={styles.link}
									>
										{leader.first_name} {leader.last_name}
									</Link>
									<span className={styles.value}>{leader[stat]}</span>
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
