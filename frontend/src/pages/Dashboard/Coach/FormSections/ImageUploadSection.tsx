import React from 'react';

import ImagePreview from '@/components/image-preview/image-preview';
import NoImage from '@/components/image-preview/no-image';
import Fieldset from '@/components/ui/fieldset';
import UploadButtonWrapper from '@/components/ui/upload-button-wrapper';

type ImageUploadSectionProps = {
	preview: string | null;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: () => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
	fileInputRef,
	handleImageChange,
	preview,
	removeImage
}) => {
	return (
		<>
			<Fieldset label="Profile Picture">
				<UploadButtonWrapper label="Upload Image">
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
			</Fieldset>

			<Fieldset label="Picture Preview">
				{preview ? <ImagePreview preview={preview} removeImage={removeImage} /> : <NoImage />}
			</Fieldset>
		</>
	);
};

export default ImageUploadSection;
