import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
import { RefereeFormData } from '@/schemas/RefereeSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';

import styles from '@/components/forms/shared/FormLabel.module.css';

type RefereeFormContentProps = {
	mode: 'create' | 'edit';
};

const RefereeFormContent: React.FC<RefereeFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<RefereeFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<FormFieldsWrapper>
			<Fieldset label="Referee Bio">
				<FirstName />
				<LastName />
				<Nationality />
			</Fieldset>
			<Fieldset label="Profile Picture">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</Fieldset>
			<Fieldset label="Picture Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
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
