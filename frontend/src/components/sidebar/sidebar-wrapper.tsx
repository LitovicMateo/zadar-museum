import React from 'react';

const SidebarWrapper: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
	return (
		<aside
			className={`re ${isOpen ? 'w-[300px]' : 'w-[80px]'} h-svh transition-width duration-300 bg-gray-50 border-r-1 border-solid border-gray-100 px-4 hidden sm:block`}
		>
			{children}
		</aside>
	);
};

export default SidebarWrapper;
