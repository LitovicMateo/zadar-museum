import React from 'react';

const SidebarContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div id="sidebar-content" role="region" aria-label="Sidebar content" className="flex flex-col gap-4">
			{children}
		</div>
	);
};

export default React.memo(SidebarContent);
