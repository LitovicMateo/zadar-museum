import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CompetitionFilter from '@/components/forms/game/Filters/CompetitionFilter';
import GameFilter from '@/components/forms/game/Filters/GameFilter';
import SeasonFilter from '@/components/forms/game/Filters/SeasonFilter';
import GameForm from '@/components/forms/game/GameForm';
import Fieldset from '@/components/ui/fieldset';
import FormWrapper from '@/components/ui/form-wrapper';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { GameFormData } from '@/schemas/game-schema';
import { updateGame } from '@/services/games/updateGame';
import { refreshSchedule } from '@/utils/refreshSchedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditGame = () => {
	const queryClient = useQueryClient();
	const [gameId, setGameId] = React.useState('');

	const [season, setSeason] = React.useState('');
	const [league, setLeague] = React.useState('');

	const { data: game } = useGameDetails(gameId);

	const mutation = useMutation({
		mutationFn: updateGame,
		onError(error) {
			toast.error(`Error updating game: ${error.message}`);
		},
		onSuccess: async () => {
			await refreshSchedule();
			toast.success('Game updated successfully');
			queryClient.invalidateQueries({ queryKey: ['dashboard', 'games', season, league] });
		}
	});

	const handleSubmit = (data: GameFormData) => {
		mutation.mutate({ ...data, id: gameId });
	};

	useEffect(() => {
		setLeague('');
	}, [season]);

	useEffect(() => {
		setGameId('');
	}, [season, league]);

	return (
		<div>
			<FormWrapper>
				<Fieldset label="Filters">
					<SeasonFilter selectedSeason={season} setSeason={setSeason} />
					<CompetitionFilter setLeague={setLeague} season={season} />
					<GameFilter selectedGame={gameId} setSelectedGame={setGameId} league={league} season={season} />
				</Fieldset>
			</FormWrapper>
			{game && (
				<GameForm
					game={game}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						season: game.season,
						round: game.round,
						date: game.date,
						home_team: game.home_team.id.toString(),
						home_team_name: game.home_team.name,
						home_team_short_name: game.home_team.short_name,
						away_team: game.away_team.id.toString(),
						away_team_name: game.away_team.name,
						away_team_short_name: game.away_team.short_name,
						stage: game.stage,
						competition: game.competition.id.toString(),
						league_name: game.competition.name,
						league_short_name: game.competition.short_name,
						venue: game.venue.id.toString(),
						isNeutral: game.isNeutral,
						isNulled: game.isNulled,
						forfeited: game.forfeited,
						forfeited_by: game.forfeited_by,
						attendance: game.attendance,
						mainReferee: game.mainReferee ? game.mainReferee.id.toString() : undefined,
						secondReferee: game.secondReferee ? game.secondReferee.id.toString() : undefined,
						thirdReferee: game.thirdReferee ? game.thirdReferee.id.toString() : undefined,
						staffers: game.staffers?.map((st) => st.id.toString()),
						gallery: game.gallery
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditGame;
