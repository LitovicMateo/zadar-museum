import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CompetitionFilter from '@/components/forms/game/Filters/CompetitionFilter';
import SeasonFilter from '@/components/forms/game/Filters/SeasonFilter';
import GameFilter from '@/components/forms/team-stats/Filter/GameFilter';
import TeamFilter from '@/components/forms/team-stats/Filter/TeamFilter';
import TeamStatsForm from '@/components/forms/team-stats/TeamStatsForm';
import Fieldset from '@/components/ui/fieldset';
import FormWrapper from '@/components/ui/form-wrapper';
import { useSingleTeamStats } from '@/hooks/queries/team-stats/useSingleTeamStats';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';
import { updateTeamStats } from '@/services/team-stats/updateTeamStats';
import { useMutation } from '@tanstack/react-query';

const EditTeamStats = () => {
	const [teamStatsId, setTeamStatsId] = React.useState('');

	const [season, setSeason] = React.useState('');
	const [league, setLeague] = React.useState('');
	const [game, setGame] = React.useState('');
	const [team, setTeam] = React.useState('');

	const { data: teamStats } = useSingleTeamStats(game, team);

	const mutation = useMutation({
		mutationFn: updateTeamStats,
		onError(error) {
			console.error('Error updating coach', error.message);
			toast.error(`Error updating team stats: ${error.message}`);
		},
		onSuccess: () => {
			toast.success('Team stats updated successfully');
		}
	});

	React.useEffect(() => {
		if (teamStats) {
			setTeamStatsId(teamStats.documentId.toString());
		}
	}, [teamStats]);

	const handleSubmit = (data: TeamStatsFormData) => {
		mutation.mutate({ ...data, id: teamStatsId });
	};

	return (
		<div>
			<FormWrapper>
				<Fieldset label="Filter">
					<SeasonFilter selectedSeason={season} setSeason={setSeason} />
					<CompetitionFilter season={season} setLeague={setLeague} />
					<GameFilter setSelectedGame={setGame} league={league} season={season} />
					<TeamFilter game={game} setTeam={setTeam} />
				</Fieldset>
			</FormWrapper>
			{teamStats && (
				<TeamStatsForm
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						// filters
						season: teamStats?.game.season ?? '',
						league: teamStats?.game.competition.documentId ?? '',
						gameId: teamStats?.game.id?.toString() ?? '',
						teamId: teamStats?.team.id?.toString() ?? '',
						coachId: teamStats?.coach?.id?.toString() ?? '',
						assistantCoachId: teamStats?.assistantCoach?.id?.toString() ?? '',

						// score
						firstQuarter: teamStats?.firstQuarter?.toString() ?? '',
						secondQuarter: teamStats?.secondQuarter?.toString() ?? '',
						thirdQuarter: teamStats?.thirdQuarter?.toString() ?? '',
						fourthQuarter: teamStats?.fourthQuarter?.toString() ?? '',
						overtime: teamStats?.overtime ? teamStats.overtime.toString() : null,

						// shooting
						fieldGoalsMade: teamStats?.fieldGoalsMade?.toString() ?? '',
						fieldGoalsAttempted: teamStats?.fieldGoalsAttempted?.toString() ?? '',
						threePointersMade: teamStats?.threePointersMade?.toString() ?? '',
						threePointersAttempted: teamStats?.threePointersAttempted?.toString() ?? '',
						freeThrowsMade: teamStats?.freeThrowsMade?.toString() ?? '',
						freeThrowsAttempted: teamStats?.freeThrowsAttempted?.toString() ?? '',

						// rebounds
						rebounds: teamStats?.rebounds?.toString() ?? '',
						offensiveRebounds: teamStats?.offensiveRebounds?.toString() ?? '',
						defensiveRebounds: teamStats?.defensiveRebounds?.toString() ?? '',

						// passing
						assists: teamStats?.assists?.toString() ?? '',
						turnovers: teamStats?.turnovers?.toString() ?? '',

						// defense
						steals: teamStats?.steals?.toString() ?? '',
						blocks: teamStats?.blocks?.toString() ?? '',
						fouls: teamStats?.fouls?.toString() ?? '',

						// misc
						secondChancePoints: teamStats?.secondChancePoints?.toString() ?? '',
						fastBreakPoints: teamStats?.fastBreakPoints?.toString() ?? '',
						pointsOffTurnovers: teamStats?.pointsOffTurnovers?.toString() ?? '',
						benchPoints: teamStats?.benchPoints?.toString() ?? '',
						pointsInPaint: teamStats?.pointsInPaint?.toString() ?? ''
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditTeamStats;
