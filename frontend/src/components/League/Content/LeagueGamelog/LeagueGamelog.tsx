import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper/DynamicContentWrapper';
import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';

import styles from './LeagueGamelog.module.css';

const LeagueGamelog = () => {
	const { leagueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: seasons } = useLeagueSeasons(leagueSlug!);
	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	return (
		<section className={styles.section}>
			<SeasonSelect
				compact
				seasons={seasons!}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
			/>
			<DynamicContentWrapper>
				<ScheduleList schedule={leagueGamelog} />
			</DynamicContentWrapper>
		</section>
	);
};

export default LeagueGamelog;
