import React from 'react';

const Portal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<section className="absolute top-10 z-9999 w-[300px] h-fit max-h-[400px] overflow-y-scroll bg-white shadow-md p-2 border border-gray-400 flex flex-col gap-2 rounded-sm">
			{children}
		</section>
	);
};

export default Portal;
