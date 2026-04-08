import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/UI/Fieldset';
import FormFieldsWrapper from '@/components/UI/FormFieldsWrapper';
import SubmitButton from '@/components/UI/SubmitButton';
import { StaffFormData } from '@/schemas/StaffSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Role from '../Fields/Role';

import styles from '@/components/forms/shared/FormLabel.module.css';

const StaffFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { formState, setFocus } = useFormContext<StaffFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (formState.isSubmitSuccessful) setFocus('first_name');
	}, [formState.isSubmitSuccessful, setFocus]);

	return (
		<FormFieldsWrapper>
			<Fieldset label="Personal Information">
				<FirstName />
				<LastName />
				<Role />
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
					label={mode === 'edit' ? 'Update Staff' : 'Create Staff'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default StaffFormContent;
