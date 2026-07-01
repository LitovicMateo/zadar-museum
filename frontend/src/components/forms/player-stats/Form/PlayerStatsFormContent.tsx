import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import FormGrid from '@/components/forms/shared/FormGrid';
import SubmitButton from '@/components/UI/SubmitButton';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';

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
		<div className="flex flex-col gap-3">
			{mode === 'create' && (
				<FormCard label="Filters">
					<Season />
					<Competition />
					<Game />
					<Team />
				</FormCard>
			)}
			<FormCard label="Player">
				<Player />
			</FormCard>
			<FormCard label="Details">
				<FormGrid cols={3}>
					<Status />
					<Number />
					<Captain />
					<Minutes />
					<Seconds />
					<Points />
				</FormGrid>
			</FormCard>
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
			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Player Stats' : 'Create Player Stats'}
				/>
			</div>
		</div>
	);
};

export default PlayerStatsFormContent;
