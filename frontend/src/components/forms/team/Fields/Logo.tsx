import React from 'react';
import { useFormContext } from 'react-hook-form';

import UploadButtonWrapper from '@/components/ui/upload-button-wrapper';
import { TeamFormData } from '@/schemas/team-schema';

type LogoProps = {
	fileInputRef: React.RefObject<HTMLInputElement | null> | null;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Logo: React.FC<LogoProps> = ({ fileInputRef, handleImageChange }) => {
	const { register } = useFormContext<TeamFormData>();

	React.useEffect(() => {
		register('image', { required: 'Logo is required' });
	});
	return (
		<UploadButtonWrapper label="Team Logo (PNG)">
			<input
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					handleImageChange(e);
				}}
				ref={fileInputRef}
			/>
		</UploadButtonWrapper>
	);
};

export default Logo;
