import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/season-select';
import Heading from '@/components/ui/heading';
import { useLeagueGames } from '@/hooks/queries/league/useLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/useLeagueSeasons';
import { ScheduleList } from '@/hooks/useScheduleTable';

import TeamLeagueStats from '../../league-page/league-season/team-league-stats';
import PlayerLeagueStats from './player-league-stats';

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
		<section className="flex flex-col gap-4">
			<Heading title="Seasonal Data" />
			<SeasonSelect seasons={seasons!} selectedSeason={selectedSeason} onSeasonChange={setSelectedSeason} />
			<Heading title="Team Stats" type="secondary" />
			<TeamLeagueStats season={selectedSeason} />
			<Heading title="Player Stats" type="secondary" />
			<PlayerLeagueStats season={selectedSeason} />
			<Heading title="Schedule" type="secondary" />
		<ScheduleList schedule={leagueGamelog} />
		</section>
	);
};

export default SeasonData;
