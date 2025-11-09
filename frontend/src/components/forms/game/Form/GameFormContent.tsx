import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { GameFormData } from '@/schemas/game-schema';

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
import HomeTeam from '../Fields/HomeTeam';
import HomeTeamName from '../Fields/HomeTeamName';
import MainReferee from '../Fields/MainReferee';
import NeutralVenue from '../Fields/NeutralVenue';
import Nulled from '../Fields/Nulled';
import Round from '../Fields/Round';
import Season from '../Fields/Season';
import SecondReferee from '../Fields/SecondReferee';
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
		<FormFieldsWrapper>
			<Fieldset label="Game Details">
				<Competition />
				<CompetitionName />
				<Season />
				<Date />
				<Stage />
				<Round />
				<Venue />
				<NeutralVenue />
				<Attendance />
				<Nulled />
				<Forfieted />
				<ForfeitedBy />
			</Fieldset>
			<Fieldset label="Teams">
				<HomeTeam />
				<HomeTeamName />
				<AwayTeam />
				<AwayTeamName />
			</Fieldset>
			<Fieldset label="Referees">
				<MainReferee />
				<SecondReferee />
				<ThirdReferee />
			</Fieldset>
			<Fieldset label="Gallery">
				<Gallery ref={fileInputRef} previews={previews} setPreviews={setPreviews} />
			</Fieldset>
			<Fieldset label="Gallery Preview">
				<GalleryPreview previews={previews} setPreviews={setPreviews} ref={fileInputRef} />
			</Fieldset>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Game' : 'Create Game'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default GameFormContent;
