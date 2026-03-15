import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { VenueFormData } from '@/schemas/VenueSchema';

import City from '../Fields/City';
import Country from '../Fields/Country';
import Name from '../Fields/Name';

const VenueFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { formState } = useFormContext<VenueFormData>();
	return (
		<FormFieldsWrapper>
			<Fieldset label="Venue Information">
				<Name />
				<City />
				<Country />
			</Fieldset>
			<div>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Venue' : 'Create Venue'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default VenueFormContent;
