import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import ActivePlayer from '../Fields/ActivePlayer';
import DateOfBirth from '../Fields/DateOfBirth';
import DateOfDeath from '../Fields/DateOfDeath';
import FirstName from '../Fields/FirstName';
import Height from '../Fields/Height';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import PrimaryPosition from '../Fields/PrimaryPosition';
import { SecondaryPosition } from '../Fields/SecondaryPosition';
import styles from '@/components/forms/shared/FormLabel.module.css';

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
				<Height />
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
			<div className={styles.centerWrapper}>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Player' : 'Create Player'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default PlayerFormContent;
