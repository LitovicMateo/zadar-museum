import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { CoachFormData } from '@/schemas/CoachSchema';

import DateOfBirth from '../Fields/DateOfBirth';
import DateOfDeath from '../Fields/DateOfDeath';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import ProfileImage from '../Fields/ProfileImage';
import ProfileImagePreview from '../Fields/ProfileImagePreview';
import styles from '@/components/forms/shared/FormLabel.module.css';

const CoachFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { setFocus, formState } = useFormContext<CoachFormData>();
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (formState.isSubmitSuccessful) setFocus('first_name');
	}, [formState.isSubmitSuccessful, setFocus]);

	return (
		<FormFieldsWrapper>
			<Fieldset label="Personal Information">
				<FirstName />
				<LastName />
				<DateOfBirth />
				<DateOfDeath />
				<Nationality />
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
					label={mode === 'edit' ? 'Update Coach' : 'Create Coach'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default CoachFormContent;
