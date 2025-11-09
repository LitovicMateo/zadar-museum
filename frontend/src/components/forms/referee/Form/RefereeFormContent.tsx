import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { RefereeFormData } from '@/schemas/referee-schema';

import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';

type RefereeFormContentProps = {
	mode: 'create' | 'edit';
};

const RefereeFormContent: React.FC<RefereeFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<RefereeFormData>();

	return (
		<FormFieldsWrapper>
			<Fieldset label="Referee Bio">
				<FirstName />
				<LastName />
				<Nationality />
			</Fieldset>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Referee' : 'Create Referee'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default RefereeFormContent;
