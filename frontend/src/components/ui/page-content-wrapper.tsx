import React from 'react';

const PageContentWrapper: React.FC<{ children: React.ReactNode; width?: string }> = ({ children, width }) => {
	return (
		<section
			className="w-full max-w-[800px] mx-auto flex flex-col gap-8 px-4 py-8 xl:px-0"
			style={{ maxWidth: width }}
		>
			{children}
		</section>
	);
};

export default PageContentWrapper;
