import React from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import Heading from '@/components/ui/Heading';
import { useRefereeGamelog } from '@/hooks/queries/referee/UseRefereeGamelog';

import RefereeFilter from './RefereeFilter';
import RefereeSeasonStats from './RefereeSeasonStats';

import styles from './RefereeGamelog.module.css';

const RefereeGamelog: React.FC = () => {
	const { refereeId } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const [selectedCompetitions, setSelectedCompetitions] = React.useState<string[]>([]);

	const { data: refereeGamelog } = useRefereeGamelog(refereeId!);

	const filteredGames = React.useMemo(() => {
		if (!refereeGamelog) return [];
		const filtered = refereeGamelog.filter((g) => selectedCompetitions.includes(g.league_id));
		return filtered;
	}, [refereeGamelog, selectedCompetitions]);

	if (refereeGamelog === undefined) return null;

	return (
		<section className={styles.section}>
			<Heading title="Seasonal Data" />
			<RefereeFilter
				season={selectedSeason}
				setSeason={setSelectedSeason}
				selectedCompetitions={selectedCompetitions}
				setSelectedCompetitions={setSelectedCompetitions}
			/>
			<RefereeSeasonStats season={selectedSeason} />
			<Heading title="Gamelog" type="secondary" />
			<ScheduleList schedule={filteredGames} />
		</section>
	);
};

export default RefereeGamelog;
