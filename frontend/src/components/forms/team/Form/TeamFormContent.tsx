import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Fieldset from '@/components/ui/fieldset';
import FormFieldsWrapper from '@/components/ui/form-fields-wrapper';
import SubmitButton from '@/components/ui/submit-button';
import { TeamFormData } from '@/schemas/team-schema';

import AlternateNames from '../Fields/AlternateNames';
import City from '../Fields/City';
import Country from '../Fields/Country';
import Logo from '../Fields/Logo';
import LogoPreview from '../Fields/LogoPreview';
import Name from '../Fields/Name';
import ShortName from '../Fields/ShortName';

type TeamFormContentProps = {
	mode: 'create' | 'edit';
};

const TeamFormContent: React.FC<TeamFormContentProps> = ({ mode }) => {
	const { formState, setValue } = useFormContext<TeamFormData>();

	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			setValue('image', file);
		}
	};

	const removeImage = () => {
		setPreview(null);
		setValue('image', null); // Reset react-hook-form field
		if (fileInputRef.current) {
			fileInputRef.current.value = ''; // Clear file input manually
		}
	};

	return (
		<FormFieldsWrapper>
			<Fieldset label="Team Information">
				<Name />
				<AlternateNames />
				<ShortName />
				<City />
				<Country />
			</Fieldset>
			<Fieldset label="Team Logo">
				<Logo fileInputRef={fileInputRef} handleImageChange={handleImageChange} />
			</Fieldset>
			<Fieldset label="Logo Preview">
				<LogoPreview preview={preview} removeImage={removeImage} />
			</Fieldset>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Team' : 'Create Team'}
				/>
			</div>
		</FormFieldsWrapper>
	);
};

export default TeamFormContent;
