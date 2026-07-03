import React from 'react';

import { ImageOff } from 'lucide-react';

const NoImage: React.FC = () => {
	return (
		<div className="mx-auto flex h-[150px] w-[150px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-center">
			<ImageOff size={26} strokeWidth={1.5} className="text-gray-400" />
			<span className="text-xs font-medium text-gray-500">No image selected</span>
		</div>
	);
};

export default NoImage;
