import React from 'react';

const PageWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className="rounded-sm w-fit max-w-full overflow-x-scroll h-screen">{children}</div>;
};

export default PageWrapper;
