import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';

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
};

const TeamStatsFormContent: React.FC<TeamStatsFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<TeamStatsFormData>();
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
				<Score />
				<span className="text-sm text-muted-foreground">* If game was played in two halfs, use Q1 and Q2 field</span>
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
