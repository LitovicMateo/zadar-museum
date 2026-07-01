import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { TeamFormData } from '@/schemas/TeamSchema';

import AlternateNames from '../Fields/AlternateNames';
import City from '../Fields/City';
import Country from '../Fields/Country';
import IsMainTeam from '../Fields/IsMainTeam';
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
		<div className="flex flex-col gap-3">
			<FormCard label="Team Information">
				<Name />
				<AlternateNames />
				<ShortName />
				<City />
				<Country />
				<IsMainTeam />
			</FormCard>
			<FormCard label="Team Logo">
				<Logo fileInputRef={fileInputRef} handleImageChange={handleImageChange} />
			</FormCard>
			<FormCard label="Logo Preview">
				<LogoPreview preview={preview} removeImage={removeImage} />
			</FormCard>
			<div className="w-full flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Team' : 'Create Team'}
				/>
			</div>
		</div>
	);
};

export default TeamFormContent;
