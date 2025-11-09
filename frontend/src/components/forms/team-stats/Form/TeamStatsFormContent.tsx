import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

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
		<FormFieldsWrapper>
			{mode === 'create' && (
				<Fieldset label="Filters">
					<Season />
					<Competition />
					<Game />
					<Team />
				</Fieldset>
			)}
			<Fieldset label="Coaches">
				<HeadCoach />
				<AssistantCoach />
			</Fieldset>
			<Fieldset label="Team Score">
				<Score />
				<span className="text-sm text-gray-400">* If game was played in two halfs, use Q1 and Q2 field</span>
			</Fieldset>
			<Fieldset label="Shooting">
				<Shooting />
			</Fieldset>
			<Fieldset label="Rebounds">
				<Rebounds />
			</Fieldset>
			<Fieldset label="Passing">
				<Passing />
			</Fieldset>
			<Fieldset label="Defense">
				<Defense />
			</Fieldset>
			<Fieldset label="Misc">
				<Misc />
			</Fieldset>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Team Stats' : 'Create Team Stats'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default TeamStatsFormContent;
