import React from 'react';

type SidebarGroupProps = {
	label?: string;
	children: React.ReactNode;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
	const headingId = label ? `sidebar-group-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;

	return (
		<div className="px-2 py-1" role="group" aria-labelledby={headingId}>
			{label && (
				<div id={headingId} className="text-xs text-gray-400 uppercase mb-2">
					{label}
				</div>
			)}
			<div className="space-y-1">{children}</div>
		</div>
	);
};

export default React.memo(SidebarGroup);
