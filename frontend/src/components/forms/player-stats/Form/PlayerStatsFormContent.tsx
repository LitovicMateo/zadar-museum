import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { PlayerStatsFormData } from '@/schemas/player-stats';

import Captain from '../Fields/Captain';
import Competition from '../Fields/Competition';
import Defense from '../Fields/Defense';
import Game from '../Fields/Game';
import Minutes from '../Fields/Minutes';
import Misc from '../Fields/Misc';
import Number from '../Fields/Number';
import Passing from '../Fields/Passing';
import Player from '../Fields/Player';
import Points from '../Fields/Points';
import Rebounds from '../Fields/Rebounds';
import Season from '../Fields/Season';
import Seconds from '../Fields/Seconds';
import Shooting from '../Fields/Shooting';
import Status from '../Fields/Status';
import Team from '../Fields/Team';

type PlayerStatsFormContentProps = {
	mode: 'create' | 'edit';
};

const PlayerStatsFormContent: React.FC<PlayerStatsFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<PlayerStatsFormData>();
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
			<Fieldset label="Player">
				<Player />
			</Fieldset>
			<Fieldset label="Details">
				<div className="grid grid-cols-3 gap-2">
					<Status />
					<Number />
					<Captain />
					<Minutes />
					<Seconds />
					<Points />
				</div>
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
					label={mode === 'edit' ? 'Update Player Stats' : 'Create Player Stats'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default PlayerStatsFormContent;
