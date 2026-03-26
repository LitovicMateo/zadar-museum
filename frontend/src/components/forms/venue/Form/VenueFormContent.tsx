import React from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/Fieldset';
import FormFieldsWrapper from '@/components/ui/FormFieldsWrapper';
import SubmitButton from '@/components/ui/SubmitButton';
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
		<FormFieldsWrapper>
			<Fieldset label="Venue Information">
				<Name />
				<City />
				<Country />
			</Fieldset>
			<Fieldset label="Venue Image">
				<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
			</Fieldset>
			<Fieldset label="Image Preview">
				<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
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
