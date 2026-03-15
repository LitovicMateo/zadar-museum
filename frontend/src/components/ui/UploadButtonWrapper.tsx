import React from 'react';

import { UploadIcon } from 'lucide-react';

type UploadButtonWrapperProps = {
	children: React.ReactNode;
	label: string;
};

const UploadButtonWrapper: React.FC<UploadButtonWrapperProps> = ({ children, label }) => {
	return (
		<label className="h-full bg-gray-50 text-xs flex justify-center items-center gap-2 text-gray-500 py-2 border-1 border-solid border-gray-200 rounded-sm text-gray-5 hover:bg-gray-100 hover:shadow-xs transition-all duration-200 cursor-pointer">
			{children}
			<span>{label}</span>
			<span>
				<UploadIcon size={14} />
			</span>
		</label>
	);
};

export default UploadButtonWrapper;
