import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { RefereeFormData } from '@/schemas/RefereeSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import FirstName from '../Fields/FirstName';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';

type RefereeFormContentProps = {
	mode: 'create' | 'edit';
};

const RefereeFormContent: React.FC<RefereeFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<RefereeFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<div className="flex flex-col gap-3">
			<FormCard label="Referee Bio">
				<FirstName />
				<LastName />
				<Nationality />
			</FormCard>
			<FormCard label="Profile Picture">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>
			<FormCard label="Picture Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>
			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Referee' : 'Create Referee'}
				/>
			</div>
		</div>
	);
};

export default RefereeFormContent;
