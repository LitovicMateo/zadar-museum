import React from 'react';
import { useFormContext } from 'react-hook-form';

import ImagePreview from '@/components/image-preview/image-preview';
import NoImage from '@/components/image-preview/no-image';
import { CoachFormData } from '@/schemas/coach-schema';

type ImagePreviewProps = {
	preview: string | null;
	setPreview: React.Dispatch<React.SetStateAction<string | null>>;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const ProfileImagePreview: React.FC<ImagePreviewProps> = ({ preview, setPreview, fileInputRef }) => {
	const { setValue } = useFormContext<CoachFormData>();
	const removeImage = () => {
		setPreview(null);
		setValue('image', null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	if (!preview) return <NoImage />;

	return <ImagePreview preview={preview} removeImage={removeImage} />;
};

export default ProfileImagePreview;
