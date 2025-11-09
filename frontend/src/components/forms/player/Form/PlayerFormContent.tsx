import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { PlayerFormData } from '@/schemas/player-schema';

import ActivePlayer from '../Fields/ActivePlayer';
import DateOfBirth from '../Fields/DateOfBirth';
import DateOfDeath from '../Fields/DateOfDeath';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import PrimaryPosition from '../Fields/PrimaryPosition';
import ProfileImage from '../Fields/ProfileImage';
import ProfileImagePreview from '../Fields/ProfileImagePreview';
import { SecondaryPosition } from '../Fields/SecondaryPosition';

type PlayerFormContentProps = {
	mode: 'create' | 'edit';
};

const PlayerFormContent: React.FC<PlayerFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<PlayerFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<FormFieldsWrapper>
			<Fieldset label="Player Bio">
				<FirstName />
				<LastName />
				<DateOfBirth />
				<DateOfDeath />
				<Nationality />
				<ActivePlayer />
			</Fieldset>
			<Fieldset label="Positions">
				<PrimaryPosition />
				<SecondaryPosition />
			</Fieldset>
			<Fieldset label="Profile Picture">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</Fieldset>
			<Fieldset label="Picture Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</Fieldset>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Player' : 'Create Player'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default PlayerFormContent;
