import React from 'react';

const Container: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className="flex flex-col gap-2 w-full justify-baseline items-start font-abel ">{children}</div>;
};

export default Container;
