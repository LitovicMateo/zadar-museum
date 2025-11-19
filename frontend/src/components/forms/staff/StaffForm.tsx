import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { StaffFormData } from '@/schemas/staff-schema';
import { StaffDetailsResponse } from '@/types/api/staff';

import StaffFormContent from './Form/StaffFormContent';
import StaffFormProvider from './Form/StaffFormProvider';

type StaffFormProps = {
	onSubmit: (data: StaffFormData) => void;
	defaultValues?: StaffFormData;
	mode: 'create' | 'edit';
	staff?: StaffDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: StaffFormData = {
	first_name: '',
	last_name: '',
	role: 'Assistant coach'
};

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, defaultValues = emptyDefaults, mode, staff, isSuccess }) => {
	return (
		<FormWrapper>
			<StaffFormProvider onSubmit={onSubmit} defaultValues={defaultValues} staff={staff} isSuccess={isSuccess}>
				<StaffFormContent mode={mode} />
			</StaffFormProvider>
		</FormWrapper>
	);
};

export default StaffForm;
