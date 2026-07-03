import React from 'react';

import FormCard from '@/components/forms/shared/FormCard';
import ImagePreview from '@/components/UI/ImagePreview/ImagePreview';
import NoImage from '@/components/UI/ImagePreview/NoImage';
import UploadButtonWrapper from '@/components/UI/UploadButtonWrapper';

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
			<FormCard label="Profile Picture">
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
			</FormCard>

			<FormCard label="Picture Preview">
				{preview ? <ImagePreview preview={preview} removeImage={removeImage} /> : <NoImage />}
			</FormCard>
		</>
	);
};

export default ImageUploadSection;
