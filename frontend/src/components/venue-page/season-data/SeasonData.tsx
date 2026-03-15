import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import Heading from '@/components/ui/Heading';
import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';

import TeamLeagueStats from '../../league-page/league-season/TeamLeagueStats';
import PlayerLeagueStats from './PlayerLeagueStats';

import styles from './SeasonData.module.css';

const SeasonData = () => {
	const { leagueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: seasons } = useLeagueSeasons(leagueSlug!);
	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	if (leagueGamelog === undefined || seasons === undefined) return null;

	return (
		<section className={styles.section}>
			<SeasonSelect seasons={seasons!} selectedSeason={selectedSeason} onSeasonChange={setSelectedSeason} />
			<TeamLeagueStats season={selectedSeason} />
			<Heading title="Player Stats" type="secondary" />
			<PlayerLeagueStats season={selectedSeason} />
			<Heading title="Schedule" type="secondary" />
			<ScheduleList schedule={leagueGamelog} />
		</section>
	);
};

export default SeasonData;
