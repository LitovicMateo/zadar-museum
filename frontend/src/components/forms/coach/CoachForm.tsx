import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { CoachFormData } from '@/schemas/coach-schema';
import { CoachDetailsResponse } from '@/types/api/coach';

import CoachFormContent from './Form/CoachFormContent';
import CoachFormProvider from './Form/CoachFormProvider';

type CoachFormProps = {
	onSubmit: (data: CoachFormData) => void;
	defaultValues?: CoachFormData;
	mode: 'create' | 'edit';
	coach?: CoachDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: CoachFormData = {
	first_name: '',
	last_name: '',
	date_of_birth: null,
	date_of_death: null,
	nationality: '',
	image: null
};

const CoachForm: React.FC<CoachFormProps> = ({ onSubmit, defaultValues = emptyDefaults, mode, coach, isSuccess }) => {
	return (
		<FormWrapper>
			<CoachFormProvider onSubmit={onSubmit} defaultValues={defaultValues} coach={coach} isSuccess={isSuccess}>
				<CoachFormContent mode={mode} />
			</CoachFormProvider>
		</FormWrapper>
	);
};

export default CoachForm;
