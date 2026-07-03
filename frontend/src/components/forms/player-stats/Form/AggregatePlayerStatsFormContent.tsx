import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import FormGrid from '@/components/forms/shared/FormGrid';
import SubmitButton from '@/components/UI/SubmitButton';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';

import AggregateCompetition from '../Fields/AggregateCompetition';
import AggregateSeason from '../Fields/AggregateSeason';
import AggregateTeam from '../Fields/AggregateTeam';
import Defense from '../Fields/Defense';
import GamesPlayed from '../Fields/GamesPlayed';
import Misc from '../Fields/Misc';
import Passing from '../Fields/Passing';
import Player from '../Fields/Player';
import Points from '../Fields/Points';
import Rebounds from '../Fields/Rebounds';
import Shooting from '../Fields/Shooting';

type AggregatePlayerStatsFormContentProps = {
	mode: 'create' | 'edit';
};

/**
 * Entry form for historic "aggregate lines" — season/tournament summaries that have
 * no per-game boxscores (typically only games played + total points, occasionally a
 * few other totals). Stored as a game-less player_stat row. Any stat left blank is
 * saved as NULL and renders blank in the stats tables, never fabricated as 0.
 */
const AggregatePlayerStatsFormContent: React.FC<AggregatePlayerStatsFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<PlayerStatsFormData>();
	return (
		<div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
			<FormCard label="Tournament">
				<AggregateSeason />
				<AggregateCompetition />
				<AggregateTeam />
			</FormCard>
			<FormCard label="Player">
				<Player />
			</FormCard>
			<FormCard label="Totals">
				<FormGrid cols={2}>
					<GamesPlayed />
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
					label={mode === 'edit' ? 'Update Aggregate Line' : 'Create Aggregate Line'}
				/>
			</div>
		</div>
	);
};

export default AggregatePlayerStatsFormContent;
