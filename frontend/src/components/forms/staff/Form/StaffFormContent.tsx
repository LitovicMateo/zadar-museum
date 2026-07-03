import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { StaffFormData } from '@/schemas/StaffSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Role from '../Fields/Role';

const StaffFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { formState, setFocus } = useFormContext<StaffFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (formState.isSubmitSuccessful) setFocus('first_name');
	}, [formState.isSubmitSuccessful, setFocus]);

	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_1fr] gap-2 items-start">
				<FormCard label="Personal Information">
					<FirstName />
					<LastName />
					<Role />
				</FormCard>
				<div className="flex flex-col gap-2">
					<FormCard label="Profile Picture">
						<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
					<FormCard label="Picture Preview">
						<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
				</div>
			</div>
			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Staff' : 'Create Staff'}
				/>
			</div>
		</div>
	);
};

export default StaffFormContent;
