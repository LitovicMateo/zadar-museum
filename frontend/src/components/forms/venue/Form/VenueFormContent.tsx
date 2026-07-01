import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { VenueFormData } from '@/schemas/VenueSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import City from '../Fields/City';
import Country from '../Fields/Country';
import Name from '../Fields/Name';

const VenueFormContent: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
	const { formState } = useFormContext<VenueFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<div className="flex flex-col gap-3">
			<FormCard label="Venue Information">
				<Name />
				<City />
				<Country />
			</FormCard>
			<FormCard label="Venue Image">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>
			<FormCard label="Image Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</FormCard>
			<div>
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Venue' : 'Create Venue'}
				/>
			</div>
		</div>
	);
};

export default VenueFormContent;
