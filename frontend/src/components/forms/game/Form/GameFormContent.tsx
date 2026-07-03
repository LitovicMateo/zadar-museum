import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { GameFormData } from '@/schemas/GameSchema';

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
import Round from '../Fields/Round';
import Season from '../Fields/Season';
import SecondReferee from '../Fields/SecondReferee';
import Staffers from '../Fields/Staffers';
import Stage from '../Fields/Stage';
import ThirdReferee from '../Fields/ThirdReferee';
import Venue from '../Fields/Venue';

type GameFormContentProps = {
	mode: 'create' | 'edit';
};

const GameFormContent: React.FC<GameFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<GameFormData>();

	const [previews, setPreviews] = React.useState<string[]>([]);

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
