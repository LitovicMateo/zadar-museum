import React from 'react';

const SidebarWrapper: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
	const widthClass = isOpen ? 'w-64' : 'w-20';

	return (
		<aside
			aria-expanded={isOpen}
			className={`h-screen top-0 left-0 sticky transition-all duration-300 bg-gray-50 px-3 py-4 ${widthClass} border-r border-gray-100 hidden sm:block overflow-y-auto`}
		>
			<div className="min-h-full flex flex-col gap-4">{children}</div>
		</aside>
	);
};

export default SidebarWrapper;
