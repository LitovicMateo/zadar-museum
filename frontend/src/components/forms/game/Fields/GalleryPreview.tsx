import React from 'react';
import { useFormContext } from 'react-hook-form';

import ImagePreview from '@/components/image-preview/image-preview';
import { GameFormData } from '@/schemas/game-schema';

type GalleryPreviewProps = {
	previews: string[];
	setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
	ref: React.RefObject<HTMLInputElement | null>;
};

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ previews, setPreviews, ref }) => {
	const { setValue, watch } = useFormContext<GameFormData>();

	const removeImage = (index: number) => {
		const currentFiles: FileList | null = watch('gallery');
		if (!currentFiles) return;

		// Convert FileList → array
		const fileArray = Array.from(currentFiles);
		// Remove the file at given index
		fileArray.splice(index, 1);

		// Convert back → FileList
		const dataTransfer = new DataTransfer();
		fileArray.forEach((f) => dataTransfer.items.add(f));
		const newFileList = dataTransfer.files;

		// Update previews & form value
		setPreviews((prev) => prev.filter((_, i) => i !== index));
		setValue('gallery', newFileList.length > 0 ? newFileList : null);

		if (newFileList.length === 0 && ref.current) {
			ref.current.value = '';
		}
	};
	return (
		<div className="columns-2 md:columns-3 gap-4">
			{previews.map((preview, index) => (
				<div key={index} className="mb-4 break-inside-avoid">
					<ImagePreview preview={preview} removeImage={() => removeImage(index)} />
				</div>
			))}
		</div>
	);
};

export default GalleryPreview;
