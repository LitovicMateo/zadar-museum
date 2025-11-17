import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { CoachFormData } from '@/schemas/coach-schema';

import DateOfBirth from '../Fields/DateOfBirth';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import ProfileImage from '../Fields/ProfileImage';
import ProfileImagePreview from '../Fields/ProfileImagePreview';

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
				<Nationality />
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
					label={mode === 'edit' ? 'Update Coach' : 'Create Coach'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default CoachFormContent;
