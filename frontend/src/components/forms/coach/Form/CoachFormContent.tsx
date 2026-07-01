import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { CoachFormData } from '@/schemas/CoachSchema';

import DateOfBirth from '../Fields/DateOfBirth';
import DateOfDeath from '../Fields/DateOfDeath';
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
		<div className="flex flex-col gap-3">
			<FormCard label="Personal Information">
				<FirstName />
				<LastName />
				<DateOfBirth />
				<DateOfDeath />
				<Nationality />
			</FormCard>

			<FormCard label="Profile Picture">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>
			<FormCard label="Picture Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>

			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Coach' : 'Create Coach'}
				/>
			</div>
		</div>
	);
};

export default CoachFormContent;
