import React, { useState } from 'react';

import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import LeagueFilter from '@/components/shared/filters/LeagueFilter';
import LocationFilter from '@/components/shared/filters/LocationFilter';
import SeasonFilter from '@/components/shared/filters/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';
import { useCoachCompareStats } from '@/hooks/queries/stats/UseCoachCompareStats';
import { useCoachRoster } from '@/hooks/queries/stats/UseCoachRoster';
import { CoachStatsRanking } from '@/types/api/Coach';

import CompareTable, { CompareRow } from './CompareTable';
import EntityPicker from './EntityPicker';

const COACH_COMPARE_ROWS: CompareRow<CoachStatsRanking>[] = [
	{ label: 'Games', key: 'games' },
	{ label: 'Wins', key: 'wins' },
	{ label: 'Losses', key: 'losses' },
	{ label: 'Win %', key: 'win_percentage' },
	{ label: 'Points scored', key: 'points_scored' },
	{ label: 'Points received', key: 'points_received' },
	{ label: 'Point difference', key: 'points_difference' }
];

const CoachCompare: React.FC<{ leading?: React.ReactNode }> = ({ leading }) => {
	const [coach1Id, setCoach1Id] = useState<string>('');
	const [coach2Id, setCoach2Id] = useState<string>('');
	const [location, setLocation] = useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = useState<string>('all');
	const [season, setSeason] = useState<string>('all');

	const { data: roster } = useCoachRoster();
	const { data: seasons } = useSeasons();
	const { data: competitions } = useCompetitions('slug', 'asc');
	const { data: compareData } = useCoachCompareStats(coach1Id, coach2Id, location, league, season);

	const options = (roster ?? []).map((coach) => ({
		value: coach.coach_id,
		label: `${coach.first_name} ${coach.last_name}`
	}));

	const coach1 = roster?.find((coach) => coach.coach_id === coach1Id);
	const coach2 = roster?.find((coach) => coach.coach_id === coach2Id);

	if (!seasons || !competitions) return null;

	return (
		<div className="flex flex-col gap-4 mt-4">
			<StatsFilterBar
				leading={
					<>
						{leading}
						<EntityPicker
							label="Coach A"
							options={options}
							value={coach1Id}
							onChange={setCoach1Id}
							excludeValue={coach2Id}
							placeholder="Select coach A"
						/>
						<EntityPicker
							label="Coach B"
							options={options}
							value={coach2Id}
							onChange={setCoach2Id}
							excludeValue={coach1Id}
							placeholder="Select coach B"
						/>
					</>
				}
				sheetTitle="Filter comparison"
			>
				<LocationFilter location={location} setLocation={setLocation} />
				<LeagueFilter league={league} setLeague={setLeague} competitions={competitions} />
				<SeasonFilter seasons={seasons} season={season} onSeasonChange={setSeason} />
			</StatsFilterBar>

			{coach1Id && coach2Id && (
				<CompareTable
					rows={COACH_COMPARE_ROWS}
					left={compareData?.coach1}
					right={compareData?.coach2}
					leftLabel={coach1 ? `${coach1.first_name} ${coach1.last_name}` : 'Coach A'}
					rightLabel={coach2 ? `${coach2.first_name} ${coach2.last_name}` : 'Coach B'}
					leftImageUrl={coach1?.image_url}
					rightImageUrl={coach2?.image_url}
				/>
			)}
		</div>
	);
};

export default CoachCompare;
