import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/UI/Fieldset';
import FormFieldsWrapper from '@/components/UI/FormFieldsWrapper';
import SubmitButton from '@/components/UI/SubmitButton';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import AlternateNames from '../Fields/AlternateNames';
import Name from '../Fields/Name';
import ShortName from '../Fields/ShortName';
import WinningSeasons from '../Fields/WinningSeasons';

type CompetitionFormContentProps = {
	mode: 'create' | 'edit';
};

const CompetitionFormContent: React.FC<CompetitionFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<CompetitionFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<FormFieldsWrapper>
			<Fieldset label="Competition Information">
				<Name />
				<ShortName />
				<AlternateNames />
				<WinningSeasons />
			</Fieldset>
			<Fieldset label="Competition Logo">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</Fieldset>
			<Fieldset label="Logo Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
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
