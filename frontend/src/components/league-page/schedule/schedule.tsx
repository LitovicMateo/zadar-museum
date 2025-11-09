import React from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/season-select';
import Heading from '@/components/ui/heading';
import { useLeagueGames } from '@/hooks/queries/league/useLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/useLeagueSeasons';
import { useScheduleTable } from '@/hooks/useScheduleTable';

const Schedule = () => {
	const { leagueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState<string>('2025');

	const { data: leagueSeasons } = useLeagueSeasons(leagueSlug!);

	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);
	const { Schedule } = useScheduleTable(leagueGamelog!);

	if (leagueGamelog === undefined || leagueSeasons === undefined) return null;

	return (
		<section className="flex flex-col gap-4 min-h-[500px]">
			<Heading title="Schedule" />
			<SeasonSelect seasons={leagueSeasons!} selectedSeason={selectedSeason} onSeasonChange={setSelectedSeason} />
			<Schedule />
		</section>
	);
};

export default Schedule;
