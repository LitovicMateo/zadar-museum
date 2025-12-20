import React from 'react';

import { X } from 'lucide-react';

type ImagePreviewProps = {
	preview: string;
	removeImage: () => void;
	alt?: string;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ preview, removeImage, alt }) => {
	return (
		<div className="mt-2 relative w-fit col-span-2 shadow-lg rounded-sm border border-gray-200">
			<button
				type="button"
				onClick={removeImage}
				aria-label="Remove image"
				className="absolute top-2 right-2 rounded-full text-red-600 border-1 border-solid border-red-600 cursor-pointer"
			>
				<X size={14} />
			</button>
			<img
				src={preview}
				alt={alt ?? 'Image preview'}
				loading="lazy"
				className="aspect-square object-cover rounded"
			/>
		</div>
	);
};

export default React.memo(ImagePreview);
