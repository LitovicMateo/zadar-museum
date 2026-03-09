import React from 'react';

const PageContentWrapper: React.FC<{ children: React.ReactNode; width?: string; fillHeight?: boolean }> = ({ children, width, fillHeight }) => {
	return (
		<section
			className={`w-full max-w-[800px] mx-auto flex flex-col gap-8 px-2 xl:px-0${fillHeight ? ' flex-1 min-h-0 overflow-hidden' : ''}`}
			style={{ maxWidth: width }}
		>
			{children}
		</section>
	);
};

export default PageContentWrapper;
