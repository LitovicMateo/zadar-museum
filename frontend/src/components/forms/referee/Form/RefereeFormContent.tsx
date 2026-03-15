import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { RefereeFormData } from '@/schemas/RefereeSchema';

import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import styles from '@/components/forms/shared/FormLabel.module.css';

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
			<div className={styles.centerWrapper}>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Referee' : 'Create Referee'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default RefereeFormContent;
