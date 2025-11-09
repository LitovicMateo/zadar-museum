import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { RefereeFormData } from '@/schemas/referee-schema';
import { RefereeDetailsResponse } from '@/types/api/referee';

import RefereeFormContent from './Form/RefereeFormContent';
import RefereeFormProvider from './Form/RefereeFormProvider';

type RefereeFormProps = {
	onSubmit: (data: RefereeFormData) => void;
	defaultValues?: RefereeFormData;
	mode: 'create' | 'edit';
	referee?: RefereeDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: RefereeFormData = {
	first_name: '',
	last_name: '',
	nationality: ''
};

const RefereeForm: React.FC<RefereeFormProps> = ({
	mode,
	onSubmit,
	defaultValues = emptyDefaults,
	referee,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<RefereeFormProvider
				onSubmit={onSubmit}
				defaultValues={defaultValues}
				referee={referee}
				isSuccess={isSuccess}
			>
				<RefereeFormContent mode={mode} />
			</RefereeFormProvider>
		</FormWrapper>
	);
};

export default RefereeForm;
