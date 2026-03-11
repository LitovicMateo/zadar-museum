import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { StaffFormData } from '@/schemas/StaffSchema';

import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Role from '../Fields/Role';
import styles from '@/components/forms/shared/FormLabel.module.css';

const StaffFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { formState, setFocus } = useFormContext<StaffFormData>();

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
