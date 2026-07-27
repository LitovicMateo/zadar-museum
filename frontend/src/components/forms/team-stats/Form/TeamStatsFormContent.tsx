import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { useCompetitionGames } from '@/hooks/queries/dasboard/UseCompetitionGames';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { PeriodFormat } from '@/types/api/Game';
import { TeamStatsResponse } from '@/types/api/TeamStats';

import AssistantCoach from '../Fields/AssistantCoach';
import Competition from '../Fields/Competition';
import Defense from '../Fields/Defense';
import Game from '../Fields/Game';
import HeadCoach from '../Fields/HeadCoach';
import Misc from '../Fields/Misc';
import Passing from '../Fields/Passing';
import Rebounds from '../Fields/Rebounds';
import Score from '../Fields/Score';
import Season from '../Fields/Season';
import Shooting from '../Fields/Shooting';
import Team from '../Fields/Team';

type TeamStatsFormContentProps = {
	mode: 'create' | 'edit';
	teamStats?: TeamStatsResponse;
};

const TeamStatsFormContent: React.FC<TeamStatsFormContentProps> = ({ mode, teamStats }) => {
	const { formState, watch } = useFormContext<TeamStatsFormData>();

	// Which period fields to show is a property of the game, not a choice made here.
	// Editing reads it off the loaded record; creating reads it off the picked game.
	// Passing empty filters while editing keeps the games query from firing.
	const isEdit = mode === 'edit';
	const season = watch('season');
	const league = watch('league');
	const gameId = watch('gameId');

	const { data: games } = useCompetitionGames(isEdit ? '' : season, isEdit ? '' : league?.toString() || '');

	const periodFormat: PeriodFormat =
		(isEdit
			? teamStats?.game?.period_format
			: games?.find((g) => g.id.toString() === gameId)?.period_format) ?? 'quarters';

	return (
		<div className="flex flex-col gap-2 w-full max-w-4xl mx-auto">
			{mode === 'create' && (
				<FormCard label="Filters">
					<Season />
					<Competition />
					<Game />
					<Team />
				</FormCard>
			)}
			<FormCard label="Coaches">
				<HeadCoach />
				<AssistantCoach />
			</FormCard>
			<FormCard label="Team Score">
				<Score periodFormat={periodFormat} />
			</FormCard>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
				<FormCard label="Shooting">
					<Shooting />
				</FormCard>
				<FormCard label="Rebounds">
					<Rebounds />
				</FormCard>
				<FormCard label="Passing">
					<Passing />
				</FormCard>
				<FormCard label="Defense">
					<Defense />
				</FormCard>
				<FormCard label="Misc">
					<Misc />
				</FormCard>
			</div>
			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Team Stats' : 'Create Team Stats'}
				/>
			</div>
		</div>
	);
};

export default TeamStatsFormContent;
