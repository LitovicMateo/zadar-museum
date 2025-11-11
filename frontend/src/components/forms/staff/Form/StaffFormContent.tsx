import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { StaffFormData } from '@/schemas/staff-schema';

import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Role from '../Fields/Role';

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
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Staff' : 'Create Staff'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default StaffFormContent;
