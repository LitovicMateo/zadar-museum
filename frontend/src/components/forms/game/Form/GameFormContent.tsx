import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { GameFormData } from '@/schemas/GameSchema';
import { GameDetailsResponse } from '@/types/api/Game';

import EditGameWarning from './EditGameWarning';
import Attendance from '../Fields/Attendance';
import AwayTeam from '../Fields/AwayTeam';
import AwayTeamName from '../Fields/AwayTeamName';
import Competition from '../Fields/Competition';
import CompetitionName from '../Fields/CompetitionName';
import Date from '../Fields/Date';
import Forfieted from '../Fields/Forfeited';
import ForfeitedBy from '../Fields/ForfeitedBy';
import Gallery from '../Fields/Gallery';
import GalleryPreview from '../Fields/GalleryPreview';
import GroupName from '../Fields/GroupName';
import HomeTeam from '../Fields/HomeTeam';
import HomeTeamName from '../Fields/HomeTeamName';
import MainReferee from '../Fields/MainReferee';
import NeutralVenue from '../Fields/NeutralVenue';
import Nulled from '../Fields/Nulled';
import PeriodFormat from '../Fields/PeriodFormat';
import Round from '../Fields/Round';
import Season from '../Fields/Season';
import SecondReferee from '../Fields/SecondReferee';
import Staffers from '../Fields/Staffers';
import Stage from '../Fields/Stage';
import ThirdReferee from '../Fields/ThirdReferee';
import Venue from '../Fields/Venue';

type GameFormContentProps = {
	mode: 'create' | 'edit';
	game?: GameDetailsResponse;
};

const GameFormContent: React.FC<GameFormContentProps> = ({ mode, game }) => {
	const { formState, watch } = useFormContext<GameFormData>();

	const [previews, setPreviews] = React.useState<string[]>([]);

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	// Warn before saving a format change on a game that already has scores, since
	// the two directions are not symmetric — see the game lifecycle hook.
	const selectedFormat = watch('period_format');
	const savedFormat = game?.period_format;
	const formatChangeWarning =
		mode === 'edit' && savedFormat && selectedFormat !== savedFormat ? (
			selectedFormat === 'halves' ? (
				<>
					Saving will fold each team&apos;s quarter scores into halves — <strong>1H = Q1 + Q2</strong> and{' '}
					<strong>2H = Q3 + Q4</strong> — and clear the quarters. Total scores stay the same, but the
					quarter-by-quarter breakdown is lost and cannot be recovered.
				</>
			) : (
				<>
					A half cannot be split back into two quarters, so saving will <strong>clear the recorded period
					scores</strong> for both teams. Each team&apos;s total will drop until the quarters are entered again.
				</>
			)
		) : null;

	return (
		<div className="flex flex-col gap-2">
			<FormCard label="Game Details">
				<Competition />
				<CompetitionName />
				<Season />
				<Date />
				<Stage />
				<GroupName />
				<Round />
				<PeriodFormat />
				{formatChangeWarning && (
					<EditGameWarning title="Changing the period format will rewrite team scores" message={formatChangeWarning} />
				)}
				<Venue />
				<NeutralVenue />
				<Attendance />
				<Nulled />
				<Forfieted />
				<ForfeitedBy />
			</FormCard>
			<FormCard label="Teams">
				<HomeTeam />
				<HomeTeamName />
				<AwayTeam />
				<AwayTeamName />
			</FormCard>
			<FormCard label="Referees">
				<MainReferee />
				<SecondReferee />
				<ThirdReferee />
			</FormCard>
			<FormCard label="Staff">
				<Staffers />
			</FormCard>
			<FormCard label="Gallery">
				<Gallery ref={fileInputRef} previews={previews} setPreviews={setPreviews} />
			</FormCard>
			<FormCard label="Gallery Preview">
				<GalleryPreview previews={previews} setPreviews={setPreviews} ref={fileInputRef} />
			</FormCard>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Game' : 'Create Game'}
				/>
			</div>
		</div>
	);
};

export default GameFormContent;
