import React from 'react';

const PageContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <section className="w-full max-w-[800px] mx-auto flex flex-col gap-8 px-4 py-8 lg:px-0">{children}</section>;
};

export default PageContentWrapper;
