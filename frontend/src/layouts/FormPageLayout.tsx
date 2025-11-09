import React from 'react';

const FormPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<main className="w-full max-w-7xl flex flex-col lg:grid grid-cols-[1fr_500px] gap-4 items-center lg:items-start justify-items-center">
			{children}
		</main>
	);
};

export default FormPageLayout;
