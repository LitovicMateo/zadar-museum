import React from 'react';

const SidebarWrapper: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
	const widthClass = isOpen ? 'w-64' : 'w-20';

	return (
		<aside
			aria-expanded={isOpen}
			className={`h-screen top-0 left-0 sticky transition-all duration-300 bg-gradient-to-b from-slate-50 to-white px-4 py-6 ${widthClass} border-r-2 border-gray-200 hidden sm:block overflow-y-auto shadow-sm`}
		>
			<div className="min-h-full flex flex-col gap-6">{children}</div>
		</aside>
	);
};

export default SidebarWrapper;
