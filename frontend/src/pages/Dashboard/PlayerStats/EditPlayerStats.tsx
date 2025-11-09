import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CompetitionFilter from '@/components/forms/game/Filters/CompetitionFilter';
import SeasonFilter from '@/components/forms/game/Filters/SeasonFilter';
import PlayerFilter from '@/components/forms/player-stats/Filter/PlayerFilter';
import PlayerStatsForm from '@/components/forms/player-stats/PlayerStatsForm';
import GameFilter from '@/components/forms/team-stats/Filter/GameFilter';
import TeamFilter from '@/components/forms/team-stats/Filter/TeamFilter';
import Fieldset from '@/components/ui/fieldset';
import FormWrapper from '@/components/ui/form-wrapper';
import { useGamePlayerStats } from '@/hooks/queries/player-stats/useGamePlayerStats';
import { PlayerStatsFormData } from '@/schemas/player-stats';
import { updatePlayerStats } from '@/services/player-stats/updatePlayerStats';
import { PlayerStatsResponse } from '@/types/api/player-stats';
import { useMutation } from '@tanstack/react-query';

const EditPlayerStats = () => {
	const [playerStatsId, setPlayerStatsId] = React.useState('');

	const [season, setSeason] = React.useState('');
	const [league, setLeague] = React.useState('');
	const [game, setGame] = React.useState('');
	const [team, setTeam] = React.useState('');

	const { data: playerStats } = useGamePlayerStats(game, team);
	const player = playerStats?.find((player: PlayerStatsResponse) => player.documentId === playerStatsId);

	const mutation = useMutation({
		mutationFn: updatePlayerStats,
		onError(error) {
			console.error('Error updating coach', error.message);
			toast.error(`Error updating team stats: ${error.message}`);
		},
		onSuccess: () => {
			toast.success('Team stats updated successfully');
		}
	});

	const handleSubmit = (data: PlayerStatsFormData) => {
		mutation.mutate({ ...data, id: playerStatsId });
	};

	return (
		<div>
			<FormWrapper>
				<Fieldset label="Filter">
					<SeasonFilter selectedSeason={season} setSeason={setSeason} />
					<CompetitionFilter season={season} setLeague={setLeague} />
					<GameFilter league={league} season={season} setSelectedGame={setGame} />
					<TeamFilter game={game} setTeam={setTeam} />
					<PlayerFilter game={game} team={team} setPlayerStatsId={setPlayerStatsId} />
				</Fieldset>
			</FormWrapper>
			{player && (
				<PlayerStatsForm
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={(() => {
						const isDnp = player.status === 'dnp-cd';

						return {
							season,
							league,
							gameId: player.game.id.toString(),
							teamId: player.team.id.toString(),
							playerId: player.player.id.toString(),
							status: player.status,
							isCaptain: player.isCaptain,
							playerNumber: player.playerNumber,
							minutes: isDnp ? '' : player.minutes,
							seconds: isDnp ? '' : player.seconds,
							points: isDnp ? '' : player.points,
							fieldGoalsMade: isDnp ? '' : player.fieldGoalsMade,
							fieldGoalsAttempted: isDnp ? '' : player.fieldGoalsAttempted,
							threePointersMade: isDnp ? '' : player.threePointersMade,
							threePointersAttempted: isDnp ? '' : player.threePointersAttempted,
							freeThrowsMade: isDnp ? '' : player.freeThrowsMade,
							freeThrowsAttempted: isDnp ? '' : player.freeThrowsAttempted,
							rebounds: isDnp ? '' : player.rebounds,
							offensiveRebounds: isDnp ? '' : player.offensiveRebounds,
							defensiveRebounds: isDnp ? '' : player.defensiveRebounds,
							assists: isDnp ? '' : player.assists,
							steals: isDnp ? '' : player.steals,
							blocks: isDnp ? '' : player.blocks,
							turnovers: isDnp ? '' : player.turnovers,
							fouls: isDnp ? '' : player.fouls,
							foulsOn: isDnp ? '' : player.foulsOn,
							blocksReceived: isDnp ? '' : player.blocksReceived,
							plusMinus: isDnp ? '' : player.plusMinus,
							efficiency: isDnp ? '' : player.efficiency
						};
					})()}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditPlayerStats;
