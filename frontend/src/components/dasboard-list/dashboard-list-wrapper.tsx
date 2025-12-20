import React from 'react';

const DashboardListWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
	const headingId = `latest-${title.replace(/\s+/g, '-').toLowerCase()}`;
	return (
		<section className="w-full max-w-md p-4" aria-labelledby={headingId} role="region">
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
					<h2 id={headingId} className="text-lg font-semibold text-gray-700 font-mono">
						Latest {title}
					</h2>
					<span className="text-xs text-gray-400">Recent</span>
				</div>
				<div className="p-2">{children}</div>
			</div>
		</section>
	);
};

export default React.memo(DashboardListWrapper);
