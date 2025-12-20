import React from 'react';

const NoImage: React.FC = () => {
	return (
		<div
			role="img"
			aria-label="No image selected"
			className="bg-gray-50 w-full aspect-square rounded-md flex items-center justify-center text-gray-400 uppercase font-sans"
		>
			No image selected
		</div>
	);
};

export default React.memo(NoImage);
