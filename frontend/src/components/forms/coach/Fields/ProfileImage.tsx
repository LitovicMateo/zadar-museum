import React from 'react';
import { useFormContext } from 'react-hook-form';

import UploadButtonWrapper from '@/components/ui/upload-button-wrapper';
import { CoachFormData } from '@/schemas/coach-schema';
import { getImageUrl } from '@/utils/getImageUrl';

type ProfileImageProps = {
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	preview: string | null;
	setPreview: React.Dispatch<React.SetStateAction<string | null>>;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ fileInputRef, setPreview, preview }) => {
	const { register, setValue, watch } = useFormContext<CoachFormData>();

	const image = watch('image');

	React.useEffect(() => {
		if (!image) {
			setPreview(null);
			return;
		}

		// ✅ Handle Strapi image object
		if (typeof image === 'object' && 'url' in image) {
			setPreview(getImageUrl(image.url));
			return;
		}

		// ✅ Handle uploaded File (manually created URL)
		if (image instanceof File) {
			const objectUrl = URL.createObjectURL(image);
			setPreview(objectUrl);

			// Clean up to avoid memory leaks
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [image, setPreview]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			setValue('image', file);
		}
	};

	React.useEffect(() => {
		register('image');
	}, [register]);

	return (
		<UploadButtonWrapper label={preview ? 'Change Image' : 'Upload Image'}>
			<input className="hidden" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
		</UploadButtonWrapper>
	);
};

export default ProfileImage;
