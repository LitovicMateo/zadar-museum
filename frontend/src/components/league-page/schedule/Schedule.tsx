import React from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import Heading from '@/components/ui/Heading';
import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { ScheduleList } from '@/hooks/UseScheduleTable';
import styles from './Schedule.module.css';

const Schedule = () => {
	const { leagueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: leagueSeasons } = useLeagueSeasons(leagueSlug!);

	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);
	if (leagueGamelog === undefined || leagueSeasons === undefined) return null;

	return (
		<section className={styles.section}>
			<Heading title="Schedule" />
			<SeasonSelect seasons={leagueSeasons!} selectedSeason={selectedSeason} onSeasonChange={setSelectedSeason} />
			<ScheduleList schedule={leagueGamelog} />
		</section>
	);
};

export default Schedule;
