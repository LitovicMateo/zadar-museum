import React from 'react';

import { X } from 'lucide-react';

type LogoPreviewProps = {
	preview: string | null;
	removeImage: () => void;
};

const LogoPreview: React.FC<LogoPreviewProps> = ({ preview, removeImage }) => {
	if (!preview) {
		return null;
	}

	return (
		<div className="mt-2 relative w-fit col-span-2 shadow-lg rounded-sm border border-gray-200">
			<button
				type="button"
				onClick={removeImage}
				className="absolute top-2 right-2 rounded-full text-red-600 border-1 border-solid border-red-600 cursor-pointer"
			>
				<X size={14} />
			</button>
			<img src={preview} alt="Preview" className="aspect-square object-cover rounded" />
		</div>
	);
};

export default LogoPreview;
