import React, { useState } from 'react';

import FilterWrapper from '@/components/Stats/UI/FilterWrapper';
import LeagueFilter from '@/components/shared/filters/LeagueFilter';
import LocationFilter from '@/components/shared/filters/LocationFilter';
import SeasonFilter from '@/components/shared/filters/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';
import { usePlayerCompareStats } from '@/hooks/queries/stats/UsePlayerCompareStats';
import { usePlayerRoster } from '@/hooks/queries/stats/UsePlayerRoster';
import { GameStats } from '@/types/api/Player';

import StatsFilter from '../PlayerStats/filter/StatsFilter';
import CompareTable, { CompareRow } from './CompareTable';
import EntityPicker from './EntityPicker';

const PLAYER_COMPARE_ROWS: CompareRow<GameStats>[] = [
	{ label: 'Games', key: 'games' },
	{ label: 'Games started', key: 'games_started' },
	{ label: 'Minutes', key: 'minutes' },
	{ label: 'Points', key: 'points' },
	{ label: 'Rebounds', key: 'rebounds' },
	{ label: 'Off. rebounds', key: 'off_rebounds' },
	{ label: 'Def. rebounds', key: 'def_rebounds' },
	{ label: 'Assists', key: 'assists' },
	{ label: 'Steals', key: 'steals' },
	{ label: 'Blocks', key: 'blocks' },
	{ label: 'FG made', key: 'field_goals_made' },
	{ label: 'FG attempted', key: 'field_goals_attempted' },
	{ label: 'FG%', key: 'field_goal_percentage' },
	{ label: '3PT made', key: 'three_pointers_made' },
	{ label: '3PT attempted', key: 'three_pointers_attempted' },
	{ label: '3PT%', key: 'three_point_percentage' },
	{ label: 'FT made', key: 'free_throws_made' },
	{ label: 'FT attempted', key: 'free_throws_attempted' },
	{ label: 'FT%', key: 'free_throw_percentage' },
	{ label: 'Efficiency', key: 'efficiency' }
];

const PlayerCompare: React.FC = () => {
	const [player1Id, setPlayer1Id] = useState<string>('');
	const [player2Id, setPlayer2Id] = useState<string>('');
	const [stats, setStats] = useState<'total' | 'average'>('total');
	const [location, setLocation] = useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = useState<string>('all');
	const [season, setSeason] = useState<string>('all');

	const { data: roster } = usePlayerRoster();
	const { data: seasons } = useSeasons();
	const { data: competitions } = useCompetitions('slug', 'asc');
	const { data: compareData } = usePlayerCompareStats(player1Id, player2Id, stats, location, league, season);

	const options = (roster ?? []).map((player) => ({
		value: player.player_id,
		label: `${player.first_name} ${player.last_name}`
	}));

	const player1 = roster?.find((player) => player.player_id === player1Id);
	const player2 = roster?.find((player) => player.player_id === player2Id);

	if (!seasons || !competitions) return null;

	return (
		<div className="flex flex-col gap-4 mt-4">
			<FilterWrapper>
				<StatsFilter stats={stats} setStats={setStats} />
				<LocationFilter location={location} setLocation={setLocation} />
				<LeagueFilter league={league} setLeague={setLeague} competitions={competitions} />
				<SeasonFilter seasons={seasons} season={season} onSeasonChange={setSeason} />
			</FilterWrapper>

			<div className="flex flex-col md:flex-row gap-4">
				<EntityPicker
					label="Player A"
					options={options}
					value={player1Id}
					onChange={setPlayer1Id}
					excludeValue={player2Id}
					placeholder="Select a player"
				/>
				<EntityPicker
					label="Player B"
					options={options}
					value={player2Id}
					onChange={setPlayer2Id}
					excludeValue={player1Id}
					placeholder="Select a player"
				/>
			</div>

			{player1Id && player2Id && (
				<CompareTable
					rows={PLAYER_COMPARE_ROWS}
					left={compareData?.player1}
					right={compareData?.player2}
					leftLabel={player1 ? `${player1.first_name} ${player1.last_name}` : 'Player A'}
					rightLabel={player2 ? `${player2.first_name} ${player2.last_name}` : 'Player B'}
					leftImageUrl={player1?.image_url}
					rightImageUrl={player2?.image_url}
				/>
			)}
		</div>
	);
};

export default PlayerCompare;
