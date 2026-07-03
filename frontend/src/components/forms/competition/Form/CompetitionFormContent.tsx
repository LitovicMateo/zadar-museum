import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
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
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_1fr] gap-2 items-start">
				<FormCard label="Competition Information">
					<Name />
					<ShortName />
					<AlternateNames />
					<WinningSeasons />
				</FormCard>
				<div className="flex flex-col gap-2">
					<FormCard label="Competition Logo">
						<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
					<FormCard label="Logo Preview">
						<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
				</div>
			</div>
			<div>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Competition' : 'Create Competition'}
				/>
			</div>
		</div>
	);
};

export default CompetitionFormContent;
