import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { CompetitionFormData } from '@/schemas/competition-schema';

import AlternateNames from '../Fields/AlternateNames';
import Name from '../Fields/Name';
import ShortName from '../Fields/ShortName';
import WinningSeasons from '../Fields/WinningSeasons';

type CompetitionFormContentProps = {
	mode: 'create' | 'edit';
};

const CompetitionFormContent: React.FC<CompetitionFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<CompetitionFormData>();

	return (
		<FormFieldsWrapper>
			<Fieldset label="Competition Information">
				<Name />
				<ShortName />
				<AlternateNames />
				<WinningSeasons />
			</Fieldset>
			<div>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Competition' : 'Create Competition'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default CompetitionFormContent;
