import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { useTeamCompetitions } from '@/hooks/queries/team/UseTeamCompetitions';
import { useTeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import Filters from './Filters';
import LeadersList from './LeadersList';
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
				<LeadersList teamLeaders={teamLeaders} stat={stat} selected={selected} />
			)}
		</section>
	);
};

export default TeamLeaders;
