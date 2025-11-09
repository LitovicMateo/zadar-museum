import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { VenueDetailsResponse, VenueFormData } from '@/types/api/venue';

import VenueFormContent from './Form/VenueFormContent';
import VenueFormProvider from './Form/VenueFormProvider';

type VenueFormProps = {
	onSubmit: (data: VenueFormData) => void;
	defaultValues?: VenueFormData;
	mode: 'create' | 'edit';
	venue?: VenueDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: VenueFormData = {
	name: '',
	city: '',
	country: ''
};

const VenueForm: React.FC<VenueFormProps> = ({ onSubmit, defaultValues = emptyDefaults, mode, venue, isSuccess }) => {
	return (
		<FormWrapper>
			<VenueFormProvider onSubmit={onSubmit} defaultValues={defaultValues} venue={venue} isSuccess={isSuccess}>
				<VenueFormContent mode={mode} />
			</VenueFormProvider>
		</FormWrapper>
	);
};

export default VenueForm;
