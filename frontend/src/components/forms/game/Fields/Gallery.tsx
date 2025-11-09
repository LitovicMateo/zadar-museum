import React from 'react';
import { useFormContext } from 'react-hook-form';

import UploadButtonWrapper from '@/components/ui/upload-button-wrapper';
import { GameFormData } from '@/schemas/game-schema';

type GalleryProps = {
	ref: React.RefObject<HTMLInputElement | null>;
	previews: string[];
	setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
};
const Gallery: React.FC<GalleryProps> = ({ ref, previews, setPreviews }) => {
	const { setValue } = useFormContext<GameFormData>();
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			// Append new previews
			const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
			setPreviews((prev) => [...prev, ...newPreviews]);

			// Store as FileList in react-hook-form
			setValue('gallery', files);
		}
	};

	return (
		<UploadButtonWrapper label={previews.length > 0 ? 'Add More Images' : 'Upload Images'}>
			<input className="hidden" type="file" accept="image/*" multiple onChange={handleImageChange} ref={ref} />
		</UploadButtonWrapper>
	);
};

export default Gallery;
